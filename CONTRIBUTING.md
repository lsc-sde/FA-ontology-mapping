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

> **The Developer Certificate of Origin does not apply to this route.** It
> covers pull requests only. Giving feedback through the form requires no
> sign-off, no name and no email address.

---

## 2. Contribute code or data changes

### Making a change

**1. Fork the repository and install dependencies.**

With the [GitHub CLI](https://cli.github.com/), this forks, clones, and sets
`upstream` to the original repository in one step:

```bash
gh repo fork lsc-sde/federated-analytics-ontology --clone
cd federated-analytics-ontology
npm ci
```

Without the CLI, fork the repository on GitHub first, then clone **your fork**
and add the original as `upstream`:

```bash
git clone https://github.com/YOUR-USERNAME/federated-analytics-ontology.git
cd federated-analytics-ontology
git remote add upstream https://github.com/lsc-sde/federated-analytics-ontology.git
npm ci
```

> Maintainers with write access can skip the fork and branch directly in the
> canonical repository.

**2. Create a branch from `main`.**

```bash
git switch -c my-change main
```

**3. Make your change.**

- **Ontology content** lives in [`/data`](data/) as JSON — not in `/src`.
  See [Editing the ontology](#editing-the-ontology) below.
- **Application code** lives in `/src`.

Preview it locally with `npm run dev`.

**4. Validate and build.**

```bash
npm run validate:data
npm run lint
npm run build
```

**5. Commit with a sign-off** — see [Signing your work](#signing-your-work).

```bash
git commit -s -m "A descriptive commit message"
```

**6. Push and open a pull request** describing what changed and why.

```bash
git push -u origin my-change
```

If your fork has fallen behind while you worked, update it before opening the
pull request:

```bash
git fetch upstream
git rebase upstream/main
```

### Signing your work

All commits in a pull request must carry a `Signed-off-by` line certifying the
[Developer Certificate of Origin](DCO.md) (DCO). Git adds it for you with the
`-s` flag:

```bash
git commit -s -m "Your descriptive commit message"
```

That appends a trailer to the commit message, e.g.:

```
Signed-off-by: Jane Doe <jane.doe@university.ac.uk>
```

To sign off every commit in this repository automatically:

```bash
git config format.signoff true
```

If you have already committed without signing off, amend the last commit:

```bash
git commit --amend -s
```

Or sign off the last `N` commits on your branch, then force-push:

```bash
git rebase --signoff HEAD~N
```

Use your real name, or a name you are identifiable by. The line must match the
commit author.

#### Sign-off and your email address

**A sign-off puts the email address in `user.email` into the public commit
history, permanently.** If you would rather not publish a personal or
institutional address, enable **Settings → Emails → Keep my email address
private** on GitHub and set git to use the address it gives you:

```bash
git config user.email "12345678+yourusername@users.noreply.github.com"
```

Do this **before** you commit. Changing it afterwards means rewriting history.

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

This repository is dual-licensed, and which licence applies depends on what you
changed:

- **Application code** (`/src`, build config, scripts) — **Apache License 2.0**
  (see [`LICENSE`](LICENSE)).
- **Ontology content** (`/data`) — **CC BY 4.0**
  (see [`data/LICENSE-DATA.txt`](data/LICENSE-DATA.txt)).

The DCO refers to "the open source license indicated in the file"; for this
repository that means the mapping above. If a pull request touches both, each
part is accepted under its own licence.

If you are contributing on behalf of an employer, please make sure you have
their approval — the DCO asks you to certify that you have the right to submit
the work.

---

## Pull request process

1. Make sure every commit is signed off (see
   [Signing your work](#signing-your-work)).
2. Make sure your change meets the project's formatting and quality standards:
   `npm run validate:data`, `npm run lint` and `npm run build` should all pass.
3. Open your pull request.

Sign-off is checked when your pull request is reviewed, and an automated `DCO`
status check runs on pull requests. If a commit is missing its sign-off, the fix
is `git commit --amend -s` (or `git rebase --signoff HEAD~N`) followed by a
force-push.

---

## Conduct

Please be respectful and constructive. This project brings together NHS staff,
academics, technologists and members of the public, who all use language
differently — that difference is the subject matter, not an obstacle.

## Questions

If you're unsure whether something is worth raising, raise it. An issue that
turns out to be a misunderstanding is still useful evidence that a definition
needs work.
