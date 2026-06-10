import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  size?: 'default' | 'small'
  variant?: 'primary' | 'secondary'
}

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
