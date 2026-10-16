# OATF 3.0 UI/UX visual acceptance audit

Audit date: 2026-10-16  
Branch: `oatf-ui-visual-audit`  
Server: local static preview at `http://127.0.0.1:4181`

## Scope and browser

Rendered with Playwright 1.64.1's isolated headless Chromium. The audit did not attach to, read, or alter a personal Chrome profile or browser session.

The following live routes were checked: Home, Locations, Riverside County Fair, San Diego County Fair, Orange County Fair, Participate, Our Story, and Contact.

All routes were rendered at CSS viewport widths 320, 360, 375, 390, 430, 600, 768, 820, 1024, 1180, 1275, 1366, 1440, and 1920 pixels. The 1024, 820, and 600 pixel checks also cover the effective CSS widths a 1275 pixel viewport exposes at approximately 125%, 150%, and 200% browser zoom. Chromium's browser-chrome zoom control is not exposed to a headless Playwright page, so that control itself was not automated.

Full-page reference captures were recorded at 390, 768, and 1440 pixels for every route (24 images). The local-only audit artifact directory is `/tmp/oatf-ui-ux-audit-2026-10-16/`; it is intentionally outside the public site and repository output. The machine-readable results are in `matrix.json` there.

## Findings and remediation

| Severity | Area | Finding and root cause | Resolution | Result |
| --- | --- | --- | --- | --- |
| P0 | Home / history section | At intermediate and very large desktop widths, the editorial headline could consume the timeline's grid column. The grid allowed intrinsic-width pressure and the component inherited an overlarge global headline maximum. | Made both history grid tracks shrinkable, constrained their minimum inline size, reduced only this component's gap range, made the timeline body shrinkable, and applied a component-local headline scale capped at 6rem. | No overlap or clipping. Measured headline-to-timeline clearance is 105.8px at 1275px and 43.0px at 1920px. No `overflow: hidden` workaround was used. |
| P2 | All audited routes | No visual defects were demonstrated in the rendered matrix: no horizontal overflow, broken visible image, failed request, or browser console error. | No speculative design changes made. | Pass. |

The before and after P0 captures are local-only: `/tmp/oatf-ui-audit-before-history-1275.png` and `/tmp/oatf-ui-audit-after-history-1275.png`.

## Visual and interaction checks

- Desktop, tablet, and mobile screenshots were inspected for the page hierarchy, card groups, image crops, container edges, footer spacing, and mobile dock placement.
- Across 112 route/viewport renders, document `scrollWidth` never exceeded viewport width; visible images decoded successfully; no requests failed; and no console errors were emitted.
- The 1275px and 1920px history layout received direct geometry checks. The fixed headline remains left of the timeline at both widths.
- At a 390px viewport, the navigation toggle correctly updates `aria-expanded`, opens its menu, closes on Escape, returns `aria-hidden` to the closed state, and opens the Fair submenu without overflow.
- Each audited route has one `h1`, one `main`, an English document language, title, description, canonical URL, and a visible 3px keyboard focus outline on links.

## Regression checks

Passed locally after the targeted CSS change:

```text
npm run verify
npm run verify
node --check assets/app.js
git diff --check
```

`npm run verify` confirms all six launch pages and all 19 legacy URL outcomes, plus the existing responsive-grid, mobile-dock, focus, motion, overflow, and location-card safeguards.

## Acceptance status

| Surface | Status | Notes |
| --- | --- | --- |
| Desktop (1024–1920) | PASS | Includes repaired 1275px and 1920px history composition. |
| Tablet (600–820) | PASS | No overflow, failed images, or navigation collision observed. |
| Mobile (320–430) | PASS | No horizontal scrolling; dock and expandable navigation behaved correctly. |
| Browser zoom controls | WARNING | Equivalent CSS widths were tested; a literal desktop browser toolbar zoom setting was not automatable in headless Chromium. |

No production deployment, DNS, Cloudflare, Wix, commit, or push action occurred during this audit.
