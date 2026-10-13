# Forensic audit baseline

**Audited:** 2026-10-13
**Target:** `https://veloratech.github.io/portfolio/`
**Repository:** `VeloraTech/portfolio`
**Branch at audit:** `feat/cinematic-multipage-portfolio`

## Browser measurements

The live homepage was opened in the Sandbox browser at a 1280 × 1100 viewport.

- `document.documentElement.scrollHeight`: **4680 px**
- Horizontal overflow: **none** (`scrollWidth - innerWidth = -15`)
- A real WebGL `<canvas>` is present.
- The first viewport uses `Manrope, sans-serif`; metadata uses `DM Mono, monospace`.
- Internal routes exposed in the DOM: `/`, `/work`, `/engineering`, `/about`, `/contact`, and `/work/:slug` for AgentTrace, NativeRelay, Cleaner, Aster, MOUAEC, and Telica.
- The home page exposes live/repository links for the listed projects plus GitHub and contact links.

Desktop, tablet, and mobile top-of-page captures were also generated in `/home/ubuntu/portfolio-audit-before/` for visual comparison during the rebuild.

## Current strengths

- React Router, GSAP, ScrollTrigger, React Three Fiber, Drei, and View Transitions are already present.
- The hero contains a real rotating 3D axis scene with semantic node labels and a CSS artifact fallback.
- The code already has a cursor canvas, a bounded scramble component, a pinned cinematic component, a curved experience path, and truthful project data.
- The Pages workflow already copies SPA fallbacks into route directories and `404.html`.

## Confirmed weaknesses

- The first viewport still reads as a conventional editorial hero with one 3D object, not as a continuous cinematic scene. The heavy scroll choreography starts after the hero instead of being felt from the opening state.
- The visual system is contradictory in source. Earlier green/cyan/dark layers remain interleaved with the mineral-print layer, which makes later changes fragile and produces a generic “developer portfolio” feel.
- The project visuals are mostly authored abstract diagrams rather than clearly labeled live-product frames or repository evidence. The next pass must make the distinction explicit and keep the real destination link close to the evidence.
- The experience path is technically curved in the current source, but its milestones are not yet positioned along a proportionally data-driven S-curve. The path needs coordinates derived from duration and explicit side lanes for undated work.
- The hero node tooltip interaction is primarily pointer-driven inside WebGL. Important labels need a keyboard-accessible HTML annotation path and a stronger focus state.
- Route correctness needs a deployed-path check on direct nested URLs, not only client-side navigation. The Pages build must preserve every nested route currently declared by the app.
- The current source contains duplicated object fields and accumulated cascade overrides. This is a maintainability problem even where the rendered result appears acceptable.

## Acceptance direction for the rebuild

The rebuilt homepage must make the identity, real work, and next action understandable without requiring the viewer to discover every interaction. Scroll-linked camera movement, layer parallax, the cursor field, and the S-curve timeline should reinforce that hierarchy. Reduced-motion users should receive the same content in a calmer static composition.
