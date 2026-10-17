import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)

    // 兜底：锚点跳转或程序化滚动可能直接越过元素，导致 IntersectionObserver 错过。
    // 只要元素进入过视口上方或内部，就保持可见，避免内容永久透明。
    const revealIfReached = () => {
      if (node.getBoundingClientRect().top < window.innerHeight) {
        setVisible(true)
        observer.disconnect()
        window.removeEventListener('scroll', revealIfReached)
      }
    }

    window.addEventListener('scroll', revealIfReached, { passive: true })
    const frame = window.requestAnimationFrame(revealIfReached)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', revealIfReached)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn('reveal', visible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
