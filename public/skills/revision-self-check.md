<!-- Public copy of Vu Tran's "revision-self-check" skill, published Oct 2026. Client and prospect names removed. Files under references/, assets/ and scripts/ are not included here. -->

---
name: revision-self-check
description: Vu's standing rule for ALL code work, every project, every stack — after EVERY revision, check what the change broke BEFORE reporting anything. Never say "fixed" while the fix has broken something else. Covers verifying an edit actually applied (silent no-match replacements), checking the reverse/undo path not just the forward one, checking a range of inputs and sizes not one, verifying the built or deployed artifact rather than the local file, and stating plainly what the revision might have destabilised. Applies to web, backend, scripts, config, infra, data — anything. Use on every code session and revision iteration, including bug fixes, refactors, deploys and "quick" one-liners. Also use when Vu says "did you check," "what did that break," "self check," "run your checks," or points out a regression you should have caught. Do NOT wait to be asked; it runs by default.
---

# Revision Self-Check

Vu's standing rule, in his words: *"Don't tell me something is fixed when it broke 3 other things."* He'd hold a human dev to this and he holds you to it.

**Applies to every project and every stack** — web, backend, scripts, config, infra, data, WordPress, Vercel, whatever. Not just the project it was written in.

The failure this prevents isn't bad code. It's **reporting confidently on work you didn't verify** — so Vu becomes the regression suite. That's the actual problem. Every round he spends catching something you could have caught is a round wasted.

---

## The rule

**Before writing "fixed", "done", or "deployed" — check what the change broke.**

Not "does the thing I fixed work now." That's the easy half and it's the half that lies. The question is **what else moved.**

---

## Every revision, in order

### 1. Did the edit actually apply?

String-replacement edits **fail silently**. The tool reports success, the replacement matched nothing, and the file is unchanged. This has shipped bugs repeatedly.

```bash
grep -n "<the new text>" file        # it's really there
grep -c "<the old text>" file        # and the old text is really gone
```

Two specific traps:

- **You edited that block earlier in the session**, so the text you're matching no longer exists.
- **A later rule in the file overrides yours** at equal specificity. The edit applied and still does nothing. Grep for *every* rule touching that selector and check source order.

### 2. What could this plausibly have broken?

Say it out loud before checking. Naming it is most of the work.

- Changed a shared helper or utility → every caller
- Changed a base class, mixin, or default → everything inheriting it
- Changed a schema, type, or API shape → both sides of the boundary
- Changed layout → does content still fit, at every size
- Changed a state machine → does the reverse/undo path still work
- Changed env, config, or build settings → does the built artifact still work
- Deleted or moved a block → did anything else live inside it

### 3. Run the checks

- **Verify the BUILT/DEPLOYED artifact**, not the local source. They diverge — a bad deploy, a stale cache, a build step that dropped something. `curl <url>/app.js | node --check /dev/stdin`, re-run the test suite against the build, hit the live endpoint.
- **Reverse the path.** Scroll back up, undo, navigate back, roll back the migration. Anything stateful must be a pure function of its inputs, not of history.
- **Range, not a point.** One viewport height, one input, one record proves nothing. Check the edges: empty, huge, short, tall, first, last.
- **Logs and console must be clean.** One uncaught exception silently kills every later step in the same function.
- **Re-run whatever tests exist.** If there are none, the checks you just ran ARE the tests — write them down (below).

### 4. Report honestly

State what you verified and how. If something is still broken or you couldn't check it, **say so in the same message** — never let Vu discover it.

---

## Write the check down

Once a bug is found, make it an assertion in a script that lives in the repo. A bug caught by hand once will ship again; a bug with a test won't.

See `references/regression-harness.md` for a working headless-Chrome harness and the assertion table pattern.

---

## Hard-won specifics

Each of these shipped once. They are the reason this skill exists.

| Trap | What happened |
|---|---|
| Silent no-match edit | Replacement matched nothing, reported OK, "fix" never existed |
| Later rule wins | Correct CSS written, overridden by a rule further down the file |
| Slice took neighbours | Rewriting a region by index swallowed two adjacent functions; deployed broken |
| One-size fit check | "Fits the viewport" verified at exactly one height; broke at every other |
| Forward-only testing | Scrolling down worked; scrolling up never retraced it |
| Counter drift | A hide/show counter lost one decrement and hid an element for the rest of the page. Prefer a keyed Set over a counter |
| Window vs latch | "Once revealed, stays revealed" implemented as a range, so it un-revealed on exit |
| Animated but never styled | A CSS variable was animated with no rule consuming it. The effect never existed, and it got reported as working |
| Unstyled SVG path | A path with no `fill` declared defaults to **black**. Stroked geometry must say `fill:none` |
| Fixing by eye | Screenshot looked right, measurement said otherwise. Measure |

---

## Boundaries

- Not a substitute for Vu's review — it's what earns it.
- Don't perform the checking in narration. Run it, then report the result in a line or two.
- Scale it: a copy tweak needs a glance, a state-machine change needs the full pass.
- Don't fix unrelated things you spot mid-check. Note them and ask.

---

## Done looks like

- The edit is verified present, not assumed
- You named what might have broken, then checked it
- Forward *and* reverse verified
- A range of sizes, not one
- The deployed artifact parses
- Anything still broken is stated by you, first
