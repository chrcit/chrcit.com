# Essence & vibe

> **Status: DIRECTION DECIDED (2026-08-25).** Sections 1-5 below are the original draft hypotheses, kept for reference. The decision, from Christian's round-1 answers in `04-open-questions.md`, is here at the top. Remaining open details are listed in `04`.

## 0. Decision — working name: **DITHER**

A hybrid of THE INDEX and OFF-DUTY, on a light surface. THE CONSOLE is dead (music player cut, dark/glow direction is exactly what he disliked about the WIP rewrite).

**Locked:**

- **Light site, visually contrarian to the three dark siblings.** No friendly gradients. The signature texture is **dithering** (and/or grain) used as key background visuals here and there — print/riso/1-bit energy on paper, not soft-glow on black.
- **Voice: dry and matter-of-fact.** Humour lives in details and metadata, never on the surface. "Taste, pressure, and clarity" is retired as copy — he can't defend "pressure."
- **Identity order: product engineer → creative → strategist** (descriptive, not aspirational).
- **Not a work showcase.** Explicit: showcasing work is madebyarthouse.com's job. The personal site sells the person through voice, judgment, and consistency, and points at Arthouse for work. No projects-led structure.
- **Writing is the pulse:** monthly newsletter/Substack-type post + one year-in-review per year. Built as a scheduled cadence, not essays-whenever.
- **Taste archives are a connection layer,** not the headline: a personal archive and a connection point for people who like the same books, tools, etc. ("Tools" implies a uses page belongs in the set.)
- **Cut: the persistent music player.**
- **Audience: potential clients/Arthouse leads AND peers** whose respect he wants — served by the same thing: a site that is obviously well-made and well-edited without performing.

**Failure modes he named:** most dev pages are "too simple or too visual." DITHER threads that needle: editorially rich (index + archive + writing) but visually restrained with one strong textural idea.

### Round-2 additions (2026-08-25)

- **Job of the site: a router.** The desired action is a click-through — book work at Arthouse, or contact him personally (LinkedIn, X, email), ideally from the "what I do" section. Structural reference: `assets/ref-bento-grid.png` (bento.me-style link hub). **Structure only** — the pastel/rounded SaaS aesthetic in that image is the opposite of DITHER's texture rules. Think: bento's mixed-tile density, rendered in paper + dither + one sans.
- **Desired impression (45-second test):** "Oh wow, this guy does a lot of creative stuff." Combined with "product engineer first," this means: the *label* is engineer, the *evidence on screen* is creative range. Show, don't claim.
- **Writing lives on the site.** Monthly newsletter-type posts are on-site pages (email distribution is secondary plumbing, TBD).
- **English only.**
- **Content system (architecture requirement):** one generic **item** schema with a category flag — book, film, album/artist/song, tool, extensible. One consistent card design that adapts per category. Items appear on authored pages only by **explicit reference inside portable text** — never autoloaded. Content-wise, books and tools/uses survive from the old site; other categories can be added through the same system over time.
- **Type: exactly one free sans-serif family, site-wide.** All identity work comes from layout, dither/grain texture, and scale/weight contrast within that single family.
- **No non-negotiables from the WIP build** ("just do it"). Music player already cut; nothing else is protected.

### Stack decision (2026-08-25, round 3)

- **Astro + MDX.** No Sanity/CMS. "Portable text" meant rich content with explicit references, implemented as MDX components (e.g. `<Item ref="books/antifragile" />`) over the generic item schema. The legacy `astro-legacy/` codebase is the closer starting point; the React Router WIP (`app/`) is retired as a stack — salvage content and data pipelines only.
- Confirmed reading of the identity tension: the label is engineer, the evidence on screen is creative range — show, don't claim.

### What this resolves to

A light, paper-textured, one-font site whose homepage works like a dense editorial hub: who he is, what he does (with the click-through links doing the commercial job), the latest writing, and referenced taste items — all in one consistent card/tile system with dithering as the signature visual. Stale-proof by design: nothing autoloads, nothing claims "now."

## 1. Essence hypothesis

**The claim:** Christian's differentiator is not a craft, it's *judgment applied across crafts under constraint*. Everything in the evidence points at a person who is hired — and useful — for knowing what should exist and what should be cut, then being able to build it himself.

Supporting evidence:

