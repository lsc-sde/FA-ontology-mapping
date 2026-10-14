import { useState } from 'react';
import { OntologyNode, FrameworkTag, frameworkCategories } from '../data/ontology';
import { tagReasons } from '../data/tagReasons';
import { frameworkTagDefinitions } from '../data/frameworkTagDefinitions';
import { SlidersHorizontal, Settings, BookOpen, Fingerprint, ChevronDown, ChevronRight, Search, X } from 'lucide-react';

interface SidebarProps {
    perspective: 'public' | 'tech' | 'researcher' | 'gov';
    setPerspective: (m: 'public' | 'tech' | 'researcher' | 'gov') => void;
    activeFilter: FrameworkTag | null;
    setActiveFilter: (f: FrameworkTag | null) => void;
    selectedNode: OntologyNode | null;
    setSelectedNode: (n: OntologyNode | null) => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    currentView: 'graph' | 'table';
    setCurrentView: (v: 'graph' | 'table') => void;
}

const frameworkColors: Record<string, { bg: string; border: string; text: string }> = {
    'Six Safes': { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-800' },
    'FAIR': { bg: 'bg-sky-100', border: 'border-sky-400', text: 'text-sky-800' },
    'PEDRI': { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-800' },
    'SATRE': { bg: 'bg-violet-100', border: 'border-violet-400', text: 'text-violet-800' },
};

function getFrameworkForTag(tag: FrameworkTag): string | null {
    for (const [framework, tags] of Object.entries(frameworkCategories)) {
        if ((tags as string[]).includes(tag)) return framework;
    }
    return null;
}

export default function Sidebar({ perspective, setPerspective, activeFilter, setActiveFilter, selectedNode, setSelectedNode, searchQuery, setSearchQuery, currentView, setCurrentView }: SidebarProps) {
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    const [expandedTag, setExpandedTag] = useState<string | null>(null);

    const toggleCategory = (category: string) => {
        setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const reasons = selectedNode ? tagReasons[selectedNode.id] || {} : {};

    return (
        <div className="w-[480px] h-full bg-slate-50 border-r border-slate-200 flex flex-col shadow-lg z-10 p-6 overflow-y-auto">

            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
                        <Fingerprint className="w-8 h-8 text-blue-600" />
                        Language Road Map
                    </h1>
                    <p className="text-sm text-slate-500">Federated Data &amp; Framework Analysis</p>
                </div>
                <button
                    onClick={() => {
                        setActiveFilter(null);
                        setSearchQuery('');
                        setSelectedNode(null);
                    }}
                    className="px-4 py-1.5 text-sm font-medium rounded-lg border bg-white border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800 shadow-sm transition-all"
                >
                    Reset
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search nodes, tags, definitions..."
                        className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all placeholder:text-slate-400"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* View Toggle */}
            <div className="mb-6 p-1 bg-slate-100 rounded-lg flex relative">
                <div
                    className={`absolute inset-y-1 w-[calc(50%-4px)] bg-white border border-slate-200 shadow-sm rounded-md transition-all duration-300 pointer-events-none ${currentView === 'table' ? 'left-[calc(50%+2px)]' : 'left-1'}`}
                />
                <button
                    onClick={() => setCurrentView('graph')}
                    className={`flex-1 py-1.5 text-sm font-medium z-10 transition-colors ${currentView === 'graph' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Graph View
                </button>
                <button
                    onClick={() => setCurrentView('table')}
                    className={`flex-1 py-1.5 text-sm font-medium z-10 transition-colors ${currentView === 'table' ? 'text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    Tabular View
                </button>
            </div>

            {/* Definition Perspective */}
            <div className="mb-8 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-semibold flex items-center gap-2 text-slate-700 mb-4">
                    <SlidersHorizontal className="w-5 h-5" />
                    Definition Perspective
                </h3>
                <div className="flex bg-slate-100 rounded-lg p-1 relative">
                    <div
                        className={`absolute inset-y-1 w-[calc(25%-2px)] bg-blue-100 border border-blue-300 shadow-sm rounded-md transition-all duration-300 pointer-events-none ${perspective === 'public' ? 'left-1' :
                            perspective === 'tech' ? 'left-[calc(25%+1px)]' :
                                perspective === 'researcher' ? 'left-[calc(50%+1px)]' : 'left-[calc(75%+1px)]'
                            }`}
                    />
                    <button
                        onClick={() => setPerspective('public')}
                        className={`flex-1 py-2 px-1 z-10 transition-colors ${perspective === 'public' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <span className="block text-sm font-medium">Public</span>
                        <span className="block text-[10px] leading-tight opacity-70">Why it matters</span>
                    </button>
                    <button
                        onClick={() => setPerspective('tech')}
                        className={`flex-1 py-2 px-1 z-10 transition-colors ${perspective === 'tech' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <span className="block text-sm font-medium">Technical</span>
                        <span className="block text-[10px] leading-tight opacity-70">How it works</span>
                    </button>
                    <button
                        onClick={() => setPerspective('researcher')}
                        className={`flex-1 py-2 px-1 z-10 transition-colors ${perspective === 'researcher' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <span className="block text-sm font-medium">Researcher</span>
                        <span className="block text-[10px] leading-tight opacity-70">What I can do</span>
                    </button>
                    <button
                        onClick={() => setPerspective('gov')}
                        className={`flex-1 py-2 px-1 z-10 transition-colors ${perspective === 'gov' ? 'text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <span className="block text-sm font-medium">Governance</span>
                        <span className="block text-[10px] leading-tight opacity-70">Who&apos;s accountable</span>
                    </button>
                </div>
            </div>

            {/* Framework Filters */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold flex items-center gap-2 text-slate-700">
                        <Settings className="w-5 h-5" />
                        Framework Filters
                    </h3>
                    <button
                        onClick={() => setActiveFilter(null)}
                        className={`px-3 py-1 text-xs rounded-full border transition-all ${activeFilter === null
                            ? 'bg-blue-50 border-blue-400 text-blue-600 shadow-sm'
                            : 'bg-transparent border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-600'
                            }`}
                    >
                        Clear Filter
                    </button>
                </div>
                <div className="flex flex-col gap-2">
                    {Object.entries(frameworkCategories).map(([categoryName, tags]) => (
                        <div key={categoryName} className="border border-slate-200 rounded-lg shadow-sm">
                            <button
                                onClick={() => toggleCategory(categoryName)}
                                className={`w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm ${openCategories[categoryName] ? 'rounded-t-lg' : 'rounded-lg'}`}
                            >
                                {categoryName}
                                {openCategories[categoryName] ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                            </button>
                            {openCategories[categoryName] && (
                                <div className="p-3 bg-slate-50 flex flex-wrap gap-2 border-t border-slate-200 rounded-b-lg">
                                    {tags.map((tag) => (
                                        <div key={tag} className="relative group">
                                            <button
                                                onClick={() => setActiveFilter(tag as FrameworkTag)}
                                                className={`w-full px-3 py-1.5 text-sm rounded-full border transition-all ${activeFilter === tag
                                                    ? 'bg-blue-50 border-blue-400 text-blue-700 shadow-sm'
                                                    : 'bg-white border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700'
                                                    }`}
                                            >
                                                {tag.replace(/^(PEDRI:\s|SATRE:\s)/, '')}
                                            </button>

                                            {/* Tooltip */}
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+6px)] w-56 p-2.5 bg-slate-800 text-slate-100 text-xs font-medium rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none text-center leading-relaxed">
                                                {frameworkTagDefinitions[tag as FrameworkTag]}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-800"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Details Panel */}
            <div className="flex-1 border-t border-slate-200 pt-6 pb-4">
                <h3 className="text-base font-semibold flex items-center gap-2 text-slate-700 mb-6">
                    <BookOpen className="w-5 h-5" />
                    Details Panel
                </h3>
                {selectedNode ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`w-3 h-3 rounded-full shadow-sm ${selectedNode.type === 'definition' ? 'bg-emerald-500' : selectedNode.type === 'provider' ? 'bg-orange-500' : 'bg-purple-500'}`} />
                                <h4 className="text-xl font-bold text-slate-800">{selectedNode.label}</h4>
                            </div>
                            <p className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-4">
                                {selectedNode.type}
                            </p>
                            {selectedNode.purpose && (
                                <div className="mb-4 bg-emerald-50/50 p-4 rounded-xl border-l-4 border-l-emerald-500 border-y border-r border-slate-200 shadow-sm">
                                    <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Purpose</h5>
                                    <p className="text-sm font-medium text-slate-700">{selectedNode.purpose}</p>
                                </div>
                            )}

                            <div className="bg-white p-5 rounded-xl border border-slate-200 leading-relaxed text-base text-slate-700 shadow-sm">
                                {selectedNode.definitions[perspective] || <span className="text-slate-400 italic">No definition available for this perspective.</span>}
                                {selectedNode.related_terms && selectedNode.related_terms.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <h5 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Related Terms</h5>
                                        <ul className="space-y-2">
                                            {selectedNode.related_terms.map(rt => (
                                                <li key={rt.term} className="text-sm">
                                                    <span className="font-semibold text-slate-700">{rt.term}</span> = <span className="text-slate-600">{rt.definition}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {selectedNode.examples[perspective] && (
                            <div className="mt-2">
                                <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Example</h5>
                                <div className="bg-blue-50/50 p-5 rounded-xl border-l-4 border-l-blue-500 border-y border-r border-slate-200 leading-relaxed text-base text-slate-600 italic shadow-sm">
                                    "{selectedNode.examples[perspective]}"
                                </div>
                            </div>
                        )}

                        {/* Essential Characteristics */}
                        {selectedNode.essential_characteristics && selectedNode.essential_characteristics.length > 0 && (
                            <div className="mt-2 text-sm">
                                <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Essential Characteristics</h5>
                                <div className="bg-emerald-50/50 p-4 rounded-xl border-l-4 border-l-emerald-500 border-y border-r border-slate-200 leading-relaxed text-slate-700 shadow-sm">
                                    <p className="text-xs text-slate-500 mb-3 italic">
                                        Note: These should broadly align to framework developments such as SATRE 2.0 and represent that which is measurable or observable to determine if a criteria is met or not met.
                                    </p>
                                    <ul className="list-disc list-outside ml-4 space-y-3">
                                        {selectedNode.essential_characteristics.map((char, i) => {
                                            const match = char.description.match(/^([^:;]+[:;])(.*)$/);
                                            return (
                                                <li key={i}>
                                                    <span className="block mb-1">
                                                        {match ? (
                                                            <>
                                                                <span className="font-bold">{match[1]}</span>
                                                                {match[2]}
                                                            </>
                                                        ) : (
                                                            char.description
                                                        )}
                                                    </span>
                                                    {char.tags && char.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {char.tags.map(t => {
                                                                const framework = getFrameworkForTag(t);
                                                                const colors = framework ? frameworkColors[framework] : null;
                                                                return (
                                                                    <span key={t} className={`px-1.5 py-0.5 text-[10px] rounded border ${colors ? `${colors.bg} ${colors.border} ${colors.text}` : 'bg-slate-100 text-slate-600 border-slate-300'}`}>
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
                            </div>
                        )}

                        {/* Clickable Framework Tags */}
                        {selectedNode.tags && selectedNode.tags.length > 0 && (
                            <div className="mt-2">
                                <h5 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Framework Tags</h5>
                                <div className="flex flex-col gap-2">
                                    {selectedNode.tags.map(tag => {
                                        const framework = getFrameworkForTag(tag);
                                        const colors = framework ? frameworkColors[framework] : null;
                                        const reason = reasons[tag as keyof typeof reasons];
                                        const isExpanded = expandedTag === tag;
                                        return (
                                            <div key={tag}>
                                                <button
                                                    onClick={() => setExpandedTag(isExpanded ? null : tag)}
                                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg border transition-all flex items-center justify-between gap-2 ${colors
                                                        ? `${colors.bg} ${colors.border} ${colors.text} hover:opacity-80`
                                                        : 'bg-slate-100 border-slate-300 text-slate-600'
                                                        } ${isExpanded ? 'ring-2 ring-blue-300' : ''}`}
                                                >
                                                    <span className="font-semibold">{tag}</span>
                                                    {reason && (
                                                        <ChevronDown className={`w-3.5 h-3.5 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                                                    )}
                                                </button>
                                                {isExpanded && reason && (
                                                    <div className="mt-1 ml-2 px-3 py-2 text-sm text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                                                        {reason}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-white">
                        <p className="text-base text-slate-400 italic">Click or hover over a node on the map to view its detailed definition.</p>
                    </div>
                )}
            </div>

            {/* Partner Logos */}
            <div className="logo-bar">
                <img src="/logo-one-lsc.png" alt="One LSC - Data into Impact" />
                <img src="/logo-datashield.png" alt="DataSHIELD - Secure Bioscience Collaboration" />
                <img src="/logo-focus5.png" alt="FOCUS-5" />
                <img src="/logo-dare-uk.png" alt="DARE UK" />
            </div>

        </div>
    );
}
