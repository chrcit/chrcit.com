# Prompt for implementation agent — make Concept C the look of the site

> Copy everything below the line into the agent. It is written to work standalone, but the agent should have repo access — the design source of truth is a file in the repo, not a description in this prompt.

---

You are implementing the chrcit.com redesign. The exploration phase is done and the direction is locked. Your job is to take the selected prototype and make it the real site.

## Read first (in order)

1. `docs/redesign/explorations/concept-c.html` — **the visual source of truth.** This is the selected, twice-revised homepage prototype (working name: DITHER, concept "Mosaic"). Match it. Do not redesign, do not "improve" — port it.
2. `docs/redesign/explorations/README.md` — revision notes at the end of the Concept C section record every piece of feedback Christian gave and what was applied. Treat those notes as binding.
3. `docs/redesign/03-essence-and-vibe.md`, section 0 — the locked brief (voice, constraints, content system).
4. `docs/redesign/01-current-state.md` — what exists: `astro-legacy/` (Astro + Tailwind, the previously shipped site, closer starting point) and `app/` (React Router WIP, retired as a stack — salvage content and data pipelines only, e.g. `scripts/` for films/games/music).

## Stack (decided, do not relitigate)

Astro + MDX, no CMS. Content collections for posts and items. Item references in authored content as MDX components (e.g. `<Item ref="books/antifragile" />`) over one generic item schema with a category flag (book, tool; later film, album/artist/song). Items render only where explicitly referenced — never autoloaded.

## The look (port from `concept-c.html`)

- **Light paper** (`#f3f0e7`), ink (`#191611`), one functional accent (riso red `#b5341c`). No dark mode. No soft gradients anywhere — texture comes from stepped dither dot/checker patterns and a 5% film-grain SVG layer over the page.
- **One font: Inter Tight** (100–900), site-wide. All identity from scale/weight/tracking contrast. No mono, no second family — tabular energy via `font-variant-numeric: tabular-nums` and tracked uppercase labels.
- **Homepage = 4-column bento mosaic** of bordered tiles (`1.5px` ink rules, sharp corners, 10px gaps): lead tile (name once + "What I do"), writing tile, one grouped Books tile, one grouped Tools tile (three compact item rows each, labeled "random sample" — build-time random or authored picks, never autoloaded at runtime), full-width Elsewhere strip with the six socials (GitHub, Instagram, LinkedIn, X, Twitch, YouTube — all @chrcit).
- **"What I do" is an accordion**: each entry is a `<details>` element expanding to one short description plus the out-link. Entries: Director at Arthouse (→ madebyarthouse.com, this is where work gets booked), Software & systems at hausgemacht, Co-organizer of rebased.wtf, Sometimes writer (→ writing index). No email/LinkedIn/X in the router.
- **Item rows**: 40px thumb (real image — book cover, app icon — with the dither-initial tile as loading fallback), title, one meta line, category slot on the right (rating `9/10` for books, `→` out-link for tools). Covers/icons are **local assets** on the item entries, not hotlinked (the prototype's Open Library/favicon URLs were placeholder plumbing).
- **Sticky-bottom footer**, copyright line only. Top bar: `chrcit.com` left, `Vienna, AT` right.
- Dither lives in: hover dot-fills on rows, image fallbacks, grain layer. (Christian cut the dedicated dither art tile — if he asks for more dither later, the lead tile is where it goes.)
- Responsive: 4-col → 2-col at 900px → 1-col at 560px, matching the prototype's breakpoints and behavior.

## Voice and content rules (locked)

- Dry, matter-of-fact, English only. Humour only in metadata. No marketing adjectives, no "passionate about."
- Not a work showcase — no projects section, no case studies. Work is Arthouse's job.
- Stale-proof: nothing autoloads, no "currently" widgets. Dated posts are fine.
- Writing: monthly "Notes № N" posts + one year-in-review per year, hosted on-site as MDX.

## Scope

1. Homepage exactly per the prototype, with real content: migrate the ~29 book entries from `astro-legacy/src/content/books/` into the new item collection (keep ratings), migrate the uses/tools content, seed the writing collection.
2. The generic item schema + card/row component (the prototype's row anatomy is the homepage variant; archive pages can use the roomier card variant from `concept-a.html`/`concept-b.html` if useful — same anatomy).
3. Archive pages in the same visual language: writing index + post pages, books index, tools/uses index.
4. Social links, imprint/privacy carried over from legacy.

## Do not

- Don't change the design tokens, tile geometry, or interactions without flagging it — the prototype went through two rounds of Christian's feedback and every element that remains is deliberate.
- Don't add a second font, dark mode, gradients, or a contact form.
- Don't build a CMS, a music player, or anything autoloading.
