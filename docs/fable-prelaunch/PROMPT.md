# Fable brief: pre-launch design pass for chrcit.com

You are a design director reviewing a personal site that is close to launch. The visual direction is already chosen and implemented. Your job is **not** to redesign from scratch, invent a new brand, or swap the typeface. Your job is to look at the attached screenshots, understand the language, and tell me **what to change before launch** so the whole site feels resolved, consistent, and better than it is now.

Be specific. Rank by impact. Point at screenshots. Propose the smallest change that would actually fix the problem.

---

## 1. Project

**chrcit.com** is the personal site of Christian Cito (chrcit): product engineer first, creative second, strategist third. Vienna.

He is:

- Director, strategist and product engineer at **Arthouse** (madebyarthouse.com), a creative engineering studio
- Technical staff and board at **hausgemacht** (hausgemacht.org), a feminist techno collective in Vienna
- Co-organizer of **rebased.wtf**, an anti-corporate tech meetup

Those three sibling sites are all **dark**. This personal site is deliberately the **light** one in the family. It is not a studio site, not a résumé, and not a work showcase. Showing work is Arthouse's job. This site shows the person: what he does, what he writes, what he reads, what he uses.

**Commercial job of the site:** a router. After ~45 seconds a visitor should think "this guy does a lot of creative stuff," and the primary action is a click-through: book work at Arthouse, or contact him (the socials in the footer). The "what I do" accordion on the homepage is the router.

**Voice:** dry, matter-of-fact, English only. Humour lives in metadata, never as a tagline. No "passionate about," no marketing adjectives.

**Launch posture:** the system is built. Content is real. This is a last design pass, not an exploration.

---

## 2. Attached screenshots

Filenames match `docs/fable-prelaunch/screenshots/`. Desktop is 1440×900. Mobile is iPhone 14-ish (390×844). Images were attached in this numbered order. If the chat tool strips or renames files, reference them as **image 1** (`01`), **image 2** (`02`), … **image 20** (`20`).

Homepage book/tool rows are one build-time random sample. Desktop and mobile shots of `/` show the same three. Which titles appear is not a design choice; the live site can reshuffle.

**Homepage**

| # | File | What you are looking at |
| --- | --- | --- |
| 1 | `01-home-desktop.png` | Homepage, above the fold |
| 2 | `02-home-desktop-full.png` | Full homepage including books/tools, Elsewhere, footer |
| 3 | `03-home-desktop-role-hover.png` | Role row invert-on-hover (Arthouse) |
| 4 | `04-home-desktop-role-open.png` | Role accordion open: description + out-link, other roles hidden |
| 5 | `05-home-mobile.png` | Homepage mobile, above the fold |
| 6 | `06-home-mobile-full.png` | Full homepage on mobile |
| 7 | `07-home-mobile-role-open.png` | Role accordion open on mobile |

**Article (`/articles/2023-year-in-review`, currently the only post)**

| # | File | What you are looking at |
| --- | --- | --- |
| 8 | `08-article-desktop-hero.png` | Article first viewport: label, title, 16:9 hero |
| 9 | `09-article-desktop-reading.png` | Reading column (~68ch) + sticky "On this page" TOC |
| 10 | `10-article-desktop-embed.png` | Static tweet card + in-article screenshot, TOC still visible |
| 11 | `11-article-mobile-hero.png` | Article mobile: title, hero, opening paragraphs |
| 12 | `12-article-mobile-body.png` | Article mobile: first H2 |
| 13 | `13-article-mobile-embed.png` | Article mobile: tweet embed |

**Other surfaces in the same language (so you can judge the system, not one page)**

| # | File | What you are looking at |
| --- | --- | --- |
| 14 | `14-books-desktop.png` | `/books` cover grid with ratings |
| 15 | `15-books-mobile.png` | `/books` mobile |
| 16 | `16-uses-desktop-gear.png` | `/uses` gear group |
| 17 | `17-uses-desktop-stack.png` | `/uses` tech stack |
| 18 | `18-uses-mobile.png` | `/uses` mobile |
| 19 | `19-colophon-desktop.png` | Colophon (legal/meta page, same tile + prose) |
| 20 | `20-404-desktop.png` | 404 |

There is no writing index. `/articles` redirects home. The year-in-review is reached from the "Sometimes writer" accordion. There is no global nav beyond the `chrcit.com` wordmark.

---

## 3. Design language as implemented

Read this so you do not waste the critique on things that are already decided. Then look at whether the *execution* of this language is holding.

### 3.1 Name and thesis

Working name: **DITHER**. Light paper, 1-bit / riso / print energy, one sans, one accent, sharp tiles. The homepage is a dense mosaic hub (bento *structure*, not bento *aesthetic*). Texture is the one loud visual idea. Everything else stays quiet.

### 3.2 Color

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#f3f0e7` | Page background, tile fill |
| `--ink` | `#191611` | Type, 1.5px rules, invert fills |
| `--ink-soft` | `#615a4e` | Labels, meta, secondary type |
| `--accent` | `#b5341c` | Riso red. Links, plus signs, dates, "all books/tools", ratings-as-signal. Not decoration. |
| `--rule` | `1.5px solid ink` | Tile frames |
| `--hair` | `1px solid ink at 25%` | Internal row dividers |
| `--gap` | `10px` | Mosaic gap |
| `--tile-pad` | `18px` | Tile padding |

