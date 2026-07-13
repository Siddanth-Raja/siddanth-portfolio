import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { handleGenerateAuditRequest } from './server/auditGeneration.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }

  return {
    plugins: [react(), auditGenerationApi(env)],
  }
})

function auditGenerationApi(env) {
  return {
    name: 'audit-generation-api',
    configureServer(server) {
      server.middlewares.use('/api/generate-audit', (req, res) => {
        handleGenerateAuditRequest(req, res, env)
      })
    },
  }
}
