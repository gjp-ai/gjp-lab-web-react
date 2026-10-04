/**
 * The GJP Lab brand mark: a round field with a flask-shaped cutout and liquid, drawn on the same 108-unit
 * grid and paths as the iOS LabMark. It takes its colour from `currentColor` and is decorative.
 */
export function LabMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 108 108" className={className} aria-hidden="true" focusable="false">
      {/* The field with the flask cut out (even-odd fill leaves the flask transparent). */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M54 20A34 34 0 1 1 54 88A34 34 0 1 1 54 20Z M46 32H62V46L74 68C78 76 73 82 66 82H42C35 82 30 76 34 68L46 46Z"
      />
      {/* The liquid inside the flask. */}
      <path fill="currentColor" d="M39 65C47 61 54 69 69 64L73 71C75 75 72 78 66 78H42C38 78 35 75 37 71Z" />
    </svg>
  )
}