No dark mode. No gradients. Selection inverts to ink-on-paper. Hover on role rows and socials inverts the whole row to solid ink / paper type. Link hover goes accent → ink.

### 3.3 Type

**One family, site-wide: Inter Tight (variable, self-hosted).** No serif, no display face, no mono. Tabular energy comes from `font-variant-numeric: tabular-nums`, weight, size, tracking, and caps.

Root size is `17px`. Body weight is `450`. Body line-height is `1.4` on the page, `1.6` in `.prose`. Smoothing is antialiased.

| Role | Size | Weight | Tracking | Notes |
| --- | --- | --- | --- | --- |
| Topbar / footer / legal | 11.5–12px | 700 | 0.14–0.16em | Uppercase |
| Tile labels (`FAVORITE BOOKS`, `ELSEWHERE`, `YEAR IN REVIEW`, `ON THIS PAGE`) | 11.5px | 800 | 0.16–0.2em | Uppercase, ink-soft. Section labels on homepage go 13.5px / ink. |
| Category flags (`GEAR`, `PRODUCTIVITY`) | 10.5px | 800 | 0.16em | Uppercase |
| Lead sentence (homepage H1) | clamp 1.22–1.55rem | 500 | -0.02em | Line-height 1.35. The one "voice" line. |
| Role titles | ~1.08rem | 700 | -0.01em | |
| Item / post titles | ~0.98–1.16rem | 650–700 | -0.01em | |
| Page titles (`Some of my favourite books`, article H1) | clamp 1.45–1.85rem | 800 | -0.02em | |
| Group titles (`POLITICS, HISTORY, AND ECONOMICS`, `GEAR`) | clamp 1.35–2rem | 840 | -0.03em | Uppercase, line-height 1 |
| Article H2 | 1.35rem | 780 | -0.015em | Hairline rule above, padding-top |
| Article H3 | 1.1rem | 720 | -0.01em | |
| Prose body | 1.05rem | 450 | 0 | Measure ~68ch, line-height 1.6 |
| Meta / ratings | 0.78–0.85rem | 650–800 | tabular | |

Identity is supposed to come entirely from **scale contrast, weight contrast, and layout**, not from a second face.

### 3.4 Layout and geometry

- Page frame: max 1600px, 20/24px padding, min-height 100vh, footer pushed to the bottom.
- **Homepage mosaic:** 4 columns, 10px gaps, `grid-auto-flow: dense`, min row 96px. Portrait is 1 col; lead (intro + roles) is 3 cols; books and tools are 2+2. At 900px → 2 col. At 560px → 1 col.
- **Tiles:** sharp corners (radius 0), 1.5px ink border, paper fill. Internal structure is hairlines, not nested cards.
- **Subpages:** a vertical stack of the same tiles, not the mosaic.
- Article body is a 2-column grid: prose + 200–240px sticky TOC. TOC hides under 900px.
- Books: auto-fill cover grid, 2:3 frames, score badge ink-on-paper bottom-left of the cover.
- Uses: two-column item rows (icon, title, meta, `→`).
- Footer: full-width "Elsewhere" six-up social grid, then a tracked uppercase legal bar. Sticky to the bottom of short pages (404, colophon).

### 3.5 Texture and motion

Dither was the signature idea. In production it currently lives in three quiet places:

1. A 5% SVG film-grain overlay on `body::after` (`z-index: 50`, pointer-events none)
2. Ordered-dot fallback tiles for missing images (gear on `/uses`, occasional tools) with a letter and a paper text-stroke
3. Dot-fill hover on item rows (`.dot-hover`)

A dedicated dither art tile was cut during exploration. Hover invert on roles/socials is the main interaction: 1-bit, no easing theatre. Role accordion pins the open row to the top of the lead tile and fades the panel. Shuffle on books/tools is a 180° icon spin. Reduced motion is respected.

### 3.6 Interaction and chrome

- Topbar: `chrcit.com` wordmark left; `Vienna, AT` + live 24h time + Open-Meteo weather right. Tracked caps, ink-soft.
- No hamburger, no page nav, no breadcrumbs. Subpages go home via the wordmark.
- Books and tools on the homepage are a random sample of three, reshuffleable, with `All books →` / `All tools →`.
- External links use the accent and a `→`.
- Focus: 1.5px ink outline, 3px offset.

### 3.7 Content surfaces

| Route | Job |
| --- | --- |
| `/` | Person + router + taste samples + socials |
| `/articles/2023-year-in-review` | Long-form year-in-review with static tweet/YouTube/Instagram cards (no third-party scripts) |
| `/books` | Favourite books by genre, rated |
| `/uses` | Tools by group (Gear, Tech Stack, Dev Tools, Productivity) |
| `/colophon` `/imprint` `/privacy` | Meta / legal |
| `/404` | Not found |

Writing cadence in the brief is "monthly notes + one year-in-review." Only the 2023 review is on the site right now. That emptiness is a content fact, not a design accident you need to invent posts for.

