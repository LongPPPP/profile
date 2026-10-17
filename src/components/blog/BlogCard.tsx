import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { BlogPost } from '../../types'
import { formatShortDate, readingTime } from '../../lib/utils'
import { Tag } from '../ui/Tag'

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="card card-hover flex h-full flex-col p-6">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <time dateTime={post.date}>{formatShortDate(post.date)}</time>
        <span aria-hidden="true">·</span>
        <span>约 {readingTime(post.content)} 分钟</span>
      </div>

      <h3 className="mt-3 text-lg font-semibold tracking-tight text-zinc-900">
        <Link
          to={`/blog/${post.slug}`}
          className="underline-offset-4 hover:underline"
        >
          {post.title}
        </Link>
      </h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
        {post.summary}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>

      <Link
        to={`/blog/${post.slug}`}
        className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-zinc-900 transition hover:text-brand-600"
      >
        阅读全文
        <ArrowUpRight size={15} />
      </Link>
    </article>
  )
}
