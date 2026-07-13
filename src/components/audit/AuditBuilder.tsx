import { useState, type FormEvent } from 'react'
import { createAuditDraftFromInputs } from '../../data/sampleAuditReport'
import { sanitizeAuditReport } from '../../lib/auditReportValidation'
import type { AuditReport as AuditReportData } from '../../types/audit'

type AuditBuilderProps = {
  onGenerate: (report: AuditReportData) => void
}

type AuditBuilderForm = {
  businessName: string
  websiteUrl: string
  industry: string
  extraNotes: string
}

const initialForm: AuditBuilderForm = {
  businessName: 'Allen Family Dental',
  websiteUrl: 'allenfamilydental.com',
  industry: 'Dental Practice',
  extraNotes: '',
}

export function AuditBuilder({ onGenerate }: AuditBuilderProps) {
  const [form, setForm] = useState(initialForm)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [fallbackReport, setFallbackReport] = useState<AuditReportData | null>(null)

  function updateField(field: keyof AuditBuilderForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsGenerating(true)
    setError('')
    setFallbackReport(null)

    try {
      const response = await fetch('/api/generate-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload: unknown = await response.json()
      const report = extractReport(payload)

      if (!response.ok || !report) {
        const fallback = extractFallbackReport(payload) ?? createAuditDraftFromInputs(form)
        setFallbackReport(fallback)
        setError(extractError(payload) || 'I could not generate a clean AI draft yet.')
        return
      }

      onGenerate(report)
    } catch {
      setFallbackReport(createAuditDraftFromInputs(form))
      setError('The generator is unavailable right now. You can still use the sample fallback.')
    } finally {
      setIsGenerating(false)
    }
  }

  function useFallbackReport() {
    onGenerate(fallbackReport ?? createAuditDraftFromInputs(form))
  }

  return (
    <main className="audit-report-shell audit-builder-shell">
      <div className="audit-ambient audit-ambient-one" />
      <div className="audit-ambient audit-ambient-two" />
      <div className="audit-grid-glow" />

      <section className="audit-builder-panel" aria-labelledby="audit-builder-title">
        <div className="audit-builder-copy">
          <p className="audit-eyebrow">Internal Audit Builder</p>
          <h1 id="audit-builder-title">Generate an audit draft.</h1>
          <p>
            Enter the business basics, then generate a customized report draft. If AI generation is
            unavailable, the sample fallback still creates a usable preview.
          </p>
        </div>

        <form className="audit-builder-form" onSubmit={handleSubmit}>
          <label>
            Business name
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={(event) => updateField('businessName', event.target.value)}
              placeholder="Allen Family Dental"
            />
          </label>
          <label>
            Website URL
            <input
              type="text"
              name="websiteUrl"
              value={form.websiteUrl}
              onChange={(event) => updateField('websiteUrl', event.target.value)}
              placeholder="allenfamilydental.com"
            />
          </label>
          <label>
            Industry
            <input
              type="text"
              name="industry"
              value={form.industry}
              onChange={(event) => updateField('industry', event.target.value)}
              placeholder="Dental Practice"
            />
          </label>
          <label>
            Extra notes
            <textarea
              name="extraNotes"
              value={form.extraNotes}
              onChange={(event) => updateField('extraNotes', event.target.value)}
              placeholder="Add anything the draft should keep in mind..."
            />
          </label>
          {error ? (
            <div className="audit-builder-error" role="alert">
              <p>{error}</p>
              <button className="button secondary" type="button" onClick={useFallbackReport}>
                Use Sample Fallback
              </button>
            </div>
          ) : null}
          <button className="button primary" type="submit" disabled={isGenerating}>
            {isGenerating ? 'Generating Draft...' : 'Generate Audit Draft'}
          </button>
        </form>
      </section>
    </main>
  )
}

function extractReport(payload: unknown) {
  if (!isRecord(payload)) return null
  return sanitizeAuditReport(payload.report)
}

function extractFallbackReport(payload: unknown) {
  if (!isRecord(payload)) return null
  return sanitizeAuditReport(payload.fallbackReport)
}

function extractError(payload: unknown) {
  if (!isRecord(payload)) return ''

  if (typeof payload.errorReason === 'string') {
    return typeof payload.firstValidationError === 'string'
      ? `${payload.errorReason}: ${payload.firstValidationError}`
      : payload.errorReason
  }

  if (typeof payload.error !== 'string') return ''
  return payload.error
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value != null && !Array.isArray(value)
}
