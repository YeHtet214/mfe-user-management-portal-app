import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isGitHubActions && repositoryName ? `/${repositoryName}/` : '/',
  server: {
    host: 'user.laravel-api-for-microfrontend.test',
    port: 5174,
    strictPort: true,
    allowedHosts: ['user.laravel-api-for-microfrontend.test', 'auth.laravel-api-for-microfrontend.test'],
  },
})
