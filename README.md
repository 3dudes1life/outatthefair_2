# Out at the Fair® V6.8

V6.8 adds OneSignal Web Push to the existing OATF website/PWA.

## Included
- OneSignal Web SDK v16 on every page
- App ID: `58afac42-f259-4105-8bc6-c9ff2414f2e7`
- Dedicated worker at `/push/onesignal/OneSignalSDKWorker.js`
- Dedicated worker scope to avoid conflict with the existing PWA worker
- Branded notification invitation
- Subscription state handling
- 30-day dismissal memory
- iPhone/iPad Add-to-Home-Screen instructions
- Updated PWA cache version

## Required OneSignal dashboard settings
Under **Settings → Push & In-App → Web**:

- Integration: Custom Code or Typical Site
- Site URL: the exact production origin, such as `https://outatthefair.com`
- Path to service worker files: `/push/onesignal/`
- Service worker filename: `OneSignalSDKWorker.js`
- Service worker registration scope: `/push/onesignal/`

## Important
Web push requires HTTPS and does not work in private/incognito browsing.

For iPhone and iPad, the user must be on iOS/iPadOS 16.4 or newer and launch the website from a Home Screen icon before enabling notifications.

OneSignal subscriptions are tied to a single origin. A GitHub Pages preview origin and the production custom domain cannot share the same production web-push subscription configuration unless the dashboard app is configured for that exact origin.

## Verification
After deployment, open:

`https://YOUR-DOMAIN/push/onesignal/OneSignalSDKWorker.js`

It should display:

`importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");`


## V6.8.1 mobile navigation hotfix
- Removed conflicting legacy click listeners by replacing the mobile nav controls at runtime
- California Fairs now opens as a persistent mobile submenu
- The drawer remains open until a specific fair is selected
- Only destination links close the drawer
- Backdrop is forced behind the drawer
- Menu text remains fully visible and clickable
- OneSignal code remains installed but dashboard setup may be completed later
