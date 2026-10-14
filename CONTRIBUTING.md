# Contributing

Thank you for your interest in the Federated Analytics Ontology project. This is
a **consensus-building project about language**, so contributions about wording
and meaning are just as valuable as code — arguably more so.

There are two ways to contribute, and **the first requires no technical skill at
all**.

---

## 1. Propose or challenge a definition (no code needed)

If a definition is unclear, misleading, missing, or doesn't match how your
community actually uses a term, please tell us. You do not need to understand
GitHub, TypeScript, or ontologies to do this.

**[Open an issue using our feedback form](https://github.com/lsc-sde/federated-analytics-ontology/issues/new?template=definition-feedback.yml)**. The form
asks which term you're commenting on, which audience it affects, what's wrong or
missing, and any wording you'd suggest instead — but **every field except the
first is optional**. Tell us whatever you can and leave the rest blank.

We particularly welcome contributions from **members of the public, patients,
and public advisory group members**. This project exists because the language
used around federated health data research is often inaccessible; if a "plain
English" definition isn't plain to you, that is a bug and we want to hear it.

**Contributions are anonymous by default.** The form asks whether you'd like to
be thanked by name, and how you'd like to be named — leave it blank and we won't
record one. Accepted contributions are listed in
[`CONTRIBUTORS.md`](CONTRIBUTORS.md), where anonymous ones are thanked
collectively rather than named. Being listed there is thanks rather than
authorship; see the note on authorship in that file.

---

## 2. Contribute code or data changes

### Getting set up

```bash
git clone https://github.com/lsc-sde/federated-analytics-ontology.git
cd federated-analytics-ontology
npm ci
npm run dev
```

### Making a change

1. Fork the repository and create a branch from `main`.
2. Make your change.
   - **Ontology content** lives in [`/data`](data/) as JSON — not in `/src`.
   - **Application code** lives in `/src`.
3. Validate and build:
   ```bash
   npm run validate:data
   npm run lint
   npm run build
   ```
4. Open a pull request describing what changed and why.

### Editing the ontology

Edit the JSON in [`/data`](data/), then **regenerate the files the app reads**:

```bash
npm run extract:data   # regenerates src/data/*.ts from /data/*.json
npm run validate:data  # checks the result is structurally sound
```

> ⚠️ **Do not skip `extract:data`, and do not hand-edit `src/data/*.ts`.**
> `/data` is canonical, but the React app imports the *generated* TypeScript in
> `src/data/`. If you edit the JSON and skip this step, `validate:data`, `lint`
> and `build` will all still pass and your change simply will not appear in the
> app. Any manual edit to `src/data/*.ts` is overwritten by the next extraction.

Commit both the `/data` change and the regenerated `src/data/` files together.

The validator checks that tags are recognised, `id` matches its key, `children`
resolve to real nodes, and tag reasons reference nodes that exist.

#### The shape of a node

Each entry in `data/ontology.json` is keyed by its `id` and must repeat that
`id` in the body. All four audiences are required for both `definitions` and
`examples`:

```json
"fed_people": {
  "id": "fed_people",
  "label": "Federation of People",
  "type": "concept",
  "definitions": {
    "public": "Plain English, no jargon.",
    "tech": "Technical and architectural detail.",
    "researcher": "What it means for doing research.",
    "gov": "Governance, legal and IG framing."
  },
  "examples": {
    "public": "…", "tech": "…", "researcher": "…", "gov": "…"
  },
  "characteristics": ["Observable or measurable statement"],
  "tags": ["Safe People", "PEDRI: Transparency"],
  "children": ["some_other_node_id"]
}
```

#### Adding a new node

A new node is only reachable if an existing node lists it in `children`. Add the
node, then add its `id` to the `children` array of its parent — otherwise it
will never appear in the graph view, only in the tabular view. `validate:data`
reports unreachable nodes on every run; please don't add to that list.

If you add a framework tag to a node, please also add a corresponding entry in
`tag-reasons.json` explaining **why** it applies. Unexplained tags are hard for
others to trust or challenge.

---

## Licensing of contributions

This repository is dual-licensed:

- Code contributions are accepted under the **Apache License 2.0**.
- Ontology/content contributions are accepted under **CC BY 4.0**.

By submitting a contribution you confirm you have the right to do so, and agree
to it being released under the relevant licence above. If you are contributing
on behalf of an employer, please make sure you have their approval.

---

## Conduct

Please be respectful and constructive. This project brings together NHS staff,
academics, technologists and members of the public, who all use language
differently — that difference is the subject matter, not an obstacle.

## Questions

If you're unsure whether something is worth raising, raise it. An issue that
turns out to be a misunderstanding is still useful evidence that a definition
needs work.
