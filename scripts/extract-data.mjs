/**
 * One-off / repeatable extraction of the ontology content from the TypeScript
 * source in `src/data/` into machine-readable JSON in `data/`.
 *
 * The ontology is a citable research output in its own right (CC BY 4.0) and
 * should not be locked inside a React application. This script produces the
 * canonical JSON artefacts that the app then imports.
 *
 * Usage:  node scripts/extract-data.mjs
 */
import { build } from 'esbuild';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');
const tmp = join(root, '.extract-tmp.mjs');

// Bundle the TS data modules into a single ESM file we can import at runtime.
await build({
    entryPoints: [join(root, 'src/data/index-for-extraction.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: tmp,
    logLevel: 'silent',
});

const mod = await import(pathToFileURL(tmp).href);

mkdirSync(join(dataDir, 'schema'), { recursive: true });

const write = (name, value) => {
    const file = join(dataDir, name);
    writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
    const count = Array.isArray(value) ? value.length : Object.keys(value).length;
    console.log(`  wrote data/${name} (${count} top-level keys)`);
};

console.log('Extracting ontology content to data/ ...');
write('ontology.json', mod.ontologyData);
write('framework-categories.json', mod.frameworkCategories);
write('framework-tag-definitions.json', mod.frameworkTagDefinitions);
write('tag-reasons.json', mod.tagReasons);
write('initial-visible-nodes.json', mod.initialVisibleNodes);

rmSync(tmp, { force: true });
console.log('Done.');
