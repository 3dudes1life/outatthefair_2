# OATF V6.9.1 launch scorecard

This is a local readiness assessment only. Nothing has been committed, published, or pointed at a new domain.

| Requirement | Status | Evidence / release condition |
| --- | --- | --- |
| Four launch pages exist and use the approved V6.9 visual system | PASS | `/`, `/riversidecountyfair/`, `/sdfair/`, and `/orangecountyfair/` are present with shared CSS and navigation. |
| Riverside 2027 status is prospective and unconfirmed | PASS | Riverside states there is no confirmed 2027 event or official fair partnership. |
| San Diego and Orange County avoid dates and commitments | PASS | Both say information is coming soon and explicitly state no date, stage, or entertainment is announced. |
| Shared desktop and mobile navigation | PASS | The shared script provides Home, Fairs (all three locations), Our Story, and Contact; the dock has four items and reserves bottom space. |
| Semantic/accessibility basics | PASS | Each launch page has a skip link, `main` landmark, single page heading, alt text, viewport, and keyboard-operable navigation controls. |
| Local link and metadata audit | PASS | `npm run verify:site` validates the four launch pages, local paths, canonical/social metadata markers, sitemap, robots, CNAME, and status language. |
| Responsive visual QA in iPhone Safari, Android Chrome, desktop Safari and Chrome | WARNING | CSS has mobile breakpoints and safe-area dock spacing, but final visual/device QA requires real browsers and devices. |
| Remote Wix image loading | WARNING | Launch pages use Wix-hosted images with local SVG fallbacks. Network availability and rendering should be checked in final browser QA. |
| Local approved image originals | BLOCKED | Do not remove Wix media until approved originals are delivered and substituted. See `ASSET-MIGRATION.md`. |
| Public signup CTA | PASS | `WIX_SIGNUP_URL` is blank, so signup controls are removed at runtime and hidden without JavaScript. Configure a verified destination before restoring. |
| GitHub Pages custom-domain preparation | PASS | Uncommitted `CNAME` contains `outatthefair.com`; `.nojekyll` preserves the static-site behavior. GitHub Pages settings and DNS remain untouched. |
| Sitemap, robots, canonical and social metadata | PASS | `robots.txt` references production sitemap; launch routes appear in `sitemap.xml`; each has distinct title/description and OG data. |
| All 19 supplied legacy Wix URLs | PASS | Six routes are native GitHub Pages pages and 13 are covered by the prepared Cloudflare 301 import. |
| Cloudflare redirect deployment | BLOCKED | The CSV is prepared but must not be imported until the cutover window and proxied Cloudflare zone are ready. |
| Participation portal foundation | PASS | `/participate/` is permanent, with separate clearly closed Entertainment and Nonprofit & Community sections. No application system was created. |

## Wix images requiring approved local replacements

The current site has these official Wix media dependencies. Do not substitute stock or generated imagery:

1. White OATF logo
2. OATF burst/logo mark
3. OATF unicorn mascot
4. Stage hero photograph
5. Riverside fair card
6. San Diego fair card
7. Orange County fair card
8. Western Fairs Association award badge

The exact Wix source URLs and existing local fallback files are documented in `ASSET-MIGRATION.md`.
