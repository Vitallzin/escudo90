import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonBase = {
  children: ReactNode
  size?: 'default' | 'small'
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark'
  className?: string
}

type ButtonProps = ButtonBase & ButtonHTMLAttributes<HTMLButtonElement>
type ButtonLinkProps = ButtonBase & AnchorHTMLAttributes<HTMLAnchorElement>

export function Button({
  children,
  size = 'default',
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button-${variant} button-${size} ${className}`.trim()}
      type="button"
      {...props}
    >
      {children}
    </button>
  )
}

export function ButtonLink({
  children,
  size = 'default',
  variant = 'primary',
  className = '',
  ...props
}: ButtonLinkProps) {
  return (
    <a className={`button button-${variant} button-${size} ${className}`.trim()} {...props}>
      {children}
    </a>
  )
}
