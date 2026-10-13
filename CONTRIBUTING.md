# Contributing

Thank you for your interest in the Federation Ontology Mapping project. This is
a **consensus-building project about language**, so contributions about wording
and meaning are just as valuable as code — arguably more so.

There are two ways to contribute, and **the first requires no technical skill at
all**.

---

## 1. Propose or challenge a definition (no code needed)

If a definition is unclear, misleading, missing, or doesn't match how your
community actually uses a term, please tell us. You do not need to understand
GitHub, TypeScript, or ontologies to do this.

**Open an issue** and include whatever you can:

- The term you're commenting on
- Which audience it affects — public, technical, researcher, or governance
- What's wrong, or what's missing
- A suggested alternative wording, if you have one

We particularly welcome contributions from **members of the public, patients,
and public advisory group members**. This project exists because the language
used around federated health data research is often inaccessible; if a "plain
English" definition isn't plain to you, that is a bug and we want to hear it.

You will be credited for accepted contributions unless you ask not to be.

---

## 2. Contribute code or data changes

### Getting set up

```bash
git clone https://github.com/lsc-sde/FA-ontology-mapping.git
cd FA-ontology-mapping
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

Edit the JSON in [`/data`](data/), then run `npm run validate:data`. The
validator checks that tags are recognised, `id` matches its key, `children`
resolve to real nodes, and tag reasons reference nodes that exist.

If you add a framework tag to a node, please also add a corresponding entry in
`tag-reasons.json` explaining **why** it applies. Unexplained tags are hard for
others to trust or challenge.

Every node must define all four audiences (`public`, `tech`, `researcher`,
`gov`) for both `definitions` and `examples`.

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
