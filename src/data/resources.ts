// Project-level further reading, shown in the sidebar's "Find out more" panel.
// Canonical source: data/resources.json (CC BY 4.0).
//
// Listing is not an endorsement, and linked works may use terms differently
// to this ontology. Reading that belongs to a single concept lives on that
// node's `additional_resources` field instead.
import raw from '../../data/resources.json';

export interface Resource {
    id: string;
    label: string;
    url: string;
    doi?: string;
    publisher?: string;
    note?: string;
}

export const resources: Resource[] = raw as Resource[];
