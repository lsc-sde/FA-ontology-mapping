import { useState, useEffect, useCallback } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Node,
    Edge,
    Background,
    Controls,
    BackgroundVariant,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ontologyData, FrameworkTag, OntologyNode } from '../data/ontology';
import CustomNode, { GraphNodeData } from './CustomNode';
import PieChartBackground from './PieChartBackground';
import SafesRing from './SafesRing';
import PerimeterEdge from './PerimeterEdge';
import { Lock, Unlock } from 'lucide-react';

interface GraphViewerProps {
    activeFilter: FrameworkTag | null;
    // `null` clears the current selection (e.g. clicking the empty pane).
    onNodeSelect: (node: OntologyNode | null) => void;
    searchQuery: string;
    onFilterChange: (filter: FrameworkTag | null) => void;
    selectedNode?: OntologyNode | null;
}

const nodeTypes = {
    custom: CustomNode,
    pieChart: PieChartBackground,
    safesRing: SafesRing,
};

const edgeTypes = {
    perimeter: PerimeterEdge,
};

// Layout constants
const PIE_RADIUS = 500;
const LAYER2_RADIUS = 320;       // What (green) inner hexagon
const LAYER2B_RADIUS = 410;      // What sub-concepts (governance, infra, data protection)
const LAYER3_RADIUS = 500;       // How (purple) — anchored at pie circle edge
const LAYER3B_RADIUS = 570;      // How sub-children (SDC children)
const SAFES_RING_INNER = 640;    // Six Safes ring inner edge
const SAFES_RING_OUTER = 693;    // Six Safes ring outer edge (~53px = 1/3 of LAYER2_SIZE)
const LAYER4_RADIUS = 840;       // Who (providers) — clean outer ring past the Safes ring
const CENTER_SIZE = 240;
const LAYER2_SIZE = 160;
const MID_NODE_SIZE = 120;        // What sub-concepts on the LAYER2B ring
const HOW_NODE_SIZE = 130;
const HOW_SUB_SIZE = 110;         // SDC sub-child size
const WHO_NODE_SIZE = 110;

// Layer definitions
const LAYER_META = [
    { label: 'Why', layer: 0, color: '#10b981' },
    { label: 'What', layer: 1, color: '#0ea5e9' },
    { label: 'How', layer: 2, color: '#a855f7' },
    { label: 'Who', layer: 3, color: '#f59e0b' },
];

