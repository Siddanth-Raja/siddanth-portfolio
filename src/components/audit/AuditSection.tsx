import type { PropsWithChildren } from 'react'

type AuditSectionProps = PropsWithChildren<{
  eyebrow: string
  title: string
  titleId: string
  className?: string
}>

export function AuditSection({ eyebrow, title, titleId, className = '', children }: AuditSectionProps) {
  const sectionClassName = ['audit-page', className].filter(Boolean).join(' ')

  return (
    <section className={sectionClassName} aria-labelledby={titleId}>
      <div className="audit-section-heading">
        <p className="audit-eyebrow">{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
      </div>
      {children}
    </section>
  )
}
