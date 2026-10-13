import { Handle, Position } from '@xyflow/react';
import { OntologyNode, FrameworkTag, frameworkCategories } from '../data/ontology';
import { tagReasons } from '../data/tagReasons';
import clsx from 'clsx';

// The render-time fields GraphViewer attaches to each ontology node. Declared
// here (rather than cast at each use site) so both components share one source
// of truth for the shape of `node.data`.
export type GraphNodeData = OntologyNode & {
    activeFilter: FrameworkTag | null;
    dimmed: boolean;
    layer?: number;
    nodeSize?: number;
    showTags?: boolean;
    semiTransparent?: boolean;
    isSelected?: boolean;
    hidden?: boolean;
    showClickMe?: boolean;
};

interface CustomNodeProps {
    data: GraphNodeData;
}

const frameworkColors: Record<string, { bg: string; border: string; text: string }> = {
    'Five Safes': { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-800' },
    'FAIR': { bg: 'bg-sky-100', border: 'border-sky-400', text: 'text-sky-800' },
    'PEDRI': { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-800' },
    'SATRE': { bg: 'bg-violet-100', border: 'border-violet-400', text: 'text-violet-800' },
};

function shortLabel(tag: FrameworkTag): string {
    if (tag.startsWith('SATRE: ')) return tag.replace('SATRE: ', '');
    if (tag.startsWith('PEDRI: ')) return tag.replace('PEDRI: ', '');
    return tag;
}

export default function CustomNode({ data }: CustomNodeProps) {
    const isDefinition = data.type === 'definition';
    const isSolution = data.type === 'solution';
    const isProvider = data.type === 'provider';
    const isDimmed = data.dimmed;
    const isSemiTransparent = data.semiTransparent;
    const isSelected = data.isSelected;
    const isHidden = data.hidden;
    const showClickMe = data.showClickMe;
    const size = data.nodeSize || 220;
    const showTags = data.showTags !== false;
    const isCenterNode = data.layer === 0;

    const tagsByFramework: Record<string, FrameworkTag[]> = {};
    if (showTags && data.tags) {
        for (const [framework, frameworkTags] of Object.entries(frameworkCategories)) {
            const matching = data.tags.filter(t => (frameworkTags as string[]).includes(t)) as FrameworkTag[];
            if (matching.length > 0) {
                tagsByFramework[framework] = matching;
            }
        }
    }

    const frameworkOrder = ['Five Safes', 'PEDRI', 'FAIR', 'SATRE'];

    return (
        <div
            className={clsx(
                'custom-node-circle',
                isHidden ? 'node-hidden' :
                    isDimmed ? 'opacity-30 scale-95 grayscale' :
                        isSemiTransparent ? 'opacity-25' :
                            'opacity-100 scale-100',
                isCenterNode ? 'node-center' :
                    isDefinition ? 'node-definition' :
                        isSolution ? 'node-solution' :
                            isProvider ? 'node-provider' :
                                'node-default',
                isSelected && 'node-selected',
                showClickMe && 'node-has-prompt'
            )}
            style={{ width: size, height: size }}
            title={data.related_terms ? data.related_terms.map(rt => `${rt.term} = ${rt.definition}`).join('\n') : undefined}
        >
            {/* "Click me" prompt above the center node on landing */}
            {showClickMe && (
                <div className="click-me-prompt">
                    <span>Click me</span>
                    <svg className="click-me-arrow" width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 2V16M8 16L2 10M8 16L14 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            )}

            {/* Invisible central handles for all-direction edge connections */}
            <Handle type="target" position={Position.Top} id="center-target" className="!opacity-0 !w-1 !h-1" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            <Handle type="source" position={Position.Bottom} id="center-source" className="!opacity-0 !w-1 !h-1" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            <Handle type="target" position={Position.Left} id="left" className="!opacity-0 !w-1 !h-1" />
            <Handle type="source" position={Position.Left} id="src-left" className="!opacity-0 !w-1 !h-1" />
            <Handle type="target" position={Position.Right} id="right" className="!opacity-0 !w-1 !h-1" />
            <Handle type="source" position={Position.Right} id="src-right" className="!opacity-0 !w-1 !h-1" />

            <strong
                className="node-title"
                style={{ fontSize: isCenterNode ? '14px' : size <= 140 ? '9px' : size <= 160 ? '10px' : '11px' }}
            >
                {data.label}
            </strong>

            {showTags && Object.keys(tagsByFramework).length > 0 && (
                <div className="node-tags-container">
                    {frameworkOrder.map(framework => {
                        const tags = tagsByFramework[framework];
                        if (!tags || tags.length === 0) return null;
                        const colors = frameworkColors[framework];
                        return (
                            <div key={framework} className="node-tag-row">
                                {tags.map(tag => {
                                    const nodeReasons = tagReasons[data.id] || {};
                                    const reason = nodeReasons[tag as keyof typeof nodeReasons];
                                    return (
                                        <span
                                            key={tag}
                                            className={clsx('node-tag cursor-help', colors.bg, colors.border, colors.text)}
                                            title={reason || tag}
                                        >
                                            {shortLabel(tag)}
                                        </span>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Arrow pointing to sidebar when selected */}
            {isSelected && (
                <div className="selected-arrow">
                    <svg width="32" height="18" viewBox="0 0 32 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 9H4M4 9L11 2M4 9L11 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="selected-arrow-label">View details</span>
                </div>
            )}
        </div>
    );
}