function clockPosition(clockAngleDeg: number, radius: number, nodeSize: number) {
    const rad = ((clockAngleDeg - 90) * Math.PI) / 180;
    return {
        x: radius * Math.cos(rad) - nodeSize / 2,
        y: radius * Math.sin(rad) - nodeSize / 2,
    };
}
function buildNodes(): Node[] {
    const pieNode: Node = {
        id: 'pie-background',
        type: 'pieChart',
        position: { x: -PIE_RADIUS, y: -PIE_RADIUS },
        data: { radius: PIE_RADIUS },
        draggable: false,
        selectable: false,
        focusable: false,
    };

    // Six Safes ring — positioned between How and Who layers
    const safesRingNode: Node = {
        id: 'safes-ring',
        type: 'safesRing',
        position: { x: -SAFES_RING_OUTER, y: -SAFES_RING_OUTER },
        data: { innerRadius: SAFES_RING_INNER, outerRadius: SAFES_RING_OUTER },
        draggable: false,
        selectable: false,
        focusable: false,
        zIndex: 0,
    };

    // Layer 0 — Why (center, topmost z-index)
    const centerData = ontologyData['fed_ecosystem'];
    const centerNode: Node = {
        id: 'fed_ecosystem',
        type: 'custom',
        position: { x: -CENTER_SIZE / 2, y: -CENTER_SIZE / 2 },
        zIndex: 10,
        data: {
            ...centerData,
            activeFilter: null,
            dimmed: false,
            layer: 0,
            nodeSize: CENTER_SIZE,
            showTags: false,
        },
    };

    // Layer 1 — What
    const layer2Items = [
        { id: 'fed_people', clockAngle: 0 },
        { id: 'fed_access', clockAngle: 60 }, // On the border of People and Data
        { id: 'fed_data', clockAngle: 120 },
        { id: 'fed_storage', clockAngle: 180 }, // On the border of Data and Analytics
        { id: 'fed_analytics', clockAngle: 240 },
        { id: 'fed_outputs', clockAngle: 300 }, // On the border of Analytics and People
    ];

    const layer2Nodes: Node[] = layer2Items.map(({ id, clockAngle }) => {
        const pos = clockPosition(clockAngle, LAYER2_RADIUS, LAYER2_SIZE);
        const nodeData = ontologyData[id];
        return {
            id,
            type: 'custom',
            position: pos,
            zIndex: 5,
            data: {
                ...nodeData,
                activeFilter: null,
                dimmed: false,
                layer: 1,
                nodeSize: LAYER2_SIZE,
                showTags: true,
            },
        };
    });

    // Layer 1b — What sub-concepts, on an intermediate ring just outside the
    // green hexagon. These are `children` of the What nodes in the ontology and
    // were previously absent from the graph entirely.
    const layer2bItems = [
        { id: 'fed_gov', clockAngle: 20 },            // child of fed_people
        { id: 'fed_infra', clockAngle: 100 },         // child of fed_data
        { id: 'data_protect', clockAngle: 140 },      // child of fed_data
        { id: 'research_outputs', clockAngle: 285 },  // child of fed_ecosystem
    ];

    const layer2bNodes: Node[] = layer2bItems.map(({ id, clockAngle }) => {
        const pos = clockPosition(clockAngle, LAYER2B_RADIUS, MID_NODE_SIZE);
        return {
            id,
            type: 'custom',
            position: pos,
            zIndex: 4,
            data: {
                ...ontologyData[id],
                activeFilter: null,
                dimmed: false,
                layer: 1,
                nodeSize: MID_NODE_SIZE,
                showTags: true,
            },
        };
    });

    // Layer 2 — How (enablers, anchored at pie circle edge for geometric ring)
    const layer3Items: {
        id: string;
        parentId: string;
        clockAngle: number;
        radius?: number;
        nodeSize?: number;
    }[] = [
        // Moved off the centre point: it previously shared its centre with
        // fed_ecosystem as a "halo", which read as an overlap bug.
        { id: 'dacs', parentId: 'access_process', clockAngle: 50 },
        { id: 'access_process', parentId: 'fed_gov', clockAngle: 10 },
        { id: 'data_min', parentId: 'fed_gov', clockAngle: 350 },
        { id: 'pseudonym', parentId: 'data_protect', clockAngle: 110 },
        { id: 'anonymise', parentId: 'data_protect', clockAngle: 130 },
        { id: 'synth_data', parentId: 'data_protect', clockAngle: 170 },
        { id: 'intermediate_outputs', parentId: 'research_outputs', clockAngle: 290 },
        { id: 'final_outputs', parentId: 'research_outputs', clockAngle: 300 },
        // Midpoint angles between green parents → clean dodecagonal interleave
        { id: 'remote_vm', parentId: 'fed_infra', clockAngle: 70 },
        { id: 'phy_access', parentId: 'fed_infra', clockAngle: 90 },
        { id: 'decentralised_storage', parentId: 'fed_storage', clockAngle: 150 }, // midpoint 120°–180°
        { id: 'central_storage', parentId: 'fed_storage', clockAngle: 200 },    // sector 180°–240°
        { id: 'ds_simul', parentId: 'fed_analytics', clockAngle: 220 },         // sector 180°–240°
        { id: 'sep_analysis', parentId: 'fed_analytics', clockAngle: 270 },     // midpoint 240°–300°
        { id: 'sdc_output', parentId: 'fed_outputs', clockAngle: 330 },         // midpoint 300°–360°
        // SDC sub-children on intermediate ring
        { id: 'auto_sdc', parentId: 'sdc_output', clockAngle: 310, radius: LAYER3B_RADIUS, nodeSize: HOW_SUB_SIZE },
        { id: 'semi_auto_sdc', parentId: 'sdc_output', clockAngle: 350, radius: LAYER3B_RADIUS, nodeSize: HOW_SUB_SIZE },
    ];

    const layer3Nodes: Node[] = layer3Items.map(({ id, clockAngle, nodeSize, radius }) => {
        const nodeData = ontologyData[id];
        const size = nodeSize ?? HOW_NODE_SIZE;
        const rad = radius ?? LAYER3_RADIUS;
        const pos = clockPosition(clockAngle, rad, size);

        return {
            id,
            type: 'custom',
            position: pos,
            zIndex: 2, // Behind center (10) and What layer (5)
            data: {
                ...nodeData,
                activeFilter: null,
                dimmed: false,
                layer: 2,
                nodeSize: size,
                showTags: true,
            },
        };
    });

    // Layer 3 — Who (providers, fanned out at 30 degree gaps)
    const layer4Items = [
        { id: 'smpc', clockAngle: 180 },
        { id: 'datashield', clockAngle: 210 },
        { id: 'trevolution', clockAngle: 240 },
        { id: 'tes', clockAngle: 270 },
        { id: 'ohdsi', clockAngle: 300 },
        { id: 'opensafely', clockAngle: 330 },
    ];

    const layer4Nodes: Node[] = layer4Items.map(({ id, clockAngle }) => {
        const nodeData = ontologyData[id];
        const pos = clockPosition(clockAngle, LAYER4_RADIUS, WHO_NODE_SIZE);

        return {
            id,
            type: 'custom',
            position: pos,
            zIndex: 1,
            data: {
                ...nodeData,
                activeFilter: null,
                dimmed: false,
                layer: 3, // Layer 4 (index 3)
                nodeSize: WHO_NODE_SIZE,
                showTags: true,
            },
        };
    });

    // Render order: pie (bg) → safes ring → Who (back) → How (behind) → What (middle) → Why (front)
    return [pieNode, safesRingNode, ...layer4Nodes, ...layer3Nodes, ...layer2bNodes, ...layer2Nodes, centerNode];
}

