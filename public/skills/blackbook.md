<!-- Public copy of Vu Tran's "blackbook" skill, published Oct 2026. Client and prospect names removed. Files under references/, assets/ and scripts/ are not included here. -->

---
name: blackbook
description: Vu's system for turning any process, rule, workflow, or hard-won lesson into a permanent skill available in every future chat. Use when Vu says "blackbook it," "blackbook this," "add this to the blackbook," "what's in the blackbook," "make this a skill," "save this process," "record this so we don't lose it," "make this permanent," or asks to update, edit, or improve an existing skill. Also use proactively when a session produces a repeatable process, a set of standards, a decision rubric, or a research finding that would be expensive to rebuild — offer to blackbook it before the session ends. Handles authoring, packaging as a .skill file, filing the source to disk, and maintaining the index.
---

# The Blackbook

A graffiti writer's blackbook is where pieces get developed, refined, and kept. You carry it everywhere. It's the working sketchbook and the permanent record at the same time.

This is Vu's. Every process, rule, and rubric worth keeping goes in it as a skill, so it loads automatically in any future chat instead of being rebuilt from scratch or lost when a conversation ends.

**The problem this solves:** work built in a chat evaporates when the chat ends. A process figured out on Tuesday is gone by Thursday. The Blackbook is how anything worth keeping stops evaporating.

---

## What lives where

| Thing | Where | What it is |
|---|---|---|
| **Source of truth** | `~/Projects/Blackbook/<skill-name>/` | The editable folder. Version it, improve it, rebuild from it. |
| **Compiled copy** | Vu's Claude account | The `.skill` file he saved. What actually loads in chats. |
| **The index** | `~/Projects/Blackbook/INDEX.md` | What's in the book, what each one does, when it was last touched. |

**Both matter.** The account copy is what runs. The disk copy is what survives, what can be edited, and what can be rebuilt if something breaks.

**A hard limit worth stating plainly:** skills cannot be created or saved into Vu's account from inside a chat. Skill files on disk are a read-only cache — editing them does nothing to the live skill. The only path is: author it, package it, hand Vu the `.skill` file, and **he clicks to save it.** Always report a skill as *delivered*, never as *saved*. There's no signal back either way.

---

## The five steps

Read `references/skill-anatomy.md` before writing anything. Read `references/packaging-and-filing.md` before building the file.

### 1. Scope it

Before writing, get clear on four things. Ask if they're not obvious:

- **Trigger** — what will Vu say or do that should fire this?
- **Job** — what does it actually produce? A document, a decision, an analysis, a build?
- **Boundaries** — what should it explicitly *not* do?
- **Done** — what does a good output look like?

**Don't blackbook a one-off.** A skill is worth building when the process will run more than a handful of times, or when the knowledge inside it was expensive to acquire. A single task is just a task.

### 2. Write it

Structure and conventions live in `references/skill-anatomy.md`. The short version:

```
<skill-name>/
  SKILL.md              ← frontmatter + the process. Keep under ~200 lines.
  references/           ← detail loaded only when needed
  assets/               ← templates, boilerplate, output formats
  scripts/              ← executable helpers, if any
```

**The description field is the most important line in the whole skill.** It's the only thing read when deciding whether to load. A vague description means a skill that never fires. Load it with the actual words Vu would say.

**Bake in the knowledge, not just the steps.** A skill that says "score the opportunity" is weak. A skill that says "score it against these six dimensions, and here are the benchmark numbers measured in July 2026" is durable. Real numbers, real thresholds, real sources — that's what makes it worth more than a prompt.

### 3. Package it

```bash
cd <build-dir> && zip -r <skill-name>.skill <skill-name>
```

Then verify with `unzip -l` that the `.md` files are actually in there, not just empty directories. This has failed silently before — **always check the listing before delivering.**

### 4. Deliver and file

Two moves, both required:

1. **`SendUserFile`** the `.skill` archive so Vu can save it to his account
2. **Write the source folder** to `~/Projects/Blackbook/<skill-name>/` via `device_commit_files` so there's a master copy on his Mac

Skipping the second one recreates the exact problem the Blackbook exists to solve.

### 5. Update the index

Add or update the entry in `~/Projects/Blackbook/INDEX.md`. Template in `assets/INDEX-template.md`. One row: name, what it does, trigger phrases, date, status.

---

## Updating an existing skill

Don't rewrite from memory. Read the source first.

1. Read `~/Projects/Blackbook/<skill-name>/` to get the current state
2. Make the change
3. Bump the "last updated" date in the index and note what changed
4. Repackage, redeliver, refile

**Tell Vu he has to re-save it.** Editing the disk copy does not update the live skill in his account. He has to save the new `.skill` file for the change to take effect. This trips people up constantly.

---

## "What's in the blackbook?"

Read `~/Projects/Blackbook/INDEX.md` and summarize. If the folder doesn't exist yet, say so and offer to start it.

Worth also checking the skills actually loaded in the current session — the index tracks what was *built*, which can drift from what Vu has *saved*. If something's in the index but not loaded, he may never have saved it, or saved it and it's not triggering. Both are worth flagging.

---

## Standing rules

**Offer proactively, don't nag.** When a session produces something reusable — a rubric, a workflow, a set of standards, expensive research — say once at the end: "worth blackbooking?" Drop it if he passes.

**One skill, one job.** A skill that does five unrelated things triggers unreliably and is miserable to maintain. Split it.

**Write in Vu's voice.** Direct, casual, no fluff or corporate-speak, no fake positivity, easy on em dashes. These are his tools and they should sound like him, not like documentation.

**Preserve the reasoning, not just the steps.** Six months from now the *why* is what makes a skill usable. Especially the parts that were counterintuitive.

**Separate measured from inferred** in anything that carries data. If a number came from a tool, say so. If it's a judgment, label it.

**Skill names are lowercase-hyphen.** `comp-autopsy`, not `Comp Autopsy`. The display name can be whatever.

**Never claim a skill is saved.** Delivered, handed over, ready to save. Not saved.

---

## The current book

| Skill | What it does |
|---|---|
| `vtdo-profile` | Vu's personal and professional profile, working preferences, and Claude's role in VTDO. Loads at the start of everything. |
| `comp-autopsy` | Competitive and market research on any URL — video, channel, site, account — plus niche and keyword scans. Mechanic-vs-asset split, GO/TEST/PASS. |
| `idea-autopsy` | Tears down a business idea being pitched on a video, site, sales page, or account. Real model, skeptic lenses, VTDO fit, PURSUE/ADAPT/PASS plus the smallest test. |
| `blackbook` | This one. The process of making processes permanent. |

Keep this table current as the book grows.
