import type { ButtonHTMLAttributes } from 'react'

/**
 * The app's main action button: a `primary` pill with `on-primary` text, so the label stays readable in
 * light and dark mode. Disabled buttons use `primary-container` with supporting text.
 */
export function LabButton({ className = '', type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-on-primary ' +
        'transition-opacity hover:opacity-90 active:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ' +
        'disabled:cursor-not-allowed disabled:bg-primary-container disabled:text-on-surface-variant disabled:opacity-100 ' +
        className
      }
      {...props}
    />
  )
}
