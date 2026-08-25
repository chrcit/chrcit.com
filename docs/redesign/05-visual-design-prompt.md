# Prompt for visual design agent (Kimi K3)

> Copy everything below the line into the agent. It is written to work standalone, but if the agent has repo access it should also read `docs/redesign/00`–`04` and `assets/ref-bento-grid.png` for full context.

---

You are doing the visual design exploration for **chrcit.com**, the personal site of Christian Cito (chrcit) — product engineer first, creative second, strategist third. Vienna. Director at Arthouse (madebyarthouse.com, creative engineering studio), software/systems at hausgemacht.org (feminist techno collective), co-organizer of rebased.wtf (anti-corporate tech meetup). His site is the fourth sibling of those three — related by voice and craft, but deliberately the one **light** site among three dark ones.

If you have access to the repo, read `docs/redesign/00-instructions.md` through `04-open-questions.md` first — they are the source of truth. The brief below is the condensed version.

## The direction (locked, do not relitigate) — working name: DITHER

A light, paper-textured, editorial site. The homepage works like a dense hub — think bento-grid *structure* (mixed-tile density, link-hub function; reference: `docs/redesign/assets/ref-bento-grid.png`) but with the pastel/rounded SaaS aesthetic completely stripped out and replaced by a print/riso/1-bit sensibility.

**Hard constraints:**

1. **Light background.** No dark mode as primary. No friendly gradients, anywhere, ever.
2. **Dithering is the signature visual.** Use dither patterns (ordered/Bayer, halftone, or error-diffusion style) and/or film grain as key background and image treatments — "here and there," not wall-to-wall. Dithered images, dithered section textures, dithered dividers are all fair game. This is the one strong visual idea; everything else stays quiet.
3. **Exactly one free sans-serif family for the entire site** (Google Fonts / Fontsource). No display face, no serif, no second family. Mono is NOT allowed as a second family — if you want tabular/label energy, get it from the sans (weight, size, tracking, caps). Choose a family with a wide weight range and real character at large sizes, and defend the choice in one sentence. All typographic identity comes from scale contrast, weight contrast, and layout.
4. **Voice: dry and matter-of-fact.** Humour only in small details/metadata. English only. No taglines like "passionate about clean code," no marketing adjectives.
5. **Not a work showcase.** No projects-led structure, no case studies. Showing work is Arthouse's job. This site shows the *person*: what he does, what he writes, what he reads and uses.
6. **The commercial job is a router.** The most important interactive element is the "what I do" section whose links click through to: book work at Arthouse, or contact him personally (LinkedIn, X, email). This must be prominent without being a CTA-shaped sales block.
7. **Desired impression after 45 seconds:** "Oh wow, this guy does a lot of creative stuff." The label says engineer; the screen shows creative range. Show, don't claim.
8. **Stale-proof.** Nothing on the page may look wrong after six months of neglect. No "currently building/listening" widgets. Dated content (posts) is fine.

**What must NOT happen:** generic dev portfolio (hero + skills + cards + contact form), a clone of madebyarthouse.com, dark moody glow (that direction was explicitly rejected), pastel bento SaaS, effects standing in for content, more than one font family.

## Content the homepage must accommodate

- Name + one dry line about who he is.
- "What I do" section with the click-through links (Arthouse, LinkedIn, X, email).
- Latest writing: monthly newsletter-style posts + one year-in-review per year, hosted on-site.
- Taste items: books and tools/uses (later: films, albums/artists/songs). These use **one generic item card design** with a category flag — same card anatomy, adapts per category (book has author/rating/cover, tool has link/why, etc.). Items appear only where manually placed, never autoloaded.
- Social links: GitHub, Instagram, LinkedIn, X, Twitch, YouTube (all @chrcit).

## Deliverables

Build **3 distinct homepage concepts** as fully self-contained HTML+CSS files (system-capable static prototypes, no build step, font loaded from Google Fonts CDN, dither textures generated via SVG/CSS/canvas or embedded data-URIs — no external image dependencies):

- `docs/redesign/explorations/concept-a.html`
- `docs/redesign/explorations/concept-b.html`
- `docs/redesign/explorations/concept-c.html`

Each concept must use realistic content (his real name, real roles, plausible post titles, 2–3 real books from his archive — e.g. Antifragile, Capitalist Realism, The Mind Illuminated — and real tools), the full item-card design in at least two categories (book + tool), and be responsive (mobile + desktop). The three concepts must be *genuinely different layouts/interpretations* of DITHER — e.g. different grid philosophies, different dither applications, different densities — not three color tweaks of one layout.

Also write `docs/redesign/explorations/README.md`: for each concept, 3–4 sentences on the idea, the chosen font and why, where the dither lives, and the concept's biggest risk. End with your own ranked recommendation and one sentence why.

Do not touch any other files in the repo. Do not start implementing the real site — this is exploration; Christian picks the winner first.
