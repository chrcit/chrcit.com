# Redesign docs — how to use this folder

Working docs for the chrcit.com redesign (essence, vibe, direction). Any agent or human picking this up should read the files in order.

## Files

| File | Purpose |
| --- | --- |
| `00-instructions.md` | This file. Process + status. |
| `01-current-state.md` | Facts: what exists today (legacy Astro site + WIP Remix rewrite). |
| `02-reference-sites.md` | Analysis of the three sibling-project sites whose vibe should inform this one. |
| `03-essence-and-vibe.md` | Synthesized essence/vibe directions (drafted with Opus subagent). Living doc — update as decisions land. |
| `04-open-questions.md` | Questions for Christian + his answers. Record answers inline, then fold decisions back into `03`. |
| `05-visual-design-prompt.md` | Handoff prompt for the visual design agent (Kimi K3). Produces 3 homepage concepts in `explorations/`. |
| `06-implementation-prompt.md` | Handoff prompt for the implementation agent. Ports the selected concept (C) to the real Astro site. |
| `assets/` | Reference images (bento grid structure ref). |

Related: `docs/fable-prelaunch/` is a separate pack (prompt for a pre-launch design critique in Fable). Not part of this exploration sequence.

## Process

1. Gather context (done — see `01` and `02`).
2. Draft essence/vibe hypotheses + questions (done — see `03` and `04`).
3. Christian answers questions → update `04` with answers.
4. Fold answers into `03` as decisions, mark direction as chosen.
5. Only then move to visual/design exploration and implementation.

## Constraints

- Owner: Christian Cito (chrcit), interdisciplinary product engineer, strategist, creative. Vienna.
- The site should rhyme with madebyarthouse.com, hausgemacht.org, rebased.wtf — same family, unique voice.
- Keep output minimal. No implementation until essence/vibe is agreed.

## Status

- 2026-08-25: Folder created. Context gathered, directions drafted, questions open — waiting on Christian's answers.
- 2026-08-25 (later): Round-1 answers in. **Direction decided: DITHER** (light, dithered/grainy, dry voice, writing pulse, archives as connection layer, no work showcase, music player cut) — see top of `03-essence-and-vibe.md`. Round-2 detail questions open in `04`.
- 2026-08-25 (round 2): All blocking questions answered. Brief is complete in `03` (section 0): router-style link hub (bento structure ref in `assets/`, not its aesthetic), posts on-site, English only, generic referenced item schema (books + tools first), one free sans-serif, no non-negotiables.
- 2026-08-25 (round 3): Stack decided — **Astro + MDX**, no CMS; item references as MDX components. React Router WIP (`app/`) retired as stack, salvage content/pipelines. Visual handoff prompt written: `05-visual-design-prompt.md`.
- 2026-08-25 (exploration): 3 concepts built in `explorations/` (A Ledger, B Broadsheet, C Mosaic). **Christian picked C**; two feedback rounds applied (grouped Books/Tools tiles, merged lead tile with accordion router, real cover/icon images, art tile + struck copy removed, sticky minimal footer). Implementation handoff prompt written: `06-implementation-prompt.md`.
- 2026-08-27 (implementation): Concept C is the repo. Homepage mosaic (portrait, lead tile with roles accordion, shuffleable Books/Tools tiles, dithered weather field), plus books, uses, articles, projects, colophon and 404 pages. Social embeds are captured statically into `src/data/embeds.json`. `app/` (React Router) and `astro-legacy/` were removed. Pre-launch critique pack for Fable lives in `docs/fable-prelaunch/` (captures removed after the audit).