- **Three roles, three registers.** Director at Arthouse (strategy, client-facing, professional), software/systems at hausgemacht (infrastructure for a feminist techno collective — values-driven, unpaid-adjacent, community), chief vibe officer at rebased (social, funny, organizing). Very few people hold the serious pole and the rave pole at the same time. That range *is* the identity; a site that only shows one is a lie by omission.
- **His own words.** "Taste, pressure, and clarity" — note that all three are *dispositions*, not skills. No mention of a stack. "Calm systems, bold visuals, direct writing" is a self-authored design brief already: quiet structure, loud moments, no filler.
- **The taste archives.** Books with ratings, films, music, games, quotes. Maintained across two site generations and backed by real data pipelines — this is not a widget he added once. The archives are the *evidence base* for the judgment claim: "here is a decade of what I've paid attention to, and what I thought of it." That's a portfolio of taste, sitting next to a portfolio of work.
- **10+ years, still rewriting.** Two full site generations, a third in progress. Restless, self-directed, unwilling to ship something that doesn't feel right.

**Therefore:** the job of the site is to make taste and judgment *legible and checkable*, not to list services or skills. The work proves he can build; the archive proves he knows what's worth building; the writing proves he can think. The site should let a visitor triangulate all three in under a minute.

**Tension to resolve (see `04`):** the interdisciplinary claim is also the risk. "Engineer + strategist + creative" reads as *unfocused* unless the site makes the combination feel inevitable rather than indecisive. The fix is not to say "interdisciplinary" — it's to show three kinds of output on one surface and let the reader draw the conclusion.

---

## 2. Vibe directions

Three distinct positions. They differ in **what the homepage is made of** and **which of Christian's three registers leads** — not just in styling. Each is viable; they are not rankable without his answers.

### Direction A — **THE INDEX**

*Taste as evidence. The site is one archive, not a brochure.*

**Feel.** Everything Christian has made, read, watched, played, and written is one uniform corpus of entries: dated, tagged, rated, cross-linked, browsable. Projects sit in the same system as books. There is no "about" section doing identity work — identity is the emergent shape of ten years of entries, and the reader assembles it themselves. The homepage is a dense, scannable surface (a table, an index, a stream), not a hero. It rewards a curious visitor with depth and gives a hurried one a fast read of the person. It should feel like walking into someone's actual library and being allowed to read the marginalia.

**Relative to the references.** Borrows Arthouse's editorial systems thinking (numbered sections, indexes, lists over marketing layouts) and rebased's willingness to make structure itself the aesthetic. Refuses Arthouse's studio front-door — no service ladder, no positioning statement above the fold. Refuses hausgemacht's emotional maximalism entirely: the warmth here comes from the *content* of the entries, not from the surface.

**Tone of voice.** Annotated, terse, first person. Short verdicts rather than reviews. Metadata is allowed to be funny. The writing is dense and unhedged; the reader is trusted to keep up. Zero throat-clearing.

**Aesthetic implications.** Type energy: quiet and functional, weighted toward mono/tabular for structure, with one display gesture used sparingly (masthead, section marks) so the page reads as *edited* rather than *rendered*. Could work light or dark; light would deliberately break the family's dark convention and lean paper/reference-book. Accent strategy: one signal color, used strictly functionally — active state, rating, link — never as decoration. The restraint is the flex.

**Risk.** Reads as a cold data project. Needs the writing voice to carry the human weight, and needs the work to not get buried under the taste archive.

---

### Direction B — **THE CONSOLE**

*Calm systems, bold visuals. One loud thing at a time.*

**Feel.** A composed, instrumented surface — the person as a running system with a status readout. Present tense: what he's building now, reading now, listening to now, thinking about now. Mostly still and dark and quiet, with a small number of high-energy moments that hit hard because everything around them is disciplined. Motion is used as signal (something changed, something is live), never as ornament. It should feel less like a portfolio and more like being given access to a well-kept operating system — the same feeling as a very good dashboard or a well-organized studio: nothing wasted, everything under control, one thing glowing.

**Relative to the references.** Borrows hausgemacht's energy and glow but strips the chaos and keeps the discipline; borrows Arthouse's restraint and warm-dark composure but adds a pulse it deliberately doesn't have. Refuses rebased's jokes-on-the-surface — the humor here is dry and lives in the copy, not the layout. Closest of the three to the current WIP rewrite, but with a correction: the WIP drifted into "producer/DJ portfolio" because everything glows at once. This direction only works if the glow is rationed.

