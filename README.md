# Out at the Fair® V6.9

V6.9 is the stabilization release.

## What changed
- Consolidated all site CSS into `assets/app.css`
- Consolidated all site JavaScript into `assets/app.js`
- Removed all competing legacy mobile-navigation handlers
- Rebuilt the mobile drawer and submenu behavior as one system
- Standardized the same header and footer across every page
- Removed the Marin County Fair destination folder
- Preserved Marin only in historical content
- Removed horizontal fair swiping from the homepage and fair grids
- Replaced old Google Form signup links with a single OutAt/Wix-ready signup modal
- Added a single `WIX_SIGNUP_URL` configuration field in `assets/app.js`
- Kept OneSignal installed behind `ONESIGNAL_ENABLED: false`
- Rebuilt the service worker with network-first HTML
- Removed obsolete cached version assets
- Added noindex to the 404 page and removed its canonical
- Removed duplicate theme-color metadata
- Corrected hero image loading priority
- Rebuilt sitemap and robots files

## Before V7
Update these values in `assets/app.js`:

```js
WIX_SIGNUP_URL: ''
ONESIGNAL_ENABLED: false
```

When the Wix form URL is available, paste it into `WIX_SIGNUP_URL`.

When the OneSignal dashboard and production domain are fully configured, change:

```js
ONESIGNAL_ENABLED: true
```

## Deployment
Upload the contents of this ZIP to the repository root.

Because this release replaces the old service worker and removes many cached patch files, test once in a private window or clear website data after deployment.


## V6.9.1 hotfix
- Corrected the mobile menu stacking context
- Header and menu now render above the blurred backdrop
- Forced full menu text/button visibility in mobile Safari
- Improved hamburger visibility while the drawer is open
- Fixed service-worker registration for GitHub Pages project subfolders
- Converted precache URLs to service-worker-scope-relative paths


## V6.9.2
- Restored the floating mobile navigation dock
- Includes Home, Fairs, Story, Photos, and Join
- Highlights the active section
- Uses GitHub Pages-safe relative site-root detection
- Hides automatically while the hamburger drawer is open
- Preserves iPhone safe-area spacing
