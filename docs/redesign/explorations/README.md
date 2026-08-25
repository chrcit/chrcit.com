# DITHER — homepage explorations

Three self-contained HTML+CSS concepts for the chrcit.com homepage. Open any file directly in a browser; fonts load from Google Fonts, all dither textures are generated in-file (CSS dot/checker patterns, one SVG-noise grain layer). No external images, no build step.

Shared system across all three: paper `#f4f1e9`-ish base, ink near-black, one functional accent (riso red `#b5341c`, used for flags/numbers/links only), and **one generic item card** (`flag row → dither thumb → title → meta → note → category-specific slot`: rating bar for books, visit-link for tools) that each concept renders in its own geometry. That card anatomy is the portable piece — it maps directly onto the planned `<Item ref="…" />` MDX component.

---

## Concept A — Ledger (`concept-a.html`)

**Idea.** The whole page is one ruled index: numbered sections (01–05, a quiet rhyme with Arthouse's numbered services), every entry a row in a ledger — roles, posts, books, tools, socials all share the same row grammar. Density comes from the list, not from boxes; it reads as an edited document, not a dashboard. The router ("What I do") is simply the first and most-linked section, prominent by position rather than by CTA styling.

**Font.** Archivo (variable, width 62–125, weight 100–900) — the expanded black weights give the masthead real display punch while the text weights stay ledger-quiet, so one family covers both masthead and table work without a second face.

**Where the dither lives.** Two stepped dither bands frame the page (solid ink dissolving into paper at the top, reversing at the footer), book/tool thumbnails are dither-density tiles with an initial letter, ratings render as checkerboard-dither bars, and link rows get a faint dot fill on hover.

**Biggest risk.** Restraint tipping into plainness — if the dither moments don't land, it's "just a list." It also leans hardest on the writing actually existing, since the writing section carries a full column of visual weight.

## Concept B — Broadsheet (`concept-b.html`)

**Idea.** A newspaper front page: justified full-width masthead, dateline rules, a 7/5 lead-story split ("What I do" as the lead, writing as the side column), a pull-quote line doing the "show, don't claim" job in one sentence, and boxed plates for the shelf/uses cards. The signature move is the divider that dissolves from solid rule into dither and back — the riso fade, used three times total. Lowest density of the three; most editorial air.

**Font.** Bricolage Grotesque (optical sizes, 200–800) — it has genuine, slightly awkward print character at poster sizes (where most grotesques go bland) while staying readable at caption size, which a front-page format depends on.

**Where the dither lives.** The dissolving dividers, the masthead stamp tile, and the card thumb plates (each item gets its own density). Nothing else — the rest is rules and whitespace.

**Biggest risk.** The newspaper metaphor is the strongest costume of the three — it could read as pastiche rather than voice, and the large-scale masthead is the hardest element to keep looking right across viewport sizes.

## Concept C — Mosaic (`concept-c.html`) — **selected, revised per Christian's feedback (2026-08-25)**

**Idea.** The closest read of the bento reference: a dense 4-column mosaic of mixed-size tiles — name tile, a pure dither art tile ("Fig. 1 — dither," the one loud thing), the router as a tall tile of full-width link rows, writing, one grouped "Books" tile and one grouped "Tools" tile (three compact item rows each, labeled "random sample" — authored or build-time-random picks from the archive, never autoloaded), and a full-width socials strip. Every link row inverts to solid ink on hover, which gives the 1-bit energy without any animation. This is the highest-density interpretation and the fastest path to the 45-second "does a lot of creative stuff" impression.

**Font.** Inter Tight (100–900) — in the densest concept the type has to disappear and let density and texture lead, and Inter Tight is the neutral workhorse with the full weight range to still carry a 4rem uppercase name tile.

**Where the dither lives.** Everywhere but rationed by tile: the art tile is a full vertical dither fade, item-row thumbs are small dither tiles, writing and item rows get dot-fill hover, and a 5% film-grain layer sits over the whole page (the only concept that uses grain).

**Biggest risk.** Bento is a loaded format — even in ink-on-paper it can drift back toward the SaaS link-hub aesthetic the brief warns against, and at small viewports the mosaic collapses to a plain stack, losing its main idea on mobile.

**Revision notes (2026-08-25).** Christian picked C. Round 1: books and tools are no longer one bento tile per item — each category is a single tile listing three items as compact rows (same item anatomy: thumb, title, meta, category slot = rating for books, out-link for tools); the metadata tile was removed. Round 2: the name tile and the router merged into one lead tile (name appears once, lede struck); "What I do" entries are now `<details>` accordions that expand to one short description plus the out-link — email/LinkedIn/X were dropped from the router in favor of a fourth role, "Sometimes writer"; the dither art tile was cut; item thumbs are real images now (book covers via Open Library, tool icons via favicon fetch — production should use local assets on the item entries), with the dither-initial tile kept only as a no-JS loading fallback; footer is sticky-bottom and reduced to the copyright line; struck copy removed ("One font, two inks, some dots", "Set in Inter Tight…"). Note: with the art tile and thumb dithers gone, dither now lives only in hover fills, image fallbacks, and the grain layer — if the result reads too plain, the first thing to restore is a dither element in the lead tile.

---

## Recommendation

~~A (Ledger) → C (Mosaic) → B (Broadsheet).~~ **Superseded: Christian picked C (Mosaic) on 2026-08-25.** A and B remain in this folder as reference; C is the basis for implementation.

My original ranking had A first because the ledger grammar is the most durable — it treats roles, posts, books, tools, and links as one uniform entry system, which is exactly the generic item schema the architecture wants. C won on the strength of the 45-second impression: no other concept shows creative range as fast.