**Tone of voice.** Present tense, declarative, log-like. Short lines. States facts about now rather than claims about capability. Confident without volume — the register of someone who doesn't need to convince you.

**Aesthetic implications.** Type energy: a strong display face for a small number of large statements, mono for telemetry and metadata, quiet body type in between; the contrast between huge and tiny does the work. Dark base, non-negotiable. Accent strategy: a single high-energy accent treated as a *light source* — emitted by one live element at a time, not distributed across the page.

**Risk.** Slides into moody-portfolio cliché the moment discipline slips. Requires ruthless editing of effects; also requires genuinely live content, or the "now" framing goes stale and reads as abandoned.

---

### Direction C — **OFF-DUTY**

*The third voice. The one place he doesn't have to represent anyone else.*

**Feel.** Arthouse is his professional voice. hausgemacht is his values voice. rebased is his social voice. All three are collective — he shares them. The personal site is the only surface where he speaks for himself alone, so this direction makes that the whole point: writing and opinion lead, work is an appendix. Essays, takes, notes, verdicts, arguments. Personality unfiltered by a client or a collective. It should feel like someone's own room rather than a shopfront — the pleasure of reading someone smart who is not currently selling you anything. Funny where it wants to be, serious where it counts, occasionally wrong in public.

**Relative to the references.** Borrows rebased's irreverence and hausgemacht's intimacy and directness of address. Refuses Arthouse's professional register outright — Arthouse already does that job, and duplicating it makes the personal site redundant. Also refuses rebased's brutalist costume: the wildness is in the *sentences*, and the page around them stays composed enough to read comfortably at length.

**Tone of voice.** First person, argumentative, specific, funny. Named opinions with a position taken. Occasional profanity is fine. Long-form allowed; the site is built for reading, not scanning.

**Aesthetic implications.** Type energy: editorial, near-book, generous measure and rhythm, with strong contrast between a loud voice and a calm frame. The strongest candidate for going **light** — a bright, high-contrast, print-adjacent surface would be the sharpest possible differentiation from three dark sibling sites, while still reading as family through voice, structure, and accent discipline. Accent strategy: one strong accent used editorially — pull quotes, marks, emphasis — treated like a second ink rather than a UI color.

**Risk.** Only works if he actually writes, consistently. A writing-led site with four posts is worse than no writing at all. Also: weakest at the job of "get hired," if that's a job the site needs to do.

---

## 3. Hybrids worth noting

- **A + B** (archive with a live layer): the corpus as the substance, a "now" strip as the front door. Probably the highest-fidelity match to the evidence — it covers both the systems-builder and the taste-curator — and the lowest risk of any single direction's failure mode.
- **C + A** (writing spine, archive as footnotes): the verdicts in the archive become the seeds of the essays. Strong identity, highest ongoing maintenance cost.
- **B + C** is the most likely to feel incoherent: present-tense instrumentation and long-form argument want opposite reading modes.

---

## 4. What the site must NOT be

- **A generic dev portfolio.** No hero + skills grid + project cards + contact form. No tech-logo wall. No "I'm passionate about clean code."
- **A clone of Arthouse.** Same family, not same costume. If it reads as Arthouse-with-different-copy, it's a downgrade for both — and it makes his personal identity look like a subset of the studio's.
- **A costume of any single reference.** Not hausgemacht-in-English, not rebased-with-a-CV.
- **Maximalist by default.** "Bold visuals" in his own words is paired with "calm systems." Everything loud at once is the WIP rewrite's failure mode and the thing to correct.
- **A résumé.** LinkedIn exists. The site should make a résumé feel unnecessary, not replicate one.
- **Effects as personality.** Particles, glows, and animated backgrounds standing in for having something to say. Any effect has to be earned by carrying meaning.
- **Stale.** Whichever direction wins, it must survive six months of neglect without looking abandoned. Present-tense framing raises this bar; archive framing lowers it.

---

## 5. Open before this doc can become decisions

The three directions split cleanly along the questions in `04`: **who the site is for** (clients vs. peers vs. himself), **whether he will write regularly**, and **whether the taste archive is the point or a side dish**. Those three answers pick the direction almost mechanically. See `04-open-questions.md`.
