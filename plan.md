# Coach Logic cinematic rebuild plan

## Direction

Build a light, editorial, mineral-print portfolio for Coach Logic: a developer who turns ambiguous systems into useful products and tools. The experience should feel like a printed technical field guide that gains depth when the viewer interacts with it.

### Design movement

**Mineral print editorialism**: paper-like surfaces, high-contrast ink, restrained pigment, thin registration lines, translucent layers, and sculptural objects used as information carriers.

### Core principles

- **Evidence first:** state, role, stack, and destination stay visible before decorative detail.
- **One spatial spine:** an axis rig connects identity, process, work, and experience so the site feels authored rather than assembled.
- **Quiet material richness:** use clay-like light, inner shadows, grain, and controlled translucency instead of neon, glossy gradients, or generic glassmorphism.
- **Reversible motion:** every major scroll transformation is scrubbed and returns cleanly when the viewer scrolls upward.

### Color philosophy

Warm ivory is the paper. Charcoal is the ink and carries body text with accessible contrast. Lichen is the ownable Coach Logic color: calm, technical, and grounded without reading as default green. Lilac stone marks learning and reflection. Iron oxide marks action and live states. Pearlescent white is reserved for highlights and object faces. No full-black canvas, cyan, or rainbow glow.

### Layout paradigm

Use alternating editorial columns, full-bleed paper bands, pinned wide scenes, and a curved timeline lane. Avoid a repeated centered card grid. Project rows should alternate visual evidence and narrative, while the homepage uses large quiet zones around each scene to create pacing.

### Signature elements

1. **Mineral axis mark:** a small CL glyph and a translucent three-axis object that rotates gently in the hero and responds to scroll.
2. **Cursor field:** a low-opacity lichen particle trail that interpolates toward the pointer and fades completely under reduced motion or touch.
3. **Liquid S-curve:** an SVG path with a measured stroke that fills according to scroll progress, carrying duration-aware experience milestones.

### Interaction philosophy

Interaction should clarify state. Pointer movement shifts the scene and leaves a restrained field; hover/focus on nodes reveals a label and one useful detail; project names scramble briefly before resolving exactly; links expose the destination and status. Touch and keyboard receive equivalent content without hover dependence.

### Animation

The entrance is brief and bypassable: mark, rule, masked headline, support copy, then settled navigation. The hero camera moves on the first scroll range, scaling foreground/middle/background layers while the axis rig rotates. The pinned chapter scrubs one timeline that coordinates camera distance, orbit rotation, headline perspective, and project evidence. Section reveals are short and mostly opacity/translate; no scroll hijacking, excessive blur, bounce, or endless looping. `prefers-reduced-motion` disables pinning, continuous rotation, cursor particles, and view transitions while preserving content order.

### Typography

Use Space Grotesk as the display family for a tight geometric headline, Manrope as the readable body family, and DM Mono for metadata only. Keep the family count at three. Use fluid `clamp()` sizes, compact display line-height, and readable body line-height around 1.7–1.8.

### Brand essence

**Positioning:** Coach Logic builds calm, inspectable software for people working through complex systems.

**Personality:** precise, curious, grounded.

### Brand voice

Headlines are short and declarative. Supporting copy is first-person, concrete, and outcome-led. CTAs use direct verbs.

- “I build tools that make complex systems legible.”
- “See the work, the decision, and the proof.”

### Wordmark and logo

Use a compact circular CL glyph crossed by one offset axis line, paired with the Coach Logic wordmark. It should read like a registration mark from a technical print, not plain text in a default font.

### Signature brand color

`#718368` lichen — a muted, ownable green used for active state, path fill, and the primary button. It should never be used as a full-page background.

## Implementation approach

- Keep React Router and the existing route set. Refactor the current monolith into data-first components in `src/main.jsx` only where the change is lower risk; do not delete truthful project data.
- Consolidate the CSS into one final token layer and remove the contradictory historical cascade. Preserve the current responsive behavior while adding explicit 1024px and 720px adaptations.
- Upgrade the hero into a three-layer composition: real R3F canvas, DOM fallback/annotation rail, and scroll-driven foreground/middle/background depth. Keep geometry procedural and lightweight.
- Replace the experience rail with an SVG S-curve whose milestone positions are generated from duration values. Keep undated Axial Systems and ongoing tool directions in honest side lanes instead of inventing dates.
- Add `public/manus-routes.json` and keep it synchronized with the six route families and dynamic work route. Preserve the GitHub Pages route-directory fallback step for every supported slug.
- Keep all project claims within the supplied evidence. Use `live`, `delivered`, `evolving`, `repository`, `exploring`, and `unfinished` labels.

## Project structure

- `src/main.jsx`: route shell, data, scene components, route pages, transitions, interaction hooks.
- `src/index.css`: mineral-print tokens, layout, responsive rules, reduced-motion rules, and motion states.
- `public/manus-routes.json`: complete route manifest for managed preview and route inspection.
- `.github/workflows/deploy-pages.yml`: static build, `404.html`, and nested route directory fallbacks.
- `REFERENCE_RESEARCH.md`: verified reference synthesis and source links.
- `AUDIT_BASELINE.md`: measured live-site baseline and known defects.

## Delivery shape

Build the app, run `git diff --check`, smoke-test every route and `/manus-routes.json`, check the live nested URL behavior after deployment, review the final diff for dead links or secrets, commit with a clear message, push `feat/cinematic-multipage-portfolio`, and open a pull request if GitHub permits. Do not claim a public deployment from the feature branch unless GitHub confirms it.
