---
layout: ../layouts/Page.astro
title: Colophon
description: How this site is made.
---

The source for this site is on [GitHub](https://github.com/chrcit/chrcit.com).
Analytics: [Plausible](https://plausible.io/chrcit.com).

Posts from Twitter, YouTube, and Instagram are stored as static cards. No embed scripts, no extra cookies.

Vienna time is computed in the browser. Weather is fetched from [Open-Meteo](https://open-meteo.com/) in the browser, no API key, no cookies.

## Stack

- [Astro](https://astro.build/): pages, content collections, MDX. The homepage is server-rendered; the rest is static.
- The homepage book and tool sample is cached at the Cloudflare edge for five minutes.
- [Apfel Grotezk](https://www.collletttivo.it/typefaces/apfel-grotezk): the only typeface, self-hosted
- [Plausible](https://plausible.io/): analytics, no cookies
- [Open-Meteo](https://open-meteo.com/): Vienna temperature, client-side
