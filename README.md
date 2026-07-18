# Out at the Fair® — GitHub Pages Website

A static, responsive replacement for the current Wix website, prepared for the post-2026 / 2027 season.

## Included pages

- Home
- California Fairs directory
- Riverside County Fair
- San Diego County Fair
- Orange County Fair
- Photos archive
- Participate
- Contact
- Our Pennants
- Giveaways
- 404 page and legacy redirects

The existing public URL paths are preserved (`/sdfair`, `/orangecountyfair`, `/riversidecountyfair`, etc.) so old links and search results continue working.

## Publish on GitHub Pages

1. Create a new public GitHub repository, or clear the files from the intended repository.
2. Upload **the contents of this folder** to the repository root — not the outer folder itself.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. The included `CNAME` file requests `outatthefair.com` as the custom domain.

## Domain move

Do not change DNS until the GitHub Pages deployment works at its temporary `github.io` address. After that, point the domain to GitHub Pages and verify the custom domain in repository settings.

Typical apex-domain A records for GitHub Pages are:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

For `www`, use a CNAME to `<your-github-username>.github.io`.

Confirm GitHub's current DNS instructions before changing records.

## Brand assets

To preserve the exact official branding, this first build references the existing official OATF logo, mascot, award and fair images from Wix's static image host. Before permanently deleting the Wix account or its media library, download the original image files and replace those remote image URLs with local files in `/assets/`.

## Editing 2027 information

Search the HTML files for `2027 details coming soon` and replace the placeholder sections as fair dates and schedules are confirmed.
