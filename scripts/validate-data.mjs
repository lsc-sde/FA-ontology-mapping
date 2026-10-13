/**
 * Validates the machine-readable ontology in /data.
 *
 * Deliberately dependency-free so it runs anywhere (CI, a contributor's laptop)
 * without installing a JSON Schema library. It checks the structural rules in
 * data/schema/ontology.schema.json plus the referential integrity that a schema
 * cannot express (child IDs resolving, tags being known, ids matching keys).
 *
 * Usage:  npm run validate:data
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(root, 'data', p), 'utf8'));

const ontology = read('ontology.json');
const categories = read('framework-categories.json');
const tagDefs = read('framework-tag-definitions.json');
const tagReasons = read('tag-reasons.json');
const initial = read('initial-visible-nodes.json');
const schema = read('schema/ontology.schema.json');

const validTags = new Set(schema.$defs.frameworkTag.enum);
const validTypes = new Set(schema.$defs.ontologyNode.properties.type.enum);
const audiences = ['public', 'tech', 'researcher', 'gov'];
const ids = new Set(Object.keys(ontology));

const errors = [];
const warnings = [];
const err = (id, msg) => errors.push(`${id}: ${msg}`);

for (const [key, node] of Object.entries(ontology)) {
    if (node.id !== key) err(key, `"id" is "${node.id}" but the key is "${key}"`);
    if (!node.label) err(key, 'missing "label"');
    if (!validTypes.has(node.type)) err(key, `invalid type "${node.type}"`);

    for (const field of ['definitions', 'examples']) {
        if (!node[field]) { err(key, `missing "${field}"`); continue; }
        for (const a of audiences) {
            if (!node[field][a] || !String(node[field][a]).trim()) {
                err(key, `"${field}.${a}" is missing or empty`);
            }
        }
    }

    for (const tag of node.tags ?? []) {
        if (!validTags.has(tag)) err(key, `unknown tag "${tag}"`);
    }
    for (const ec of node.essential_characteristics ?? []) {
        if (!ec.description) err(key, 'essential_characteristic missing "description"');
        for (const tag of ec.tags ?? []) {
            if (!validTags.has(tag)) err(key, `unknown tag "${tag}" in essential_characteristics`);
        }
    }
    for (const child of node.children ?? []) {
        if (!ids.has(child)) err(key, `child "${child}" does not exist in the ontology`);
    }
}

// Cross-file integrity
for (const tag of Object.values(categories).flat()) {
    if (!validTags.has(tag)) errors.push(`framework-categories.json: unknown tag "${tag}"`);
}
for (const tag of validTags) {
    if (!tagDefs[tag]) warnings.push(`framework-tag-definitions.json: no definition for "${tag}"`);
}
for (const [nodeId, reasons] of Object.entries(tagReasons)) {
    if (!ids.has(nodeId)) errors.push(`tag-reasons.json: "${nodeId}" is not an ontology node`);
    for (const tag of Object.keys(reasons)) {
        if (!validTags.has(tag)) errors.push(`tag-reasons.json: ${nodeId} has unknown tag "${tag}"`);
    }
}
for (const nodeId of initial) {
    if (!ids.has(nodeId)) errors.push(`initial-visible-nodes.json: "${nodeId}" is not an ontology node`);
}

// Report
const orphans = new Set(ids);
for (const node of Object.values(ontology)) {
    for (const c of node.children ?? []) orphans.delete(c);
}
for (const i of initial) orphans.delete(i);

console.log(`Ontology: ${ids.size} nodes, ${validTags.size} framework tags.`);
if (orphans.size) console.log(`Unreachable from a root node: ${[...orphans].join(', ')}`);
for (const w of warnings) console.log(`WARNING  ${w}`);

if (errors.length) {
    console.error(`\n${errors.length} validation error(s):`);
    for (const e of errors) console.error(`  ERROR  ${e}`);
    process.exit(1);
}
console.log('All ontology data is valid.');
