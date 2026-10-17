import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface TagProps {
  children: ReactNode
  tone?: 'neutral' | 'brand'
  className?: string
}

export function Tag({ children, tone = 'neutral', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        tone === 'brand'
          ? 'bg-brand-50 text-brand-700'
          : 'bg-zinc-100 text-zinc-600',
        className,
      )}
    >
      {children}
    </span>
  )
}