function buildEdges(nodes: Node[]): Edge[] {
    const commonEdgeStyle = { stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '6,4' };
    const solidGreenStyle = { stroke: '#10b981', strokeWidth: 2 };
    const dottedGreenStyle = { stroke: '#10b981', strokeWidth: 2, strokeDasharray: '6,4' };
    const blueDottedStyle = { stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '6,4' }; // blue-500

    const getRadius = (id: string) => {
        const node = nodes.find(n => n.id === id);
        return node?.data?.nodeSize ? (node.data.nodeSize as number) / 2 : 0;
    };

    const edge = (id: string, source: string, target: string, style: React.CSSProperties, isAnimated: boolean) => ({
        id,
        source,
        target,
        sourceHandle: 'center-source',
        targetHandle: 'center-target',
        type: 'perimeter',
        animated: isAnimated,
        style,
        data: {
            sourceRadius: getRadius(source),
            targetRadius: getRadius(target)
        }
    });

    // Edges are DERIVED from the `children` relationships in the ontology data
    // rather than hand-maintained here. Previously this list was written by hand
    // and silently drifted from the data: nodes added to the ontology (the whole
    // data-protection branch, for example) never appeared in the graph because
    // nobody remembered to add a matching line below.
    //
    // Styling is chosen from the layer of the two endpoints, preserving the
    // original visual language:
    //   Why → What            solid green
    //   within What           dotted green
    //   What → How            dashed purple, animated
    //   How → Who             dashed blue, animated
    const rendered = new Set(nodes.map(n => n.id));
    const layerOf = (id: string) => {
        const node = nodes.find(n => n.id === id);
        return (node?.data as Partial<GraphNodeData> | undefined)?.layer;
    };

    const styleFor = (source: string, target: string) => {
        const s = layerOf(source);
        const t = layerOf(target);
        if (t === 3 || s === 3) return { style: blueDottedStyle, animated: true };
        if (t === 2 || s === 2) return { style: commonEdgeStyle, animated: true };
        if (s === 0) return { style: solidGreenStyle, animated: false };
        return { style: dottedGreenStyle, animated: false };
    };

    const edges: Edge[] = [];
    const seen = new Set<string>();

    for (const [parentId, node] of Object.entries(ontologyData)) {
        // Skip relationships whose endpoints are not drawn on the canvas.
        if (!rendered.has(parentId)) continue;

        for (const childId of node.children ?? []) {
            if (!rendered.has(childId)) continue;

            // `children` is an untyped catch-all, so the same pair can be
            // reachable by more than one route. Keep the first.
            const key = `${parentId}->${childId}`;
            if (seen.has(key)) continue;
            seen.add(key);

            const { style, animated } = styleFor(parentId, childId);
            edges.push(edge(key, parentId, childId, style, animated));
        }
    }

    return edges;
}

