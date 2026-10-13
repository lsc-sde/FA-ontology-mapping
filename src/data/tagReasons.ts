import { FrameworkTag } from './ontology';

// Why each framework tag applies to each node - shown when tags are clicked.
// Canonical source: data/tag-reasons.json (CC BY 4.0).
import raw from '../../data/tag-reasons.json';

export const tagReasons: Record<string, Partial<Record<FrameworkTag, string>>> =
    raw as Record<string, Partial<Record<FrameworkTag, string>>>;
