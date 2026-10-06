<!-- Public copy of Vu Tran's "video-pipeline-ops" skill, published Oct 2026. Client and prospect names removed. Files under references/, assets/ and scripts/ are not included here. -->

---
name: video-pipeline-ops
description: Vu's operating rules for any multi-asset video build — the VTDO YouTube pipeline and anything shaped like it. Ground truth (never author against a modelled timing), the autonomy contract (build the whole pass unattended, spot-fix after, with a short list of hard stops), the QC loop that runs before Vu ever sees output (two deterministic gates plus a motion-gfx and a video-editor reviewer), SSD storage, and the rule that every element ships as a discrete asset placed in Final Cut — never an ffmpeg composite. Use when Vu says "run the pass," "build the graphics," "QC this," "spot fix," "why didn't you catch that," "that's rookie stuff," "where do video files go," "which drive," or starts anything that will produce more than one video output. Do NOT use for cleaning a single raw take — that is video-edit-process.
---

# Video Pipeline Ops

How Vu and Claude run a multi-asset video build. Not how to edit — that's `video-edit-process`
and `motion-graphics-craft`. This is the operating contract: what gets checked, what runs
unattended, where files live, and what counts as proof.

Written 2026-09-12, out of the VTDO YT01 build and the audit that followed it.

**The sentence that caused this skill.** Claude, on why three rookie defects shipped:
*"I missed them because I never looked, never measured, and never fetched the transcript."*
Vu: *"We can't work like this blindly."* He is right.
Every rule below exists so that judgment is never the thing standing between a defect and him.

---

## Rule 1 — Ground truth before authoring. No exceptions.

**Nothing is ever authored against a modelled, estimated, or interpolated timing.**

| Audio | Transcript source |
|---|---|
| A HeyGen render | HeyGen's own SRT. `get_video` → `subtitle_url` → `mcp__Apify__apify--web-fetch` with `formats:["raw"]` (`["text"]` fails — the CDN serves `binary/octet-stream`) → `get-dataset-items` with `fields:"raw"` → base64 → decode. It is the TTS engine's own timing, so it beats re-transcribing synthetic speech. Free. |
| Anything Vu records — screen capture, mic take, reference video | `transcribe.py` (faster-whisper **large-v3**, `word_timestamps=True`). Runs in the cloud container in ~40s to load. Word-level, which phrase cues can't give you — a karaoke highlight asserts exact wording and needs the word. |

**Then validate it, every time.** `transcribe.py <media> --validate cues.srt` checks cue count,
monotonicity, sequential ids, and — the one that matters — whether the last cue lands near the
end of the media. A transcript that stops at 97.88s against a 280.28s master is truncated, and
that exact failure shipped once.

**Then snap the cuts to it.** `transcribe.py --snap cues.srt --times <every EDL in-point>`.
Every cut must land on a real cue boundary within 0.30s. On YT01 part 1 the answer was 33/33.

**Measured cost of skipping this:** element timings wrong by 0.6–3.0s, two rows modelled 2.65s
apart that were really 1.6s apart, and a rejected render. It reads as *"the timing feels way
off"* and no amount of motion polish fixes it.

---

## Rule 2 — Build the whole pass, then spot-fix

A human team avoids this because rework costs them three days. It costs Claude minutes, so the
economics invert and the human-team instinct does not transfer. Vu: *"It works with websites,
it can work here."*

**Default mode: build the entire pass, run it through the QC loop, bring back one package.**
No check-ins for taste, layout, timing, or approach.

**The only hard stops:**

- anything that spends credits or money — HeyGen renders, Magnific, paid Apify actors
- writing to `raw/` — never, under any circumstance
- anything published or sent outside
- a genuine fork where both paths are expensive and the preference isn't inferable

**The reciprocal obligation.** When Vu rejects something he says whether it is *taste* or
*craft*. Taste gets changed. **Craft becomes a rule and a check**, so it cannot recur — that is
how the line-height bug and the unmotivated-nudge rule got written.

---

## Rule 3 — The QC loop runs before Vu sees anything

Two layers, because they fail differently. Read `references/qc-gates.md` before running either.

**Deterministic gates — scripts, no judgment, run on every asset.** In
`/Volumes/X9 Pro 4TB/VIDEO/_shared/tools/`:

- `qc_layout.py <project-dir>` — on the HTML, before it renders. Catches LINEBOX, CLIP,
  OVERFLOW, SAFE, PALETTE.
- `qc_render.py <asset> [--pip] [--expect-dur N]` — on the rendered file. Catches EMPTY,
  STATIC, HOLD, FPS, SIZE, DUR, DUPE.

Both exit non-zero on failure. **A failing gate is not a finding to report — it is a fix to
make and re-run.**

**Judgment gates — two subagents, run after the deterministic gates pass.** Rubrics in
`references/reviewer-rubrics.md`; give each one the exact inputs listed there.

