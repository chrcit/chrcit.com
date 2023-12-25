---
title: Preismonitor
tags: [politics, austria]
description: Preismonitor is a website that shows the price development of groceries in Austria.
image: ./images/preismonitor-screenshot.png
---

Mai + June + September

- Idea / Building
  - Inflation + grocery prices rising
  - Minister for Labour and Economics proposed a state pricer tracker with selected products which might come in fall (add translated link to local newspaper)
  - Lukas had the idea to just do this ourselves
  - Crawler + FE
  - Show in progress screenshots
- Launch
  - We were last after [heisse-preisse.io](heisse-preisse.io) (Mario), [teuerungsportal.at](teuerungsportal.at) Bernhard und [preisrunter.at](preisrunter.at)
  - Link national news coverage
  - Screenshot with usage numbers
  - We stopped developing after the launch due to time constraints -> not really useful
    - No UI for aggregate view + limited datax
    - Crawler stopped working in October
- Changing the law
  - Answered questions for the Bundeswettbewerbsbehörde[^1]
  - They proposed to create a law which would compel large supermarkets to publicise their price data via an API (link to article)
  - Got invited with the others to meet the minister and consult him on exact law implementation (link Tweet)
  - Why this is cool
  - (Hopefully) will come in 2024
- Future
  - Kill our crawler and replace with heisse-preisse data (or maybe government API)
  - At some point build a consumer grocery list app which integrates this pricing data
- Stack: Typescript, Next app dir, Node for the Crawler, Prisma for crawler, Kysely for fetching on the edge, Planetscale, Tailwind
