export type EntityType = 'definition' | 'solution' | 'provider' | 'framework';

export type FrameworkTag =
    // Five Safes
    | 'Safe People'
    | 'Safe Projects'
    | 'Safe Settings'
    | 'Safe Data'
    | 'Safe Outputs'
    // FAIR
    | 'Findable'
    | 'Accessible'
    | 'Interoperable'
    | 'Reusable'
    // PEDRI
    | 'PEDRI: Equity/Diversity'
    | 'PEDRI: Data Literacy'
    | 'PEDRI: Two-way Comm'
    | 'PEDRI: Transparency'
    | 'PEDRI: Mutual Benefit'
    | 'PEDRI: Effective Involvement'
    | 'PEDRI: Culture of Engagement'
    // SATRE
    | 'SATRE: Info Governance'
    | 'SATRE: Tech/Security'
    | 'SATRE: Data Management'
    | 'SATRE: Supporting Capabilities';

export const frameworkCategories = {
    'Five Safes': ['Safe Projects', 'Safe People', 'Safe Data', 'Safe Settings', 'Safe Outputs'],
    'FAIR': ['Findable', 'Accessible', 'Interoperable', 'Reusable'],
    'PEDRI': [
        'PEDRI: Equity/Diversity',
        'PEDRI: Data Literacy',
        'PEDRI: Two-way Comm',
        'PEDRI: Transparency',
        'PEDRI: Mutual Benefit',
        'PEDRI: Effective Involvement',
        'PEDRI: Culture of Engagement'
    ],
    'SATRE': [
        'SATRE: Info Governance',
        'SATRE: Tech/Security',
        'SATRE: Data Management',
        'SATRE: Supporting Capabilities'
    ]
};

export interface OntologyNode {
    id: string;
    label: string;
    subtitle?: string;
    purpose?: string;
    type: EntityType;
    definitions: {
        public: string;
        tech: string;
        researcher: string;
        gov: string;
    };
    examples: {
        public: string;
        tech: string;
        researcher: string;
        gov: string;
        sde?: string; // Tabular view: SDE specific example
        dare?: string; // Tabular view: DARE UK specific example
    };
    essential_characteristics?: {
        description: string;
        tags: FrameworkTag[];
    }[];
    tags?: FrameworkTag[];
    related_terms?: {
        term: string;
        definition: string;
    }[];
    // Further reading. Somewhere to put source material and adjacent work that
    // does not itself warrant a node in the ontology.
    more_information?: {
        label: string;
        url: string;
        doi?: string;
        note?: string;
    }[];
    children?: string[];
}

// ---------------------------------------------------------------------------
// Ontology content
//
// The content below is loaded from the machine-readable JSON in /data, which is
// the canonical, citable source of the ontology and is licensed under
// CC BY 4.0 (see data/LICENSE-DATA.txt). The application code in src/ is
// licensed under Apache-2.0.
//
// To change a definition, edit the JSON in /data and run `npm run validate:data`.
// ---------------------------------------------------------------------------
import ontologyRaw from '../../data/ontology.json';
import initialVisibleNodesRaw from '../../data/initial-visible-nodes.json';

// JSON imports widen string literals to `string`, so we re-assert the schema
// that `OntologyNode` and `FrameworkTag` define.
export const ontologyData: Record<string, OntologyNode> =
    ontologyRaw as unknown as Record<string, OntologyNode>;

// Initial nodes that are visible when the app loads
export const initialVisibleNodes: string[] = initialVisibleNodesRaw as string[];