- **motion-gfx reviewer** — frame strip + motion-only MP4 + the spec.
- **video-editor reviewer** — the preview cut against real audio + the EDL row.

**Loop cap, so it cannot spin:** deterministic failures auto-fix and re-run without limit;
judgment findings get **at most two fix rounds**, then it ships with whatever is left flagged
in plain language, including anything Claude overrode and why.

---

## Rule 4 — Every element ships as an asset in Final Cut

Vu: *"I want to have all build files in FCP instead of never seeing and saving if we had used
FFmpeg in this pipeline."*

- **ffmpeg is for previews and QC only.** It never produces a deliverable.
- Every graphic, capture, still and b-roll clip is a **discrete media file** placed on the
  timeline via FCPXML (or SpliceKit, once wired). Vu sees each piece, keeps each piece, and can
  move or replace any of them without a re-render.
- Composites, burn-ins and flattened stacks are forbidden as deliverables. If two things need
  to sit on top of each other, they are two clips on two lanes.
- The preview cut against audio is still required for review — it is just never the product.

---

## Rule 5 — Storage: the SSD, from the first file

**Any project that will produce more than one video output lives on the external SSD from the
first file, never on the internal drive.** Structure and the migration record are in
`references/environment.md`.

```
/Volumes/X9 Pro 4TB/VIDEO/
  _shared/{tools,models}          QC scripts, whisper weights, brand assets
  <PROJECT>/raw                   masters + transcript — READ ONLY, never written
  <PROJECT>/assets/{graphics,captures,stills}
  <PROJECT>/output                previews, QC frames
  <PROJECT>/edl                   fcpxml, EDL doc, build scripts
  <PROJECT>/_work                 scratch, safe to delete
```

FCP libraries stay in `/Volumes/X9 Pro 4TB/FCP/`.

---

## Rule 6 — Claude takes the captures

Egress is fully open as of 2026-09-12 (verified: techcrunch, support.google, help.instagram,
elevenlabs, huggingface all 200 from the container). So screen captures are Claude's job, not
Vu's. Playwright + Chromium are already installed at `/opt/pw-browsers/chromium`.

- **Public pages** → Playwright in the container: exact 1920×1080 viewport, scripted scrolls
  recorded as video, highlight sweeps injected and timed to the transcript, cookie banners
  killed. Output lands straight in `assets/captures/`.
- **Logged-in pages** → Vu's browser. Only these need him.
- **Physical shots** → Vu. Mic, desk, hands.

Never put a public-page capture on Vu's to-do list again.

---

## Rule 7 — Verify every write to the Mac

**`device_commit_files` has twice reported `{"written":[...],"rejected":[]}` while writing
stale bytes.** Reusing a staged path appears to serve a cached earlier version; a fresh unique
staged path wrote correctly. Two real incidents, 2026-09-11 and 2026-09-12 — one shipped a
53-cue transcript as if it were the 145-cue one.

**So:** unique staged filename every time (append a timestamp), then `md5sum` on the device and
compare. A commit is not done until the checksum matches. This generalises — *reported success
is not verified success* — and it is the same failure class as Rule 1.

---

## Standing numbers

Frozen unless a measurement changes them. Re-verify anything marked with a date.

| | Value | Why |
|---|---|---|
| Frame rate | **25fps**, always | Footage is 25; a 30fps graphic judders. Deliberate deviation from the 30fps motion token. |
| Line-height on clipped text | **unitless, ≥1.34** | Archivo at 52px needs **57px** (ascent 46 + descent 11). `line-height:52px` clips descenders. Shipped three times before the gate existed. |
| Moving-frame floor | **15%** bare, **8%** PIP-backed | Under it, it reads as a slide. PIP-backed is lower because the composite frame is never still. |
| Hold ceiling | **4s** bare, **8s** PIP-backed | Longer is dead air. |
| Asset length ceiling | **~20s** | Longer becomes two assets with the presenter between them. |
| FULL (presenter full frame) | **≤20%** | The only state where the render gets studied. |
| PIP | **35–65%** | Raised from 15–25% on 2026-09-11: at ~25% width, lip-sync drift and dead-eye are invisible, so PIP costs nothing FULL costs. |
| VOICE-ONLY | **15–35%** | Lowered from 55–65% for the same reason. Reserve it for payoffs and verbatim quotes. |
| Longest continuous PIP run | **≤30s** | Past that the viewer has gone half a minute with no face at full frame. |
| Longest single FULL shot | **≤8s** | Unchanged. |

---

## Environment

Read `references/environment.md` for: the three separate machines and what each can do, the
SpliceKit MCP setup (FCP control, ~200 tools, needs SIP disabled), Pixel Film Studios via
Motion templates, what the Mac's Linux VM can and cannot do, and the folder grants that work
versus the ones macOS refuses.

---

## Handoff

End any substantive pass with: what was built, what the gates found and what was fixed, what
the reviewers flagged and what was overridden, files written and their checksums, what is left,
and anything learned that should become a rule.
