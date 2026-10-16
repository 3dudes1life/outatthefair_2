# OATF Analytics & Visitor Intelligence V1

## Operating model

OATF uses one future GA4 property for the whole website. Analytics is deliberately inactive in this repository until both of these conditions are true:

1. `GA4_MEASUREMENT_ID` in `assets/app.js` contains the approved ID.
2. A visitor has chosen **Allow optional analytics** in the footer's **Privacy & analytics** control.

The integration uses basic consent mode: it does not load `gtag.js`, create Google Analytics storage, or send a request to Google before consent. Global Privacy Control and Do Not Track keep optional analytics off even if a prior local preference exists.

The footer control is the visitor-facing disclosure and opt-out: selecting **Keep analytics off** revokes the local preference and sends a denial update if a tag had been loaded. It deliberately does not show a banner because GA4 remains blocked until a visitor opts in. Before production activation, legal counsel should approve and publish the organization-wide privacy policy that links to this control and accurately describes the final vendors, retention, and rights process.

## GA4 configuration

1. Create or select one GA4 property and Web data stream for `outatthefair.com`.
2. Enter its ID (`G-...`) in `assets/app.js` as `GA4_MEASUREMENT_ID`.
3. Keep enhanced-measurement page views disabled in the stream if Google offers that setting; the site explicitly configures `send_page_view: false` and sends exactly one manual `page_view` per route.
4. In GA4 DebugView, open the local test build with a test Measurement ID only. Never add a test ID to committed production configuration.
5. Mark no custom event parameter as user-provided data. Do not use names, emails, phone numbers, form contents, IP addresses, or URL query values as custom event parameters.

UTM parameters remain in the standard `page_location` sent with the initial page view, so GA4 can attribute standard `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term` traffic without a custom campaign implementation.

## Event contract

| Event | When it fires | Parameters |
| --- | --- | --- |
| `page_view` | Once for an opted-in route load or an explicit future `oatf:navigation` event | Standard `page_title`, `page_location` |
| `fair_page_view` | Once on each fair page | `fair_location` |
| `navigation_click` | An opted-in primary or mobile navigation link is clicked | `navigation_label`, `destination_path` |
| `fair_card_click` | A homepage/location fair card is clicked | `fair_location` |
| `contact_click` | A `mailto:` or `tel:` link is clicked | `contact_method` (`email` or `phone`) |
| `participate_view` | Once on `/participate/` | none |
| `scroll_depth` | First reach of 25, 50, 75, and 90 percent per page view | `percent_scrolled` |
| `outbound_link_click` | An external HTTP(S) link is clicked | `link_domain` only |
| `email_link_click` | A `mailto:` link is clicked | none |
| `entertainment_interest_click` | A future functional link marked `data-analytics-interest="entertainment"` is clicked | none |
| `nonprofit_interest_click` | A future functional link marked `data-analytics-interest="nonprofit"` is clicked | none |

The two future interest events are intentionally dormant: no placeholder cards, disabled controls, or nonfunctional Apply buttons generate them.

Fair values are fixed: `riverside`, `san_diego`, and `orange_county`. Use `fair_location` as the comparison dimension in GA4 Explorations; do not create a property per fair.

## Campaign examples

```text
https://outatthefair.com/?utm_source=newsletter&utm_medium=email&utm_campaign=2027_launch
https://outatthefair.com/locations/?utm_source=instagram&utm_medium=social&utm_campaign=2027_launch&utm_content=profile_link
https://outatthefair.com/riversidecountyfair/?utm_source=qr&utm_medium=offline&utm_campaign=riverside_interest
```

Use lowercase, stable values. Do not put email addresses, names, phone numbers, application IDs, or other personal data in UTM values.

## Cloudflare Web Analytics

The active Cloudflare account and `outatthefair.com` zone support Web Analytics, and a zone-level Web Analytics configuration already exists. Cloudflare documents that Web Analytics can run on a static site with its beacon and does not require a proxy or DNS move. No beacon was added, no tracker was enabled, and no Cloudflare setting was changed in this work.

Recommendation: treat the existing Cloudflare tracker as the optional lightweight traffic-verification layer and do not add its snippet to GitHub Pages until its owner confirms whether automatic injection will remain appropriate after cutover. Keep GA4 as the event/engagement source, not a second Cloudflare event taxonomy.

## Privacy notes

- The implementation uses no fingerprinting, user IDs, advertising storage, advertising user data, or ad personalization.
- Google tag loading is asynchronous and failure leaves navigation and page behavior unchanged.
- Global Privacy Control and Do Not Track are honored before GA4 starts.
- The site currently avoids a consent banner because no optional Google measurement occurs without an affirmative choice. This is a product decision, not legal advice.
- Obtain counsel review before launch for CCPA/CPRA and other applicable requirements, including the final privacy notice, service-provider/vendor disclosures, retention configuration, and a process for privacy requests.

Authoritative references: [Google consent mode](https://developers.google.com/tag-platform/security/guides/consent), [manual GA4 page views](https://developers.google.com/analytics/devguides/collection/ga4/views?technology=websites), and [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/about/).

## Verification completed locally

- Default configuration: no Google tag request and no analytics events.
- Controlled Playwright configuration: all six routes sent one manual page view; each fair route produced its correct `fair_location`; `/participate/` produced `participate_view`.
- UTM parameters remained in the manual page view location.
- Scroll milestones, fair-card, navigation, email, and contact events were exercised.
- Global Privacy Control suppressed analytics under the controlled configuration.
- `npm run verify`, JavaScript syntax validation, and `git diff --check` passed.
