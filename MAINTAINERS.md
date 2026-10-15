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
> no build error, so it will not be caught by CI. This failure mode has occurred
> before — treat it as the first thing to check if the site goes blank.

Other places the repository name appears: `package.json` (`name`,
`repository.url`), `package-lock.json`, `data/schema/ontology.schema.json`
(`$id`), `CITATION.cff` (`repository-code`), and `CONTRIBUTING.md`.

---

## Issue triage

Public feedback arrives as GitHub issues via
[`.github/ISSUE_TEMPLATE/definition-feedback.yml`](.github/ISSUE_TEMPLATE/definition-feedback.yml).

**Triage is an organisation responsibility, not an individual's.** Any
`lsc-sde` maintainer can pick up an issue, and organisation owners can add or
remove maintainers without the channel breaking.

One practical point: **GitHub does not notify an organisation.** Issues only
reach a human if at least one person is *watching* the repository.

- At least one maintainer must set **Watch → All Activity** on this repository.
- Treat that as a handover item: if the last watcher leaves, someone else
  must take it on.

When accepting a contribution:

1. Make the change in `/data` (never in `src/data/` — see
   [`CONTRIBUTING.md`](CONTRIBUTING.md)), then run `npm run extract:data`.
2. If the contributor asked to be thanked by name, add a row to
   [`CONTRIBUTORS.md`](CONTRIBUTORS.md) **using the wording they gave**, linking
   the issue number. If they left the credit field blank, they are covered by
   the collective thanks line — do not name them.
3. Close the issue with a short note on what changed.

### Pull requests and the DCO

Contributions arriving as pull requests are covered by the
[Developer Certificate of Origin](DCO.md) — see
[`CONTRIBUTING.md`](CONTRIBUTING.md). Every commit must carry a
`Signed-off-by` trailer matching the commit author.

- **Do not merge a pull request with an unsigned commit.** Ask the contributor
  to run `git commit --amend -s` (or `git rebase --signoff HEAD~N` for several
  commits) and force-push. This is far easier before the merge than after.
- A sign-off may use a GitHub `users.noreply.github.com` address; that is
  normal and should not be challenged.
- The DCO applies to pull requests only. **Issue-form feedback is not covered**
  and must stay anonymous by default — never ask an issue contributor to sign
  off or to supply a name or email.

---

### Why a DCO rather than a CLA

In academic and NHS settings, a Contributor Licence Agreement usually has to be
reviewed and signed by a legal or IP department, which can delay a contribution
by weeks or months. A CLA transfers or licenses rights to an organisation, and
it is that transfer which triggers the review.

The [DCO](DCO.md) asks for something lighter: contributors certify that they
wrote the contribution, or otherwise have the right to submit it under the
project's licences. No rights are transferred, so in most cases there is nothing
for a legal team to sign. It is the same mechanism used by the Linux kernel and
most CNCF projects, and it is the usual choice for public-sector and academic
open source.

> ℹ️ **State this plainly if R&D / IP ask.** A DCO certifies *provenance*; it is
> not a rights transfer. It grants no relicensing rights and no patent grant
> beyond what Apache-2.0 already provides. If the project ever needed to
> relicense or dual-license commercially, contributors would have to be
> contacted individually. For a public-good ontology under Apache-2.0 and
> CC BY 4.0 this is not a practical constraint, but it should not be presented
> as equivalent to a CLA.

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
- **Branch ruleset on `main`** (Settings → Rules → Rulesets). Adopted
  configuration, recorded here because rulesets are not stored in git:
  - Target: default branch. Enforcement: active.
  - Bypass list: **Repository admin** — maintainers can still push directly to
    `main` for small or urgent changes without opening a pull request.
  - Restrict deletions; block force pushes; require linear history.
  - Require a pull request before merging, 0 approvals, dismiss stale
    approvals, require conversation resolution. This binds outside
    contributors; admins bypass it.
  - Require status checks to pass, branches up to date. Required checks:
    `check`, `audit` (from `ci.yml`) and `analyze` (from `codeql.yml`).
  > ⚠️ Do **not** add the Pages deploy job as a required check. `deploy.yml`
  > triggers on `push` to `main`, not on `pull_request`, so it never reports a
  > status on a pull request and would block every merge indefinitely. For the
  > same reason the `links` job is not required: `links.yml` sets `fail: false`
  > by design, so it always passes and carries no signal.
- **DCO status check** — provided by the official
  [DCO GitHub App](https://github.com/apps/dco), installed at the `lsc-sde`
  organisation and scoped to this repository. Installing it requires an
  **organisation owner**; repository admin is not sufficient.
  > ⚠️ **Status: pending installation.** The
  > [DCO](DCO.md) itself is already in force — the certification is the
  > `Signed-off-by` trailer in each commit, not the check. Until an owner
  > installs the app, no `DCO` check appears on pull requests and sign-off must
  > be confirmed by eye at review. Nothing needs to change in the repository
  > when it is installed; it becomes active on the next pull request.

---

## Known issues and technical debt

- ~~**Orphan nodes.**~~ Resolved. `fed_access` and `fed_outputs` were unreachable
  from the graph root. They are now attached as children of `fed_people` and
  `fed_analytics` respectively, matching the positions they already occupied in
  the `GraphViewer` ring layout. `sdc_output` was already reachable via
  `data_protect`; the note listing it was out of date.
- **Untyped relations.** `children` currently expresses several different
  relationships at once — "is a kind of", "is implemented by" and "is part of".
  Splitting these into named relation types is the main prerequisite for a
  SKOS/RDF export.
- **Dev-only audit advisories.** Outstanding advisories sit in the build chain
  (`vite`, `postcss-selector-parser` and their dependencies), not in anything
  shipped to a visitor's browser. This is a deliberate, standing position rather
  than a backlog item.

  Deliberately **no counts are recorded here**, because they change every time
  Dependabot opens a grouped update and would be stale within the week. Check
  the live sources instead:

  ```bash
  npm audit --omit=dev     # runtime only — this is the one that must stay clean
  npm audit                # whole build chain — expected to be non-empty
  ```

  - **Dependabot alerts:** Security → Dependabot alerts
    ([open the live list](https://github.com/lsc-sde/federated-analytics-ontology/security/dependabot))
  - **Open update PRs:** [`deps` / `deps-dev` pull requests](https://github.com/lsc-sde/federated-analytics-ontology/pulls?q=is%3Apr+is%3Aopen+label%3Adependencies)

  Dependabot's count is normally higher than npm's because it draws on a broader
  advisory database and does not distinguish runtime from development
  dependencies. Neither figure is wrong; they answer different questions.

  **The rule, which does not drift:** `npm audit --omit=dev` must be clean, and
  CI enforces that — the `audit` job in
  [`ci.yml`](.github/workflows/ci.yml) fails on a high-severity runtime
  advisory, while the whole-chain audit is reported `continue-on-error` for
  visibility only. Build-chain advisories are cleared by `npm audit fix`, or
  left outstanding where the only remedy is `npm audit fix --force`, which
  installs breaking majors (`tailwindcss@4`, `vite@8`). Revisit those as a
  planned Vite/Tailwind upgrade, not by forcing majors into a working build to
  silence issues that never reach a browser.
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
