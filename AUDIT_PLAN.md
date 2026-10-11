# Coach Logic correction audit and implementation plan

## Audit findings

- **Routes:** React routes exist for `/`, `/work`, `/work/:slug`, `/engineering`, `/about`, and `/contact`. In the deployed GitHub Pages build, the root route returns 200 but direct nested requests return 404 because the static host only receives the root `index.html`; the deployment workflow needs route-directory fallbacks.
- **Motion:** GSAP is present. The hero and pinned chapter use scrubbed ScrollTrigger timelines, but the hero is still mostly a single composition and the rest of the page relies heavily on generic reveal/fade patterns. There is no genuine pointer-reactive field or layered cursor response.
- **Depth:** The Three.js hero is real, but the CSS fallback is still a decorative proxy and the scroll system does not consistently expose foreground/middle/background parallax layers.
- **Timeline:** The current experience section is a straight vertical rail with equal visual event spacing. It does not use dates, duration scaling, or a curved path.
- **Product architecture:** Detail routes exist and the Aster study is richer than the other projects. The work index is a flat list, while systems and experience repeat project/tool labels rather than grouping them by purpose.
- **Visual system:** The stylesheet contains several stacked theme overrides from previous passes, including cyan/teal, dark-canvas, terracotta, and light editorial layers. The final cascade works, but the source is contradictory and the visual language still reads like a generic developer portfolio.
- **References:** Idolo was visually inspected for concise product communication, strong type hierarchy, compact navigation, and direct CTAs. Michele Du was used as the light editorial/motion reference. Vellwax could not be fetched reliably, so no unverified visual claims are made about it.

## Chosen direction: mineral print

A warm paper canvas, near-black ink, lichen/moss support tones, and one restrained iron-oxide accent. The palette should feel printed, tactile, and editorial rather than technological. Typography uses Manrope for compact geometric display, DM Sans for readable body copy, and DM Mono only for system metadata.

## Implementation stages

1. Replace the repeated theme cascade with a final mineral-print token layer and improve contrast.
2. Add a genuine cursor-reactive particle field with interpolation, velocity decay, and reduced-motion fallback.
3. Extend the pinned cinematic scene with foreground/middle/background layers and continuous reversible parallax/zoom.
4. Replace the straight experience rail with an SVG S-curve. Use the known LogicLabs 2023–May 2026 span for proportional geometry, and keep undated/ongoing work in honest side lanes rather than inventing dates.
5. Group the work index into Developer tools & observability, Web applications & platforms, Websites & registration, and Education & mentorship where the evidence supports it.
6. Preserve shared-element View Transition names for work-to-study continuity and add static route-directory fallbacks for GitHub Pages.
7. Build, smoke-test every route, verify the deployed URL, and report remaining limits honestly.
