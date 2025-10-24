# GitHub Pages Deployment Guide

## Automatic Deployment (Recommended)

This repository is configured to automatically deploy to GitHub Pages when you push to the main branch.

### Setup Steps:

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Click on **Settings** → **Pages**
   - Under "Build and deployment":
     - Source: Select **GitHub Actions**
   - Save the settings

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Configure GitHub Pages deployment"
   git push origin main
   ```

3. **Wait for deployment:**
   - Go to the **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow run
   - Once complete, your site will be live at: `https://twistedsyd.github.io/chuckwalla/`

## Manual Deployment

If you prefer to deploy manually:

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to GitHub Pages:**
   - You can use tools like `gh-pages` package:
   ```bash
   npm install -g gh-pages
   gh-pages -d dist
   ```

## Configuration Details

- **Base Path:** Configured in `vite.config.js` as `/chuckwalla/`
- **Build Output:** `dist` directory
- **Jekyll:** Disabled via `.nojekyll` file in `public` directory

## Troubleshooting

### MIME Type Errors
If you see errors like "disallowed MIME type", ensure:
- The base path in `vite.config.js` matches your repository name
- The `.nojekyll` file exists in the `public` directory
- GitHub Pages is set to deploy from GitHub Actions (not gh-pages branch)

### 404 Errors on Refresh
Single Page Applications (SPA) may encounter 404 errors on direct URL access. GitHub Pages serves static files, so routes need to be handled client-side. The app uses hash routing which should work correctly.

## Local Testing

To test the production build locally:
```bash
npm run build
npm run preview
```

This will serve the production build on a local server.
