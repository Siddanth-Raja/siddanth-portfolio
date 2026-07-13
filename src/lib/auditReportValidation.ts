import type { AuditReport } from '../types/audit'

export function sanitizeAuditReport(value: unknown): AuditReport | null {
  if (!isRecord(value)) return null

  const report = {
    businessName: cleanString(value.businessName),
    websiteUrl: cleanString(value.websiteUrl),
    industry: cleanString(value.industry),
    preparedBy: cleanString(value.preparedBy),
    date: cleanString(value.date),
    overallScore: sanitizeScoreNumber(value.overallScore),
    executiveSummary: sanitizeExecutiveSummary(value.executiveSummary),
    summaryCards: sanitizeArray(value.summaryCards, sanitizeSummaryCard, 4, 4),
    firstImpressionScores: sanitizeArray(value.firstImpressionScores, sanitizeScore, 3, 3),
    firstImpressionFindings: sanitizeArray(value.firstImpressionFindings, sanitizeFinding, 3, 3),
    customerJourney: sanitizeCustomerJourney(value.customerJourney),
    conversionOpportunities: sanitizeArray(
      value.conversionOpportunities,
      sanitizeConversionOpportunity,
      4,
      4,
    ),
    aiOpportunities: sanitizeArray(value.aiOpportunities, sanitizeAiOpportunity, 5, 5),
    priorityMatrix: sanitizeArray(value.priorityMatrix, sanitizeListGroup, 4, 4),
    recommendedNextSteps: sanitizeArray(value.recommendedNextSteps, sanitizeListGroup, 3, 3),
    finalNote: sanitizeFinalNote(value.finalNote),
  }

  if (
    !report.businessName ||
    !report.websiteUrl ||
    !report.industry ||
    !report.preparedBy ||
    !report.date ||
    report.overallScore == null ||
    !report.executiveSummary ||
    !report.summaryCards ||
    !report.firstImpressionScores ||
    !report.firstImpressionFindings ||
    !report.customerJourney ||
    !report.conversionOpportunities ||
    !report.aiOpportunities ||
    !report.priorityMatrix ||
    !report.recommendedNextSteps ||
    !report.finalNote
  ) {
    return null
  }

  return report as AuditReport
}

function sanitizeExecutiveSummary(value: unknown) {
  if (!isRecord(value)) return null
  const heading = cleanString(value.heading, 180)
  const body = cleanString(value.body, 1200)
  return heading && body ? { heading, body } : null
}

function sanitizeSummaryCard(value: unknown) {
  if (!isRecord(value)) return null
  const title = cleanString(value.title, 80)
  const detail = cleanString(value.detail, 350)
  return title && detail ? { title, detail } : null
}

function sanitizeScore(value: unknown) {
  if (!isRecord(value)) return null
  const label = cleanString(value.label, 50)
  const score = cleanString(value.score, 20)
  const note = cleanString(value.note, 220)
  return label && score && note ? { label, score, note } : null
}

function sanitizeFinding(value: unknown) {
  if (!isRecord(value)) return null
  const noticed = cleanString(value.noticed, 450)
  const matters = cleanString(value.matters, 450)
  const instead = cleanString(value.instead, 450)
  return noticed && matters && instead ? { noticed, matters, instead } : null
}

function sanitizeCustomerJourney(value: unknown) {
  if (!isRecord(value)) return null
  const heading = cleanString(value.heading, 120)
  const steps = sanitizeStringArray(value.steps, 5, 5, 50)
  const frictionPoints = sanitizeStringArray(value.frictionPoints, 3, 3, 150)
  return heading && steps && frictionPoints ? { heading, steps, frictionPoints } : null
}

function sanitizeConversionOpportunity(value: unknown) {
  if (!isRecord(value)) return null
  const finding = sanitizeFinding(value)
  const title = cleanString(value.title, 100)
  const impact = cleanString(value.impact, 30)
  return title && impact && finding ? { title, impact, ...finding } : null
}

function sanitizeAiOpportunity(value: unknown) {
  if (!isRecord(value)) return null
  const title = cleanString(value.title, 100)
  const does = cleanString(value.does, 420)
  const helps = cleanString(value.helps, 420)
  const difficulty = cleanString(value.difficulty, 40)
  return title && does && helps && difficulty ? { title, does, helps, difficulty } : null
}

function sanitizeListGroup(value: unknown) {
  if (!isRecord(value)) return null
  const label = cleanString(value.label, 80)
  const items = sanitizeStringArray(value.items, 2, 4, 120)
  return label && items ? { label, items } : null
}

function sanitizeFinalNote(value: unknown) {
  if (!isRecord(value)) return null
  const heading = cleanString(value.heading, 160)
  const paragraphs = sanitizeStringArray(value.paragraphs, 3, 3, 240)
  const signatureName = cleanString(value.signatureName, 80)
  const signatureTitle = cleanString(value.signatureTitle, 80)
  return heading && paragraphs && signatureName && signatureTitle
    ? { heading, paragraphs, signatureName, signatureTitle }
    : null
}

function sanitizeArray<T>(
  value: unknown,
  sanitizer: (item: unknown) => T | null,
  min: number,
  max: number,
): T[] | null {
  if (!Array.isArray(value)) return null
  if (value.length < min || value.length > max) return null

  const items = value.map(sanitizer)
  return items.every((item): item is T => item != null) ? items : null
}

function sanitizeStringArray(value: unknown, min: number, max: number, itemMaxLength: number) {
  return sanitizeArray(value, (item) => cleanString(item, itemMaxLength) || null, min, max)
}

function cleanString(value: unknown, maxLength = 1000) {
  if (typeof value !== 'string') return ''
  const cleaned = value.replace(/\s+/g, ' ').trim()
  return cleaned.length <= maxLength ? cleaned : ''
}

function sanitizeScoreNumber(value: unknown) {
  const score = Number(value)
  if (!Number.isFinite(score) || score < 0 || score > 100) return null
  return Math.round(score)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null && !Array.isArray(value)
}
