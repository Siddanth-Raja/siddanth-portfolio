type ScoreCardProps = {
  label: string
  score: number | string
  note?: string
  suffix?: string
  variant?: 'large' | 'mini'
}

export function ScoreCard({ label, score, note, suffix, variant = 'mini' }: ScoreCardProps) {
  if (variant === 'large') {
    return (
      <div className="audit-score-card">
        <span>{label}</span>
        <strong>{score}</strong>
        {suffix ? <small>{suffix}</small> : null}
      </div>
    )
  }

  return (
    <article className="audit-mini-score">
      <span>{label}</span>
      <strong>{score}</strong>
      {note ? <p>{note}</p> : null}
    </article>
  )
}
