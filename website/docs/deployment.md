---
id: deployment
sidebar_position: 99
title: Deployment
---

## GitHub Pages

This site is configured to deploy to GitHub Pages.

### 1. Build

```bash
cd website
npm install
npm run build
```

### 2. Deploy

```bash
npm run deploy
```

This runs `docusaurus deploy`, building the site and pushing the static files to the `gh-pages` branch.

Ensure repository settings have Pages pointing to `gh-pages` branch (root).

## Custom Domain

If you add a `CNAME` file under `static/` with your domain, GitHub Pages will use it. Update `url` and maybe `baseUrl` in `docusaurus.config.ts`.

## CI Suggestion

Add a GitHub Actions workflow:

```yaml
name: Docs
on:
  push:
    branches: [main]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: cd website && npm ci && npm run build
      - name: Deploy
        run: cd website && GIT_USER="github-actions" npm run deploy
        env:
          GIT_USER: github-actions
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Troubleshooting

- 404s: Check `baseUrl` matches repo name.
- Mixed content: Update `url` to https.
- Cache: Force refresh or invalidate if using CDN.
