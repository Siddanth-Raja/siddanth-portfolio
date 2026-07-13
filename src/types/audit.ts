export type AuditSummaryCard = {
  title: string
  detail: string
}

export type AuditScore = {
  label: string
  score: string
  note: string
}

export type AuditFinding = {
  noticed: string
  matters: string
  instead: string
}

export type CustomerJourney = {
  heading: string
  steps: string[]
  frictionPoints: string[]
}

export type ConversionOpportunity = AuditFinding & {
  title: string
  impact: string
}

export type AiOpportunity = {
  title: string
  does: string
  helps: string
  difficulty: string
}

export type PriorityMatrixQuadrant = {
  label: string
  items: string[]
}

export type RecommendedNextStep = {
  label: string
  items: string[]
}

export type FinalNote = {
  heading: string
  paragraphs: string[]
  signatureName: string
  signatureTitle: string
}

export type AuditReport = {
  businessName: string
  websiteUrl: string
  industry: string
  preparedBy: string
  date: string
  overallScore: number
  executiveSummary: {
    heading: string
    body: string
  }
  summaryCards: AuditSummaryCard[]
  firstImpressionScores: AuditScore[]
  firstImpressionFindings: AuditFinding[]
  customerJourney: CustomerJourney
  conversionOpportunities: ConversionOpportunity[]
  aiOpportunities: AiOpportunity[]
  priorityMatrix: PriorityMatrixQuadrant[]
  recommendedNextSteps: RecommendedNextStep[]
  finalNote: FinalNote
}
