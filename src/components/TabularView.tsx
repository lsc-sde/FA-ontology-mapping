import { FrameworkTag, ontologyData, frameworkCategories } from '../data/ontology';
import { tagReasons } from '../data/tagReasons';

interface TabularViewProps {
    perspective: 'public' | 'tech' | 'researcher' | 'gov';
    activeFilter: FrameworkTag | null;
    searchQuery: string;
}

// Group nodes by layer corresponding to the Map layout
const LAYERS = [
    { title: 'Why - Federated Research Ecosystem', keys: ['fed_ecosystem'] },
    { title: 'What - Core Principles', keys: ['fed_people', 'fed_data', 'fed_analytics', 'research_outputs', 'fed_storage', 'fed_gov', 'fed_infra', 'fed_access'] },
    { title: 'How - Implementations & Solutions', keys: ['access_process', 'dacs', 'decentralised_storage', 'central_storage', 'sep_analysis', 'ds_simul', 'smpc', 'remote_vm', 'phy_access', 'sdc_output', 'auto_sdc', 'semi_auto_sdc', 'intermediate_outputs', 'final_outputs'] },
    { title: 'Who - Providers & Platforms', keys: ['datashield', 'trevolution', 'tes', 'ohdsi', 'opensafely'] },
];

export default function TabularView({ perspective, activeFilter, searchQuery }: TabularViewProps) {

    const query = searchQuery.toLowerCase().trim();

    // Utility to get framework colors
    const frameworkColors: Record<string, string> = {
        'Five Safes': 'bg-amber-100 text-amber-800 border-amber-400',
        'FAIR': 'bg-sky-100 text-sky-800 border-sky-400',
        'PEDRI': 'bg-rose-100 text-rose-800 border-rose-400',
        'SATRE': 'bg-violet-100 text-violet-800 border-violet-400',
    };

    function getFrameworkForTag(tag: string): string | null {
        for (const [framework, tags] of Object.entries(frameworkCategories)) {
            if ((tags as string[]).includes(tag)) return framework;
        }
        return null;
    }

    const renderTable = (layerTitle: string, keys: string[]) => {

        // Filter nodes
        const nodes = keys.map(k => ontologyData[k]).filter(nd => {
            if (!nd) return false;

            // Check framework filter
            const hasTag = activeFilter ? nd.tags?.includes(activeFilter) : true;
            if (activeFilter && !hasTag) return false;

            // Check search query
            if (query) {
                const label = (nd.label || '').toLowerCase();
                const defsStr = Object.values(nd.definitions || {}).join(' ').toLowerCase();
                const tagsStr = (nd.tags || []).join(' ').toLowerCase();
                if (!label.includes(query) && !defsStr.includes(query) && !tagsStr.includes(query)) {
                    return false;
                }
            }
            return true;
        });

        if (nodes.length === 0) return null;

        return (
            <div key={layerTitle} className="mb-12 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-white tracking-wide">{layerTitle}</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 select-none">
                            <tr>
                                <th className="p-4 border-r border-slate-200 w-48">Item</th>
                                <th className="p-4 border-r border-slate-200 w-64 text-emerald-800 bg-emerald-50/50">Purpose</th>
                                <th className="p-4 border-r border-slate-200 min-w-80">
                                    Definition <span className="text-blue-600 ml-1">({perspective})</span>
                                </th>
                                <th className="p-4 border-r border-slate-200 min-w-72">Essential Characteristics</th>
                                <th className="p-4 border-r border-slate-200 min-w-48">SDE Example</th>
                                <th className="p-4 border-r border-slate-200 min-w-48">DARE UK Example</th>
                                <th className="p-4 border-r border-slate-200 w-40">Five Safes</th>
                                <th className="p-4 border-r border-slate-200 w-40">FAIR</th>
                                <th className="p-4 border-r border-slate-200 w-40">PEDRI</th>
                                <th className="p-4 min-w-56">Relationships</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {nodes.map(node => {
                                // Group tags by framework
                                const fiveSafesTags = node.tags?.filter(t => getFrameworkForTag(t) === 'Five Safes') || [];
                                const fairTags = node.tags?.filter(t => getFrameworkForTag(t) === 'FAIR') || [];
                                const pedriTags = node.tags?.filter(t => getFrameworkForTag(t) === 'PEDRI') || [];

                                const renderTags = (tags: string[], framework: string) => {
                                    if (!tags.length) return <span className="text-slate-300 italic">-</span>;
                                    const colorClass = frameworkColors[framework] || 'bg-slate-100 text-slate-600 border-slate-300';
                                    return (
                                        <div className="flex flex-wrap gap-1.5">
                                            {tags.map(t => (
                                                <span key={t} title={tagReasons[node.id]?.[t as FrameworkTag] || t} className={`px-2 py-1 text-xs rounded-md border cursor-help ${colorClass}`}>
                                                    {t.replace(/^(PEDRI:\s|SATRE:\s)/, '')}
                                                </span>
                                            ))}
                                        </div>
                                    );
                                };

                                return (
                                    <tr key={node.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-4 border-r border-slate-100 align-top">
                                            <div className="font-bold text-blue-900 mb-1 leading-snug">{node.label}</div>
                                            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{node.type}</div>
                                        </td>
                                        <td className="p-4 border-r border-slate-100 align-top text-slate-700 text-xs font-semibold leading-relaxed bg-emerald-50/20 italic">
                                            {node.purpose || <span className="text-slate-300 not-italic">-</span>}
                                        </td>
                                        <td className="p-4 border-r border-slate-100 align-top text-slate-700 leading-relaxed">
                                            {node.definitions[perspective] || <span className="text-slate-400 italic">No definition available for this perspective.</span>}
                                            {node.related_terms && node.related_terms.length > 0 && (
                                                <div className="mt-4 pt-3 border-t border-slate-200">
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Related Terms</div>
                                                    <ul className="space-y-1">
                                                        {node.related_terms.map(rt => (
                                                            <li key={rt.term} className="text-xs">
                                                                <span className="font-bold text-slate-800">{rt.term}</span> = <span className="text-slate-600">{rt.definition}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 border-r border-slate-100 align-top text-slate-700 text-xs">
                                            {node.essential_characteristics && node.essential_characteristics.length > 0 ? (
                                                <div className="max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                                    <ul className="list-disc list-outside ml-3 space-y-2">
                                                        {node.essential_characteristics.map((c, i) => {
                                                            const match = c.description.match(/^([^:;]+[:;])(.*)$/);
                                                            return (
                                                                <li key={i}>
                                                                    <span className="block mb-0.5 text-slate-800">
                                                                        {match ? (
                                                                            <>
                                                                                <span className="font-bold">{match[1]}</span>
                                                                                {match[2]}
                                                                            </>
                                                                        ) : (
                                                                            c.description
                                                                        )}
                                                                    </span>
                                                                    {c.tags && c.tags.length > 0 && (
                                                                        <div className="flex flex-wrap gap-1 mt-0.5">
                                                                            {c.tags.map(t => {
                                                                                const framework = getFrameworkForTag(t);
                                                                                const colors = framework ? frameworkColors[framework] : 'bg-slate-100 text-slate-600 border-slate-300';
                                                                                return (
                                                                                    <span key={t} className={`px-1 py-[1px] text-[9px] rounded-md border ${colors} shadow-sm`}>
                                                                                        {t.replace(/^(PEDRI:\s|SATRE:\s)/, '')}
                                                                                    </span>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <span className="text-slate-300 italic">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 border-r border-slate-100 align-top text-slate-600 italic text-xs">
                                            {node.examples?.sde || <span className="text-slate-300 not-italic">N/A</span>}
                                        </td>
                                        <td className="p-4 border-r border-slate-100 align-top text-slate-600 italic text-xs">
                                            {node.examples?.dare || <span className="text-slate-300 not-italic">N/A</span>}
                                        </td>
                                        <td className="p-4 border-r border-slate-100 align-top">
                                            {renderTags(fiveSafesTags, 'Five Safes')}
                                        </td>
                                        <td className="p-4 border-r border-slate-100 align-top">
                                            {renderTags(fairTags, 'FAIR')}
                                        </td>
                                        <td className="p-4 border-r border-slate-100 align-top">
                                            {renderTags(pedriTags, 'PEDRI')}
                                        </td>
                                        <td className="p-4 align-top">
                                            {node.children && node.children.length > 0 ? (
                                                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                                                    {node.children.map(childId => (
                                                        <li key={childId} className="group-hover:text-blue-700 transition-colors">
                                                            {ontologyData[childId]?.label || childId}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <span className="text-slate-300 italic">-</span>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full w-full bg-slate-100 overflow-y-auto p-12">
            <div className="max-w-[1600px] mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-extrabold text-slate-800 mb-2">Glossary of Terms</h1>
                    <p className="text-slate-500 mb-4">A structured breakdown of the federated data ecosystem.</p>
                    
                    <div className="bg-emerald-50/50 p-4 rounded-xl border-l-4 border-l-emerald-500 border-y border-r border-slate-200 shadow-sm max-w-4xl">
                        <p className="text-sm text-slate-600 italic">
                            <strong className="font-semibold text-emerald-800">Note on Essential Characteristics:</strong> These characteristics should broadly align to framework developments such as SATRE 2.0 and represent that which is measurable or observable to determine if a criteria is met or not met.
                        </p>
                    </div>
                </div>
                {LAYERS.map(layer => renderTable(layer.title, layer.keys))}

                {LAYERS.every(layer => {
                    const nodes = layer.keys.map(k => ontologyData[k]);
                    return nodes.every(nd => {
                        const hasTag = activeFilter ? nd.tags?.includes(activeFilter) : true;
                        if (activeFilter && !hasTag) return true;
                        if (query) {
                            const label = (nd.label || '').toLowerCase();
                            const tagsStr = (nd.tags || []).join(' ').toLowerCase();
                            if (!label.includes(query) && !tagsStr.includes(query)) return true;
                        }
                        return false; // found a match
                    });
                }) && (
                        <div className="text-center py-20 px-6 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-600 mb-2">No matching items found</h3>
                            <p className="text-slate-400">Try adjusting your search query or clearing the framework filters.</p>
                        </div>
                    )}
            </div>
        </div>
    );
}
