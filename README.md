# User Management Portal (Vite + React + TypeScript)

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Actions deployment

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml` that:

1. Installs dependencies with `npm ci`
2. Builds the app with `npm run build:ci`
3. Publishes `dist/` to GitHub Pages

### Enable GitHub Pages

1. Push to the `main` branch.
2. In GitHub, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. After the workflow finishes, your app is available at:
   `https://<your-org-or-user>.github.io/<repo-name>/`

The Vite `base` path is automatically configured for GitHub Actions deployments using the repository name.
