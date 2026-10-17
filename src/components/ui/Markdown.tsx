import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn, isExternalUrl } from '../../lib/utils'

interface MarkdownProps {
  content: string
  className?: string
}

export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        'prose prose-zinc max-w-none prose-headings:scroll-mt-24 prose-p:leading-7',
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, href, children, ...props }) => {
            void node
            const external = href ? isExternalUrl(href) : false
            return (
              <a
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer noopener' : undefined}
                {...props}
              >
                {children}
              </a>
            )
          },
          img: ({ node, src, alt, ...props }) => {
            void node
            return (
              <img
                src={typeof src === 'string' ? src : undefined}
                alt={alt ?? ''}
                loading="lazy"
                {...props}
              />
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
