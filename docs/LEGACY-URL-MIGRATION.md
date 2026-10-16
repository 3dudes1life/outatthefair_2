# Legacy URL migration

All 19 supplied Wix URLs are accounted for in `wix-url-migration-inventory.csv`.

## Native GitHub Pages routes

GitHub Pages will serve these directory routes directly. The trailing slash is the canonical URL, while a request without it resolves to the directory index page.

- `/`
- `/locations/`
- `/riversidecountyfair/`
- `/sdfair/`
- `/orangecountyfair/`
- `/participate/`

The three fair routes reuse their existing landing pages. `/locations/` is the single new location hub; no legacy-fair content pages were created.

## Cloudflare redirects

Use `cloudflare-bulk-redirects.csv` as a Cloudflare Bulk Redirect List import. It deliberately has no header row, uses permanent `301` redirects, preserves query strings, and does not match subpaths or preserve a path suffix. Targets are native final destinations, so the set has no redirect chains or loops.

Cloudflare redirects must be installed only after the `outatthefair.com` zone is active and proxied through Cloudflare. GitHub Pages does not provide server-side 301 support for these legacy paths.

Cloudflare's current CSV import format is documented at https://developers.cloudflare.com/rules/url-forwarding/bulk-redirects/reference/csv-file-format/.

## Future routes

`/participate/` is permanent and now contains separate closed sections for Entertainment Applications and Nonprofit & Community Applications. `/nonprofit` points there until a distinct approved nonprofit application route is ready. `/partner` temporarily points to Contact; no sponsorship workflow has been created.
