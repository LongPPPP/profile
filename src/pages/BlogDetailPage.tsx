import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Markdown } from '../components/ui/Markdown'
import { Tag } from '../components/ui/Tag'
import { useSiteData } from '../context/SiteDataContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { formatDate, readingTime } from '../lib/utils'
import { NotFoundPage } from './NotFoundPage'

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data } = useSiteData()
  const post = data.blog.find((item) => item.slug === slug)
  usePageTitle(post?.title ?? '文章不存在')

  if (!post) return <NotFoundPage />

  return (
    <div className="container-page py-16 sm:py-20">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
      >
        <ArrowLeft size={15} />
        返回博客列表
      </Link>

      <article className="mt-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>约 {readingTime(post.content)} 分钟阅读</span>
        </div>

        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          {post.title}
        </h1>

        {post.summary ? (
          <p className="mt-4 text-base leading-7 text-zinc-600">
            {post.summary}
          </p>
        ) : null}

        {post.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        ) : null}

        <div className="mt-10 border-t border-zinc-200 pt-10">
          <Markdown content={post.content} />
        </div>
      </article>
    </div>
  )
}
