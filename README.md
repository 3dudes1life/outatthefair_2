# Out at the Fair — Version 2 Preview

This repository is a staging preview for the future GitHub-hosted Out at the Fair website.

## Safe preview setup

- This package intentionally does **not** include a `CNAME` file.
- It will publish only at the GitHub project URL, such as:
  `https://3dudes1life.github.io/outatthefair_2/`
- The current Wix-hosted `outatthefair.com` site remains untouched.

## Publish on GitHub Pages

1. Replace the existing repository contents with everything in this package.
2. Commit the files to `main`.
3. In **Settings → Pages**, use **Deploy from a branch**, `main`, `/ (root)`.
4. Do not enter `outatthefair.com` as the custom domain during the preview stage.

All internal links use project-relative paths, so navigation works correctly under the `/outatthefair_2/` preview URL.
