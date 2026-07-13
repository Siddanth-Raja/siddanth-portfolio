import type { AuditReport as AuditReportData } from '../../types/audit'

type AuditCoverProps = {
  report: AuditReportData
}

export function AuditCover({ report }: AuditCoverProps) {
  return (
    <section className="audit-page audit-cover" aria-labelledby="audit-cover-title">
      <div className="audit-cover-meta">
        <span>{report.industry}</span>
        <span>{report.date}</span>
      </div>
      <div className="audit-cover-content">
        <p className="audit-eyebrow">AI Growth Audit</p>
        <h1 id="audit-cover-title">AI Growth Audit</h1>
        <p className="audit-cover-line">Prepared for {report.businessName}</p>
        <p className="audit-cover-site">{report.websiteUrl}</p>
        <p className="audit-cover-tagline">
          A practical review of your website, customer journey, and AI automation opportunities.
        </p>
      </div>
      <div className="audit-cover-footer">
        <span>Prepared by {report.preparedBy}</span>
        <span>{report.date}</span>
      </div>
    </section>
  )
}
