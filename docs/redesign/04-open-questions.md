# Open questions for Christian

> Answer inline under each `A:`. Partial answers are fine — say "don't know" where you don't. Once filled in, decisions get folded back into `03-essence-and-vibe.md` and the direction gets picked. Terse answers preferred; a forced choice with one clause of reasoning beats a paragraph.

> **Round 1 answered 2026-08-25** (Q2, 3, 5, 6, 9, 10, 11, 14, 15, 16, 17). **Round 2 answered 2026-08-25** (Q1, 7, 8, 13, 15 follow-up, 20, 21). Decision + full brief recorded in `03-essence-and-vibe.md`. Remaining blanks (Q4, 12, 18, 19) are low-stakes or answered implicitly; not blocking design work.

## Identity & essence

**1.** If someone who's never met you spends 45 seconds on the site and then describes you to a friend, what's the one sentence you want them to say? (Not a tagline — the sentence a stranger would actually use.)

A: "Oh wow, this guy does a lot of creative stuff." — Note the tension with Q2 (product engineer first): the *impression* should be creative range, the *label* is product engineer. The site should show range, not claim it. (2026-08-25, round 2)

**2.** "Interdisciplinary product engineer, strategist and creative" — rank those three by what you actually want to be hired and known for, and say whether the order is aspirational or descriptive of today.

A: Current order is descriptive. Wants to appear as: product engineer, then creative, then strategist. (2026-08-25)

**3.** You wrote "taste, pressure, and clarity." Which of the three is the one you'd defend hardest as *the* thing you bring — and what does "pressure" mean to you specifically? (It's the least legible word to an outsider and possibly the most interesting.)

A: "No idea" on pressure. → Treat the phrase as WIP copy, not identity. Don't build on it. (2026-08-25)

**4.** The three roles — Arthouse (professional), hausgemacht (values/systems), rebased (social/vibe) — how visible should each be on the personal site? Fork: **(a)** all three equally, the range is the point; **(b)** Arthouse leads, the others are colour; **(c)** deliberately none of them lead — the site is you *outside* the collectives.

A:

**5.** Is the personal site the fourth sibling in the family, or the odd one out? Fork: **(a)** clearly recognisable as the same universe; **(b)** related by voice and craft but visually contrarian — e.g. the one light site among three dark ones.

A: (b). Light site. But NOT friendly gradients — something creative, with dithering as a key background visual here and there, or grain. (2026-08-25)

## Audience & job of the site

**6.** Who is the primary visitor you'd be annoyed to lose? Pick one: **(a)** a potential client or Arthouse lead; **(b)** a peer/designer/engineer whose respect you want; **(c)** a future collaborator or employer; **(d)** you and a handful of friends. Second place matters too, but name the first.

A: (a) client/Arthouse lead AND (b) peer whose respect he wants. But note Q14: the site is explicitly NOT a work showcase — Arthouse is. So it sells the person via voice/judgment, and points at Arthouse for work. (2026-08-25)

**7.** Does this site need to *sell* anything — you, Arthouse, availability? Fork: **(a)** yes, it should generate inbound; **(b)** no, Arthouse does that and this one is free to be non-commercial.

A: (a), but as a router, not a pitch: the site should get people to click through — book work at Arthouse, or contact him personally via LinkedIn/X/email. (2026-08-25, round 2)

**8.** What's the single action you most want a visitor to take? (Email you, read a post, follow you somewhere, check out a project, add a book to their list, nothing at all.)

A: Click through his links — ideally from the "what I do" section — to either book work at Arthouse or write him personally (LinkedIn, X, email). Reference image for the link-hub idea: `assets/ref-bento-grid.png` (bento.me grid — structural inspiration only, NOT the pastel SaaS aesthetic). (2026-08-25, round 2)

**9.** What did the old site fail at? Concretely: what made you start the rewrite, and what about the rewrite made you stop before shipping it?

A: Stopped the WIP rewrite because he didn't like the visual direction (the dark/glow "DJ portfolio" drift). Old-site failure not stated. (2026-08-25)

