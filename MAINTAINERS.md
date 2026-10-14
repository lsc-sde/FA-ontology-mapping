# Maintainers

This file documents how to **run** this project, as distinct from
[`CONTRIBUTING.md`](CONTRIBUTING.md), which covers how to contribute to it.

---

## Current maintainers

| Name | Affiliation | Role |
|---|---|---|
| Ian Farr | Lancashire Teaching Hospitals NHS Foundation Trust | Repository admin |
| Artur Zinnurov | Lancashire Teaching Hospitals NHS Foundation Trust | Senior Research Software Engineer |

Admin rights sit with the `lsc-sde` GitHub organisation. If a maintainer
becomes unavailable, an organisation owner can reassign them — no individual
account is a single point of failure.

---

## Repository facts

- **Canonical repository:** `lsc-sde/federated-analytics-ontology`
- **Standalone, not a fork.** It was detached from the original fork network so
  it can be cited and indexed in its own right. Do not re-fork it into the
  organisation.
- **History:** the full commit history was preserved through the migration.

---

## Deployment

The site is built by GitHub Actions and published to GitHub Pages from the
workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

**Pages must be configured with `build_type: workflow`**, not "deploy from
branch". If it is set to deploy from a branch, the workflow output is ignored.

### The one thing most likely to break the site

`vite.config.ts` sets the asset base path conditionally:

```ts
base: process.env.GITHUB_ACTIONS ? '/federated-analytics-ontology/' : '/',
```

GitHub Pages serves this project from a **subdirectory**, so assets must be
prefixed with the repository name. Local dev and Vercel serve from the root.

> ⚠️ **If the repository is ever renamed, this string must be updated in the same
> change.** A mismatch produces a blank white page with 404s on every asset and
> no build error. This exact failure is what left the original site broken.

Other places the repository name appears: `package.json` (`name`,
`repository.url`), `package-lock.json`, `data/schema/ontology.schema.json`
(`$id`), `CITATION.cff` (`repository-code`), and `CONTRIBUTING.md`.

---

## Held decisions

Changes that have been considered and **deliberately deferred**. Recorded here so
they are not silently re-litigated or accidentally applied.

| Decision | Status | Condition for revisiting |
|---|---|---|
| Rename the on-screen title from "Language Road Map" | **Held** | The `<h1>` in `src/components/Sidebar.tsx` still reads "Language Road Map", while `index.html`, `README.md`, `CITATION.cff`, `data/README.md` and `NOTICE` all say "Federated Analytics Ontology". This inconsistency is known. "Ontology" is accurate but not public-facing; a friendlier display name (e.g. "Federation Atlas") is under consideration. Note that name is already in use by a downstream fork at `jonaaeva.github.io/federation-atlas/`, so settle it with them first. |
| Remove the prototype disclaimers from the tool | **Actioned** | Removed from the sidebar, the tabular view and the top placeholder bar. Note the in-app warnings are now gone while the definitions themselves have still not been through stakeholder review — the only remaining signals of draft status are the "Drafting" watermark in `src/App.tsx` and the prototype note in `README.md`. |
| Remove the bottom survey banner from `src/App.tsx` | **Actioned** | The linked MS Form was confirmed closed and the banner removed. |
| Choice of public contribution channel | **Open** | The footer now links to `CONTRIBUTING.md` on GitHub as an interim measure, but GitHub is a poor destination for public and patient contributors — the audience this project most needs to hear from. Options considered: a replacement MS Form, a `mailto:` to a shared mailbox, or GitHub Issue Forms (`.github/ISSUE_TEMPLATE/`). A new form only helps if someone owns triage; the previous survey expired and was not replaced. Decide the owner before adding a form. |

A downstream fork has applied some of these changes already. That is not a
precedent for this repository, which carries NHS attribution and a CC BY 4.0
content licence the fork does not.

---

## Release process

1. Make sure `main` is green: `npm run validate:data && npm run lint && npm run build`
2. Update `version` in `package.json` **and** `CITATION.cff`, and set
   `date-released` in `CITATION.cff` to the release date.
3. Commit, then tag: `git tag -a v0.2.0 -m "..."` and `git push --tags`
4. Create a GitHub Release from the tag.
5. If Zenodo integration is enabled, the release automatically mints a DOI.
   Add the DOI badge to `README.md` afterwards.

Zenodo reads `CITATION.cff`, so author list, licences and URL must be correct
**before** tagging — a DOI is permanent and cannot be edited in place.

---

## Reviewing changes to the ontology

**`/data` is canonical.** The JSON files in `data/` are the source of truth.

`src/data/*.ts` is **generated** from them by `npm run extract:data` — do not
hand-edit those files, as the next extraction will overwrite the changes.

For any content change:

```bash
npm run validate:data
```

The validator checks that tags come from the recognised set, each `id` matches
its key, `children` resolve to real nodes, and tag reasons reference nodes that
exist. CI runs `validate:data` and `lint` before `build`, so a malformed
ontology fails the deploy rather than shipping.

When reviewing a new or changed concept, check that it defines **all four
audiences** (`public`, `tech`, `researcher`, `gov`) for both `definitions` and
`examples`, and that any framework tag has a matching justification in
`tag-reasons.json`. Unexplained tags are hard for others to trust or challenge.

---

## Settings not captured in git

These live in GitHub settings and are lost if the repo is recreated:

- Pages: enabled, source `build_type: workflow`
- Actions: enabled, with read/write permission for the Pages deployment
- Description, homepage URL and topics
- Branch protection on `main`, if adopted

---

## Known issues and technical debt

- **Orphan nodes.** `fed_access`, `sdc_output` and `fed_outputs` are not reachable
  from the graph root, so they never appear in the graph view. They are valid
  and do appear in the tabular view. Tracked as an open issue.
- **Untyped relations.** `children` currently expresses several different
  relationships at once — "is a kind of", "is implemented by" and "is part of".
  Splitting these into named relation types is the main prerequisite for a
  SKOS/RDF export, and would likely resolve the orphan nodes too.
- **Dev-only audit advisories.** `npm audit` reports issues in development
  tooling only; `npm audit --omit=dev` is clean. These are not shipped to users.
- **Prototype status.** Definitions are under active review and are not settled.
  The in-app disclaimers have been removed, so the prototype warning in
  `README.md` and the "Drafting" watermark are now the only signals of draft
  status. Keep both until the definitions are reviewed and signed off.

---

## Handing over

Before stepping away, please:

1. Make sure at least one other person has admin on the repository.
2. Update the maintainers table above.
3. Note any in-flight work in an issue rather than leaving it only in a branch.
4. Confirm `CITATION.cff` still reflects who should be credited.
