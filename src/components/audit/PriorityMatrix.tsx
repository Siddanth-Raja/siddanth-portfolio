import type { PriorityMatrixQuadrant } from '../../types/audit'

type PriorityMatrixProps = {
  quadrants: PriorityMatrixQuadrant[]
}

export function PriorityMatrix({ quadrants }: PriorityMatrixProps) {
  return (
    <div className="audit-matrix" aria-label="Priority matrix">
      {quadrants.map((quadrant) => (
        <article className="audit-matrix-quadrant" key={quadrant.label}>
          <h3>{quadrant.label}</h3>
          <ul>
            {quadrant.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
