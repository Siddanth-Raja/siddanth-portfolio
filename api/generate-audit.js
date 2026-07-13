import { handleGenerateAuditRequest } from '../server/auditGeneration.js'

export default async function handler(req, res) {
  await handleGenerateAuditRequest(req, res, process.env)
}
