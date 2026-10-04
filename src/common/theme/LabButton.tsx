import type { ButtonHTMLAttributes } from 'react'

const variants = {
  primary: 'bg-primary text-on-primary hover:opacity-90 active:opacity-75',
  secondary: 'border border-outline-variant bg-surface text-on-surface hover:bg-surface-container active:opacity-75',
} as const

/**
 * The app's main action button: a `primary` pill with `on-primary` text, so the label stays readable in
 * light and dark mode. `variant="secondary"` is an outlined `surface` pill for the less important action
 * next to it. Disabled buttons use `primary-container` with supporting text.
 */
export function LabButton({
  className = '',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }) {
  return (
    <button
      type={type}
      className={
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 font-semibold transition-opacity ' +
        variants[variant] +
        ' focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
        'disabled:cursor-not-allowed disabled:border-transparent disabled:bg-primary-container disabled:text-on-surface-variant disabled:opacity-100 ' +
        className
      }
      {...props}
    />
  )
}
