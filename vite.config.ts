import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Minimal declaration so this config can read build-time environment variables
// without adding @types/node as a dependency of the application.
declare const process: { env: Record<string, string | undefined> }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Deployment targets need different base paths:
  //   - GitHub Pages serves this project from a subdirectory
  //     (https://<owner>.github.io/federated-analytics-ontology/), so assets must
  //     be prefixed with the repository name or they 404 and the page renders blank.
  //   - Vercel and local dev serve from the domain root, which needs '/'.
  // GITHUB_ACTIONS is set automatically inside GitHub Actions runners and
  // nowhere else, so both targets can be supported at the same time.
  // Do not remove this without checking both deployments.
  // NOTE: this must match the repository name exactly. If the repo is renamed,
  // update this at the same time or GitHub Pages will serve a blank page.
  base: process.env.GITHUB_ACTIONS ? '/federated-analytics-ontology/' : '/',
})
