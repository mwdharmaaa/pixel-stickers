import React from 'react'

interface BadgeProps {
  label: string
  variant?: 'default' | 'accent' | 'success' | 'outline'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'sm',
}) => {
  const variantStyles = {
    default: 'bg-[#1e2230] text-[#9aa1b8] border-[#2d3246]',
    accent: 'bg-[#ff6b9d]/15 text-[#ff6b9d] border-[#ff6b9d]/30',
    success: 'bg-[#2ed573]/15 text-[#2ed573] border-[#2ed573]/30',
    outline: 'bg-transparent text-[#656b82] border-[#272a3a]',
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  }

  return (
    <span
      className={`inline-flex items-center rounded-md border tracking-wide uppercase transition-colors ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {label}
    </span>
  )
}
