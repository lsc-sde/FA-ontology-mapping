# Ontology data

> **Licence note:** everything in this directory is licensed under
> **CC BY 4.0** (see [`LICENSE-DATA.txt`](LICENSE-DATA.txt)) — **not** the
> Apache-2.0 licence that covers the application code in `/src`.

This directory is the **canonical, machine-readable source** of the Federated
Analytics Ontology vocabulary. The React application in `/src` imports these
files; it does not hold its own copy.

> **Provenance:** the definition text in `ontology.json` was **AI-generated** as
> a drafting starting point and has not yet completed stakeholder review. Treat
> it as a draft under active revision, not as authoritative terminology.

## Files

| File | Contents |
|---|---|
| `ontology.json` | The 29 ontology nodes — definitions, examples, characteristics, tags and hierarchy |
| `framework-categories.json` | Which tags belong to which framework (Five Safes, FAIR, PEDRI, SATRE) |
| `framework-tag-definitions.json` | Plain-English definition of each of the 20 framework tags |
| `tag-reasons.json` | Why a given framework tag was applied to a given node |
| `initial-visible-nodes.json` | Node(s) shown when the app first loads |
| `schema/ontology.schema.json` | JSON Schema (draft 2020-12) describing `ontology.json` |

## The four-audience model

Every node defines the same concept four times, because the whole point of the
project is translation between communities:

- **`public`** — plain English, no jargon
- **`tech`** — technical and architectural detail
- **`researcher`** — what it means for doing research
- **`gov`** — governance, legal and information-governance framing

`examples` follows the same shape, and may additionally carry `sde` and `dare`
examples used by the tabular view.

## Framework tagging

Nodes are mapped to four established assurance frameworks: **Five Safes**,
**FAIR**, **PEDRI** and **SATRE**. Tags assert that a concept is relevant to a
principle; `tag-reasons.json` records the justification, which is shown in the
app when a tag is clicked.

## Validating changes

After editing any file here, run:

```bash
npm run validate:data
```

This checks structure, that every tag is recognised, that `id` matches its key,
that `children` resolve to real nodes, and that `tag-reasons.json` only
references nodes that exist.

## Attribution

When reusing this data, please credit the collaboration between Lancashire
Teaching Hospitals NHS Foundation Trust, the University of Liverpool
(DataSHIELD), the University of Nottingham, and DARE UK. For academic citation
use [`CITATION.cff`](../CITATION.cff).
