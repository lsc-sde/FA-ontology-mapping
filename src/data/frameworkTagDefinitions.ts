import { FrameworkTag } from './ontology';

// Plain-English definitions of each framework tag.
// Canonical source: data/framework-tag-definitions.json (CC BY 4.0).
import raw from '../../data/framework-tag-definitions.json';

export const frameworkTagDefinitions: Record<FrameworkTag, string> =
    raw as Record<FrameworkTag, string>;