---

## 4. Locked (do not relitigate)

1. Light paper. No dark mode as primary.
2. One sans: Inter Tight. No second family, no mono, no serif.
3. One accent: riso red `#b5341c`. Functional, not decorative.
4. Sharp tiles, ink rules, no rounded SaaS bento, no friendly gradients.
5. Not a work showcase. No project-led homepage, no case-study index.
6. Voice stays dry.
7. English only.
8. Stale-proof: no "currently listening / currently building" widgets. Dated posts are fine. The Vienna clock/weather is the one live metadata strip that was kept.
9. Stack is Astro + MDX. Do not propose a rebuild.
10. **Color icons, favicons, book covers, and embed media keep their source color.** They are content. Do not flatten them to ink, dither them, or treat brand color as a leak. The only image rule: sharp corners and a 1.5px ink frame on every image *container* (tiles, thumbs, embed cards, in-article photos). Avatars may stay round.

You may recommend **evolving** dither, type scale, spacing, hierarchy, chrome, article layout, and how writing appears. You may not recommend throwing the language out, and you may not relitigate item 10.

---

## 5. What I want from you

A pre-launch design critique that makes the site better **as this site**, not as a different site.

**A–H are lenses the critique must cover, not the shape of the deliverable.** Write the output in the section-6 shape. Fold A–H into that shape (especially ranked "Change before launch" and "Do not change"). Do not write eight separate essays labeled A–H.

### A. First 10 seconds
What does the homepage actually communicate? Does the 45-second test ("this guy does a lot of creative stuff") land, or does it read as a link-in-bio / uses page / quiet CV? What is the first thing you would change in the first viewport?

### B. Typographic language
Is Inter Tight doing enough work at these sizes and weights? Call out specific hierarchy failures: lead vs role titles vs group titles vs article H1 vs labels. Is the article actually set for reading (measure, leading, H2 rhythm, link color density)? Are the uppercase tracked labels earning their keep or repeating?

### C. Color and material
Is the paper/ink/red system holding across the site (chrome, type, frames — not content images)? Should dither be more present, or is quiet grain the right amount? Where does the 1-bit invert hover feel right, and where does it not?

### D. Homepage mosaic
Density, alignment, the portrait-to-lead ratio, the accordion, the books/tools pairing, the footer, and how writing shows up (or doesn't).

### E. Article
First viewport, title scale vs hero, TOC, embed cards vs the rest of the language, mobile vs desktop reading. How a second, shorter "notes" post would look in this template (there is no second post yet; design for that future).

### F. System consistency across pages
Books vs uses vs colophon vs 404. Titles, group headings, icon/image treatment, navigation between pages, footer behavior on short pages. Whether subpages still feel like the same site.

### G. Mobile
The mosaic collapses to a stack. Call out what is lost and what to do about it without faking a 4-column grid on a phone.

### H. What not to touch
Explicitly list what is already working and should be left alone. I need this so I do not "polish" the wrong things.

### Tensions I've noticed — confirm, refute, or reprioritize

These are observations, not a punch list. If they are not problems, say so. If something else matters more, rank that higher.

- Opening a role hides the others and leaves unused paper in the panel (`04`, `07`).
- The desktop article first viewport is mostly the 16:9 painting (`08`).
- `/uses` gear uses dither-letter fallbacks where no product photo exists; the tech stack uses full-color brand icons (`16`, `17`). Treat this as missing assets, not a color-policy question.
- Subpage titles sit in their own tile above the content (`14`, `16`, `19`, `20`).
- Writing is not on the homepage mosaic; it is only reachable from "Sometimes writer" (`02`, `06`).
- The books/tools label says "Favorite" and the control is a shuffle (`01`, `02`, `06`).

---

## 6. Output format

Write for a designer-engineer who will implement this in CSS/Astro next. No mockups required unless a layout change is hard to describe in words; if you do sketch, keep it structural (ASCII or a short layout description).

Use this shape:

1. **Verdict** (one paragraph). Is this close, or is something structural still wrong?
2. **Do not change** (bullet list).
3. **Change before launch**, ranked P1 / P2 / P3.
   - Each item: *what's wrong*, *where* (screenshot filename + region, or image N + region if filenames are gone), *why it hurts the language or the job of the site*, *the concrete fix* (tokens, type scale, layout rule, component behavior). One item, one fix. No "consider exploring."
4. **Type scale proposal** if you would retune it: a small table of role → size/weight/tracking. Only if the current scale is part of the problem.
5. **Icon / image policy** only if a container-geometry issue remains. Color-as-content is locked (section 4, item 10).
6. **Article template** notes for both the existing year-in-review and a future shorter notes post.
7. **Out of scope for launch** (good ideas that should wait).

Tone: direct, specific, no moodboard language, no "make it pop," no new font recommendations unless Inter Tight is actually failing a real reading or identity job and you can prove it from the screenshots.

If you find yourself wanting to add a second typeface, a dark mode, a hero rewrite, or a project grid, stop. Those are rejected directions. Push on hierarchy, rhythm, consistency, and the article as a reading environment instead.
