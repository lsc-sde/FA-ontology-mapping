# Federated Analytics Ontology

**An interactive map of the language used to describe the federation of data within UK health data research systems.**

Led by **Lancashire Teaching Hospitals NHS Foundation Trust**, in collaboration with the University of Liverpool and the University of Nottingham, and supported by DARE UK.

> ⚠️ **Prototype.** This is a working prototype intended to support discussion. Definitions are under active review and should not yet be treated as settled or authoritative.

---

## Why this exists

When multiple Trusted Research Environments (TREs) and Secure Data Environments (SDEs) link up to allow analysis across their data without moving it, the people involved — the public, engineers, researchers, and information governance teams — frequently use the same words to mean different things, or different words to mean the same thing.

This project maps that vocabulary. Every concept is defined **four times, once for each audience**, and mapped against four established assurance frameworks, so that a conversation between a patient representative and a security architect can start from shared ground.

## The four-audience model

Each of the 29 concepts carries a definition and a worked example for:

| Audience | Framing |
|---|---|
| **Public** | Plain English, no jargon |
| **Technical** | Architecture, protocols, implementation |
| **Researcher** | What it means for doing research |
| **Governance** | Legal, ethical and information-governance framing |

## The four framework lenses

Concepts are tagged against four widely used frameworks, and every tag carries a recorded justification shown when you click it:

- **Five Safes** — Safe People, Projects, Settings, Data, Outputs
- **FAIR** — Findable, Accessible, Interoperable, Reusable
- **PEDRI** — public engagement and involvement principles
- **SATRE** — Standard Architecture for Trusted Research Environments

## Using the app

- **Graph view** — explore concepts and how they relate, expanding nodes as you go
- **Tabular view** — compare all concepts side by side
- **Audience toggle** — switch any definition between the four framings
- **Framework filtering** — see which concepts speak to which principles

## The ontology as data

The vocabulary is **not locked inside the application**. It lives as machine-readable JSON in [`/data`](data/), described by a [JSON Schema](data/schema/ontology.schema.json), so it can be reused, validated and cited independently of this website.

See [`data/README.md`](data/README.md) for the structure.

## Running locally

```bash
npm ci
npm run dev
```

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Type-check and produce a production build |
| `npm run validate:data` | Validate the ontology in `/data` |
| `npm run lint` | Lint the source |
| `npm run preview` | Preview the production build |

Built with React, TypeScript, Vite, Tailwind CSS and React Flow (`@xyflow/react`).

## Contributing

**Contributions are welcome — including from people who don't write code.**

If a definition is unclear, wrong, or missing, that is exactly the kind of feedback this project needs. You do not need to understand GitHub or ontologies to help; opening an issue in plain English is enough.

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) to get started.

## Maintaining this project

If you are taking over or helping run this repository, see
[`MAINTAINERS.md`](MAINTAINERS.md) for the release process, deployment notes and
known issues.

## Acknowledgements

This work has been shaped by extensive public engagement and by contributions from advisory groups committed to ethical, transparent and accountable health data research — in particular the **Lancashire and South Cumbria Data into Impact Programme (SDE) Public Advisory Group** and the **North West Secure Data Environment Public Advisory and Accountability Group**.

## Citation

If you use this work, please cite it using the metadata in [`CITATION.cff`](CITATION.cff).

## License

This repository uses a dual-license structure to accommodate both software and data.

* **Source Code:** All application code, build configuration and scripts are licensed under the [Apache License 2.0](LICENSE).
* **Data and Ontologies:** All datasets, mappings and ontology files in the [`data/`](data/) directory are licensed under a [Creative Commons Attribution 4.0 International License (CC BY 4.0)](data/LICENSE-DATA.txt).

When utilizing the data or ontologies, please attribute the work as **led by Lancashire Teaching Hospitals NHS Foundation Trust**, in collaboration with **the University of Liverpool** and **the University of Nottingham**, and supported by **DARE UK**.

> ℹ️ Licensing is subject to confirmation by Lancashire Teaching Hospitals NHS Foundation Trust R&D / IP.