const initialNodes = buildNodes();
const initialEdges = buildEdges(initialNodes);

export default function GraphViewer({ activeFilter, onNodeSelect, searchQuery, onFilterChange, selectedNode }: GraphViewerProps) {
    const [isDraggable, setIsDraggable] = useState(false);
    const [activeLayer, setActiveLayer] = useState<number | null>(null);
    const [revealedLayer, setRevealedLayer] = useState(0);
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

    // Inject onSegmentClick into the safes-ring node data
    useEffect(() => {
        setNodes(nds => nds.map(n => {
            if (n.id === 'safes-ring') {
                return {
                    ...n, data: {
                        ...n.data, onSegmentClick: (tag: string) => {
                            onFilterChange(activeFilter === tag ? null : tag as FrameworkTag);
                        }
                    }
                };
            }
            return n;
        }));
    }, [activeFilter, onFilterChange, setNodes]);

    // Sync dimming with activeFilter, activeLayer, searchQuery, and selectedNode
    useEffect(() => {
        const query = searchQuery.toLowerCase().trim();

        // Compute connected nodes if a node is selected
        const connectedNodes = new Set<string>();
        if (selectedNode) {
            connectedNodes.add(selectedNode.id);
            initialEdges.forEach(e => {
                if (e.source === selectedNode.id) connectedNodes.add(e.target);
                if (e.target === selectedNode.id) connectedNodes.add(e.source);
            });
        }

        // Build a layer lookup for edge visibility
        const nodeLayerMap = new Map<string, number>();
        initialNodes.forEach(n => {
            const nd = n.data as Partial<GraphNodeData>;
            if (nd.layer !== undefined) {
                nodeLayerMap.set(n.id, nd.layer);
            }
        });

        setNodes(nds =>
            nds.map(n => {
                // Progressive reveal for background elements
                if (n.id === 'pie-background') {
                    return { ...n, style: { ...(n.style as React.CSSProperties), opacity: revealedLayer >= 1 ? 1 : 0, transition: 'opacity 0.8s ease' } };
                }
                if (n.id === 'safes-ring') {
                    return { ...n, style: { ...(n.style as React.CSSProperties), opacity: revealedLayer >= 2 ? 1 : 0, transition: 'opacity 0.8s ease' } };
                }

                const nd = n.data as Partial<GraphNodeData>;
                const hasTag = activeFilter ? nd.tags?.includes(activeFilter) : true;
                const layerMatch = activeLayer !== null ? nd.layer === activeLayer : true;
                const isCenterReveal = nd.layer === 0 && activeLayer !== null && activeLayer >= 2;

                // Progressive reveal: hide nodes beyond the current revealed layer
                const isHiddenByReveal = nd.layer !== undefined && nd.layer > revealedLayer;

                // Search match: check label, definitions, and tags
                let searchMatch = true;
                if (query) {
                    const label = (nd.label || '').toLowerCase();
                    // NOTE: previously read `nd.def_lay` / `nd.def_tech`, which do not
                    // exist on OntologyNode - so definition text was never actually
                    // searched. The real fields live under `definitions`.
                    const defPublic = (nd.definitions?.public || '').toLowerCase();
                    const defTech = (nd.definitions?.tech || '').toLowerCase();
                    const tags = (nd.tags || []).join(' ').toLowerCase();
                    searchMatch = label.includes(query) || defPublic.includes(query) || defTech.includes(query) || tags.includes(query);
                }

                const isConnected = selectedNode ? connectedNodes.has(n.id) : true;
                const isDimmed = !searchMatch || (activeFilter ? !hasTag : false) || (activeLayer !== null ? !layerMatch : false) || !isConnected;

                return {
                    ...n,
                    data: {
                        ...nd,
                        activeFilter,
                        dimmed: isCenterReveal ? false : isDimmed,
                        semiTransparent: isCenterReveal || (selectedNode && !isConnected),
                        isSelected: selectedNode ? n.id === selectedNode.id : false,
                        hidden: isHiddenByReveal,
                        showClickMe: n.id === 'fed_ecosystem' && revealedLayer === 0,
                    },
                };
            })
        );

        setEdges(eds => eds.map(e => {
            const sourceLayer = nodeLayerMap.get(e.source);
            const targetLayer = nodeLayerMap.get(e.target);
            const edgeRevealed = (sourceLayer === undefined || sourceLayer <= revealedLayer) &&
                                 (targetLayer === undefined || targetLayer <= revealedLayer);

            const isConnected = selectedNode
                ? e.source === selectedNode.id || e.target === selectedNode.id
                : true;

            return {
                ...e,
                style: {
                    ...(e.style as React.CSSProperties) || {},
                    opacity: !edgeRevealed ? 0 : (selectedNode && !isConnected ? 0.1 : 1),
                    transition: 'opacity 0.8s ease',
                }
            };
        }));

    }, [activeFilter, activeLayer, searchQuery, selectedNode, revealedLayer, setNodes, setEdges]);

    const onNodeClick = useCallback(
        (_: React.MouseEvent, node: Node) => {
            if (node.id === 'pie-background' || node.id === 'safes-ring') return;
            const data = node.data as unknown as GraphNodeData;

            // Progressive reveal: clicking a node on the current frontier layer reveals the next
            if (data.layer !== undefined && data.layer === revealedLayer && revealedLayer < 3) {
                setRevealedLayer(prev => prev + 1);
            }

            onNodeSelect(data as OntologyNode);
        },
        [onNodeSelect, revealedLayer]
    );

    const onPaneClick = useCallback(() => {
        setActiveLayer(null);
        onNodeSelect(null); // Clear selected node on pane click
    }, [onNodeSelect]);

    return (
        <div className="flex-1 w-full h-full relative" style={{ backgroundColor: '#ffffff' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodesDraggable={isDraggable}
                fitView
                fitViewOptions={{ padding: 0.3 }}
                minZoom={0.2}
            >
                <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#e2e8f0" />
                <Controls className="bg-white border-slate-200 fill-slate-500 shadow-md" />

                {/* Layer filter buttons */}
                <Panel position="top-center">
                    <div className="layer-buttons">
                        {LAYER_META.map(({ label, layer, color }) => (
                            <button
                                key={layer}
                                onClick={() => setActiveLayer(prev => prev === layer ? null : layer)}
                                className={`layer-btn ${activeLayer === layer ? 'layer-btn-active' : ''}`}
                                style={{
                                    '--btn-color': color,
                                    borderColor: activeLayer === layer ? color : undefined,
                                    backgroundColor: activeLayer === layer ? `${color}15` : undefined,
                                    color: activeLayer === layer ? color : undefined,
                                } as React.CSSProperties}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </Panel>

                {/* Lock toggle */}
                <Panel position="top-right">
                    <button
                        onClick={() => setIsDraggable(d => !d)}
                        className="lock-toggle-btn"
                    >
                        {isDraggable
                            ? <><Unlock className="w-4 h-4" /> Unlock Nodes</>
                            : <><Lock className="w-4 h-4" /> Lock Nodes</>
                        }
                    </button>
                </Panel>
            </ReactFlow>
        </div>
    );
}
