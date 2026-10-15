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
| `ontology.json` | The 34 ontology nodes — definitions, examples, characteristics, tags and hierarchy |
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

## Optional enrichment fields

Two optional fields let a node carry context without adding clutter to the graph:

- **`related_terms`** — an array of `{ term, definition }`. Use this for
  vocabulary that is worth explaining next to a concept but does not warrant a
  node of its own (for example *re-identification risk*). Rendered in both the
  sidebar and the tabular view.
- **`additional_resources`** — an array of `{ label, url, doi?, note? }`. Further
  reading and source material. `label` and `url` are required; `url` must be
  absolute. Use `note` to say why the link is worth following. Being listed is
  not an endorsement, and linked works may use terms differently to this
  ontology.

## Project-level further reading

`resources.json` holds reading that applies to the ontology **as a whole**
rather than to one concept. Each entry is `{ id, label, url, doi?, publisher?,
note? }`; `id` is kebab-case and unique, `url` must be absolute. It is rendered
in the sidebar's collapsible **Find out more** panel, which is visible whether
or not a node is selected.

Use `resources.json` for framework sources and general background; use a node's
`additional_resources` for reading that only makes sense next to that concept. The
same work may legitimately appear in both, with a concept-specific `note` on the
node. As with `additional_resources`, listing is not an endorsement, and linked
works may use terms differently to this ontology.

## Known gaps

The ontology currently has no branch covering **dataset discovery and
metadata** — cataloguing, data dictionaries, and how a researcher finds out
what exists before requesting access. The `Findable` tags on existing nodes
gesture at it, but the concepts themselves are not modelled. Noted here so the
gap is deliberate and visible rather than forgotten.

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
