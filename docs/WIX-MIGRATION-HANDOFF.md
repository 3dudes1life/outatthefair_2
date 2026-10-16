# Wix migration handoff

## Current GitHub Pages routes

The launch-critical routes are already directory-based and GitHub Pages-safe:

- `/`
- `/riversidecountyfair/`
- `/sdfair/`
- `/orangecountyfair/`
- `/history/`
- `/contact/`

The existing routes `/about/`, `/californiafairs/`, `/faq/`, `/giveaways/`, `/participate/`, `/pennants/`, `/photos/`, and `/tvsfa/` remain in place to avoid breaking links while the relaunch is staged. They are included in `sitemap.xml`.

## Before changing DNS

1. Export the current Wix URL list from its SEO/redirect manager and Search Console, including any campaign, photo, giveaway, or legacy fair URLs.
2. Map every URL to one of the retained GitHub Pages routes. Keep the path where possible; otherwise create the redirect at the DNS/CDN host. GitHub Pages cannot provide server-side 301 redirects for arbitrary legacy paths on its own.
3. Confirm the canonical domain (`https://outatthefair.com/`) and add the custom domain in GitHub Pages only after the redirects are ready.
4. Replace the remote Wix image URLs with approved local image exports before final launch. Each currently has a local SVG fallback, but local originals are preferable for performance and independence.
5. Supply approved 2027 confirmation details before publishing them: fair agreement status, dates, stage/location, ticket link, entertainment, partners, photography permissions, and a working email-signup destination.

## SEO readiness

Every launch-critical page has a distinct title, description, canonical URL, Open Graph title/description/image, semantic `main` landmark, skip link, and structured organization data. `robots.txt` permits crawling and points to `sitemap.xml`; the 404 page is `noindex`.
