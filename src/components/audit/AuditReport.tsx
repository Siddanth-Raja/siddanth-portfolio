import type { AuditReport as AuditReportData } from '../../types/audit'
import { AuditCover } from './AuditCover'
import { AuditSection } from './AuditSection'
import { PriorityMatrix } from './PriorityMatrix'
import { ScoreCard } from './ScoreCard'

type AuditReportProps = {
  report: AuditReportData
}

export function AuditReport({ report }: AuditReportProps) {
  return (
    <main className="audit-report-shell">
      <button className="audit-print-button screen-only" type="button" onClick={() => window.print()}>
        Print / Save PDF
      </button>

      <div className="audit-ambient audit-ambient-one" />
      <div className="audit-ambient audit-ambient-two" />
      <div className="audit-grid-glow" />

      <article className="audit-report">
        <AuditCover report={report} />

        <AuditSection
          eyebrow="Executive Summary"
          title={report.executiveSummary.heading}
          titleId="executive-summary"
          className="audit-page-balanced"
        >
          <div className="audit-summary-layout">
            <ScoreCard
              label="Directional Score"
              score={report.overallScore}
              suffix="/ 100"
              variant="large"
            />
            <div className="audit-summary-copy">
              <p>{report.executiveSummary.body}</p>
            </div>
          </div>
          <p className="audit-score-disclaimer">
            Scores are directional assessments from the supplied business context, not analytics measurements.
          </p>
          <div className="audit-card-grid audit-card-grid-four">
            {report.summaryCards.map((card) => (
              <article className="audit-card" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.detail}</p>
              </article>
            ))}
          </div>
        </AuditSection>

        <AuditSection
          eyebrow="First Impression Review"
          title="What a visitor is likely to notice first."
          titleId="first-impression"
          className="audit-page-balanced"
        >
          <div className="audit-score-row">
            {report.firstImpressionScores.map((item) => (
              <ScoreCard key={item.label} label={item.label} score={item.score} note={item.note} />
            ))}
          </div>
          <p className="audit-score-disclaimer">Directional assessment based on supplied context.</p>
          <div className="audit-observation-list">
            {report.firstImpressionFindings.map((finding) => (
              <article className="audit-observation" key={finding.noticed}>
                <div>
                  <span>What I noticed</span>
                  <p>{finding.noticed}</p>
                </div>
                <div>
                  <span>Why it matters</span>
                  <p>{finding.matters}</p>
                </div>
                <div>
                  <span>What I'd do instead</span>
                  <p>{finding.instead}</p>
                </div>
              </article>
            ))}
          </div>
        </AuditSection>

        <AuditSection
          eyebrow="Customer Journey"
          title={report.customerJourney.heading}
          titleId="customer-journey"
          className="audit-page-balanced"
        >
          <div className="audit-journey-flow" aria-label="Customer journey from search to new customer">
            {report.customerJourney.steps.map((step, index) => (
              <div className="audit-journey-step" key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
          <div className="audit-friction-panel">
            <h3>Potential friction points</h3>
            <ul>
              {report.customerJourney.frictionPoints.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </AuditSection>

        <AuditSection
          eyebrow="Conversion Opportunities"
          title="Practical fixes that can turn more visitors into inquiries and action."
          titleId="conversion-opportunities"
        >
          <div className="audit-opportunity-grid">
            {report.conversionOpportunities.map((item) => (
              <article className="audit-opportunity-card" key={item.title}>
                <div className="audit-card-kicker">
                  <span>Impact</span>
                  <strong>{item.impact}</strong>
                </div>
                <h3>{item.title}</h3>
                <div className="audit-recommendation">
                  <span>What I noticed</span>
                  <p>{item.noticed}</p>
                </div>
                <div className="audit-recommendation">
                  <span>Why it matters</span>
                  <p>{item.matters}</p>
                </div>
                <div className="audit-recommendation">
                  <span>What I'd do instead</span>
                  <p>{item.instead}</p>
                </div>
              </article>
            ))}
          </div>
        </AuditSection>

        <AuditSection
          eyebrow="AI Opportunities"
          title="Simple ways AI could save time and recover inquiries."
          titleId="ai-opportunities"
          className="audit-page-balanced"
        >
          <div className="audit-ai-list">
            {report.aiOpportunities.map((item) => (
              <article className="audit-ai-card" key={item.title}>
                <div>
                  <h3>{item.title}</h3>
                  <span>Difficulty level: {item.difficulty}</span>
                </div>
                <div>
                  <strong>What it does</strong>
                  <p>{item.does}</p>
                </div>
                <div>
                  <strong>Why it helps</strong>
                  <p>{item.helps}</p>
                </div>
              </article>
            ))}
          </div>
        </AuditSection>

        <AuditSection
          eyebrow="Priority Matrix"
          title="What to fix first."
          titleId="priority-matrix"
          className="audit-page-balanced"
        >
          <PriorityMatrix quadrants={report.priorityMatrix} />
        </AuditSection>

        <AuditSection
          eyebrow="Recommended Next Steps"
          title="A simple order of action."
          titleId="recommended-next-steps"
          className="audit-page-balanced"
        >
          <div className="audit-next-steps">
            {report.recommendedNextSteps.map((group) => (
              <article className="audit-next-step-card" key={group.label}>
                <h3>{group.label}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </AuditSection>

        <section className="audit-page audit-page-balanced audit-final-note" aria-labelledby="final-note">
          <p className="audit-eyebrow">Final Note</p>
          <h2 id="final-note">{report.finalNote.heading}</h2>
          <div className="audit-letter">
            {report.finalNote.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="audit-signature">
            <strong>{report.finalNote.signatureName}</strong>
            <span>{report.finalNote.signatureTitle}</span>
          </div>
        </section>
      </article>
    </main>
  )
}
