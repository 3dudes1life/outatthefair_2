# Out at the Fair® V6.7

V6.7 completely rebuilds the mobile navigation experience.

## Mobile navigation
- Replaced the previous layered mobile menu behavior
- Added a true full-height mobile drawer
- Added a separate backdrop that always sits behind the menu
- Removed old pseudo-element overlays that could blur menu content
- Bright, fully readable navigation text
- iPhone safe-area support
- Locked body scrolling while menu is open
- Outside-tap closing
- Escape-key closing
- Improved mobile submenu behavior
- Larger touch targets
- Preserved desktop navigation

## Accessibility
- Skip-to-content link is hidden until keyboard focus
- Improved focus handling when the menu opens
- Correct mobile `aria-expanded` and `aria-hidden` states
- Reduced-motion support
- Menu returns focus to the hamburger after Escape

## Technical
- Added `assets/v67.css`
- Added `assets/v67.js`
- Updated service-worker cache to `oatf-v6.7`
- Preserved all V6.6 fair layout, SEO, accessibility and performance upgrades

## Deployment
Upload the contents of this ZIP directly to the root of the staging GitHub repository.
After deploying, refresh the live site twice or clear Safari website data once so the previous service-worker cache is replaced.