## Vibe & register

**10.** Of the three directions in `03` — **THE INDEX** (taste archive as evidence), **THE CONSOLE** (calm instrumented system, one loud signal), **OFF-DUTY** (writing and opinion lead, work as appendix) — which one do you want to *be true*, and which one is most honest about who you are right now? If those differ, that gap is the most useful thing you can tell us.

A: Not answered directly, but derivable from the other answers: CONSOLE is dead (light site, music player cut, disliked the glow direction). The result is an INDEX + OFF-DUTY hybrid — writing pulse (monthly + annual review), archives as connection layer, no work showcase. See "Decision" in `03`. (2026-08-25)

**11.** How funny is the site allowed to be? Fork: **(a)** dry, humour only in details and metadata; **(b)** properly funny, rebased-level, jokes on the surface. Related: does the site swear?

A: (a). Dry and matter-of-fact. (2026-08-25)

**12.** Rate how comfortable you are being *personal* — health, doubts, failures, what you're struggling with, Vienna life — versus keeping it to work and taste only. Where's the line you won't cross?

A:

**13.** German, English, or both? And does any of hausgemacht's intimacy of address ("du", direct second person) belong on your site, or is that their voice, not yours?

A: English only. (2026-08-25, round 2)

**14.** Name one site — any site, not from the reference three — that you're jealous of. And one you find embarrassing that you can tell you're at risk of building.

A: No jealousy target. Failure modes to avoid: most dev pages are either too simple or too visual. Explicitly NOT a work showcase — that's what madebyarthouse.com is for (later). (2026-08-25)

## Content & features

**15.** The taste archives (books, films, music, games, quotes) — fork: **(a)** they're the substance of the site, equal to or bigger than the work; **(b)** they're a supporting layer under the work; **(c)** they're legacy and you'd cut some. If you'd cut, which go first?

A: Personal archive + connection point for people who might like the same books, tools, etc. So: present but not the headline. Note he said "tools" — a uses/tools page belongs in the archive set. (2026-08-25)

Round 2: Keep **books** and **tools/uses** content-wise. Architecture requirement: **one generic item schema** with a category flag (book, film, album/artist/song, tool — extensible), rendered as one consistent card design that adapts per category. Items are included on authored pages by **explicit reference inside portable text** — no autoloading. Newsletter posts live **on the site**. (2026-08-25, round 2)

**16.** The persistent music player: **core identity feature** or **gimmick to cut**? Be honest about whether you'd actually miss it. (It's the most opinionated thing in the WIP build and it's currently pulling the whole design toward "DJ portfolio.")

A: Gimmick to cut. (2026-08-25)

**17.** Will you write? Fork: **(a)** yes, realistically 1+ pieces a month, build the site around it; **(b)** occasionally, a few a year; **(c)** no, stop planning for it. Answering (a) unlocks OFF-DUTY; answering (c) kills it. What's the true answer, not the intended one?

A: (a)-ish: monthly newsletter/Substack-type post + one year-in-review per year. Writing is a real, scheduled pulse — newsletter format, not essays-whenever. (2026-08-25)

**18.** "Now" content — currently building / reading / listening — are you willing to keep it current, or should the site be built to look correct after six months of neglect?

A:

**19.** Projects: is there real, showable, non-NDA work of your own that isn't Arthouse client work? If the honest answer is "not much," the site should not be structured around a projects section.

A:

## Practical

**20.** Hard constraints: launch deadline, budget for a typeface licence, willingness to commission or buy a display face versus using something free?

A: Just **one free sans-serif font** for the whole site. No display face, no licence budget. Identity work has to come from layout, texture (dither/grain), and scale/weight contrast within a single family. No deadline stated. (2026-08-25, round 2)

**21.** Anything already decided and non-negotiable — a colour, a name treatment, the domain handling of `chrcit`, an element from the WIP build you want to keep no matter what?

A: "Just do it" — no non-negotiables, free rein on what survives from the WIP build. (2026-08-25, round 2)
