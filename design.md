# Design direction

The current direction is a restrained editorial interface with a technical, slightly art-school character. It is intentionally a foundation rather than a finished identity.

## Character

- Audience: curious people following Christian's work, writing, references, and side experiments.
- Voice: direct, self-aware, specific, and not overly promotional.
- Shape: one clear typographic hierarchy, compressed editorial rhythm, sharp edges, and a single cobalt accent. Metadata labels are functional, not decorative.
- Temporary typeface: Geologica Variable from Fontsource. It has some of the engineered personality of ABC Dynamo Whyte Inktrap without introducing a second family.
- Color: cool near-white and near-black with `#1843d8` as the only accent. System dark mode is supported by default.

## Interaction

- Collections can render as a list, thumbnail-led media list, grid, horizontal swipe carousel, single feature, or filterable list.
- Carousels use native horizontal scrolling and scroll snapping. No autoplay.
- Popup notes work on hover and keyboard focus.
- Motion should explain state change and remain subtle. Respect `prefers-reduced-motion`.
- Newsletter UI must clearly expose pending, success, validation, service error, and unconfigured states.

## Layout

- Maximum shell width: 72rem.
- Reading width: 46rem.
- The homepage uses one name, one linked biography, a route line, and the newsletter. It does not split work into promotional card collections.
- Editorial pages use one dominant title and then let their blocks set rhythm.
- Navigation is a quiet `chrcit.com / current context` breadcrumb, not a global section menu.
- Book cards use a cover thumbnail on the left and compact title/author context on the right.
- Containers should not be nested inside decorative cards unless the content genuinely behaves like a contained object.
- Mobile is a first-class layout, not a collapsed desktop afterthought.

This is deliberately easy to replace once the content architecture has been tested with real material.
