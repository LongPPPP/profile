import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../../context/SiteDataContext'
import { BlogCard } from '../blog/BlogCard'
import { EmptyState } from '../ui/EmptyState'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function LatestPosts() {
  const { data } = useSiteData()
  const posts = [...data.blog]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)

  return (
    <section className="border-y border-zinc-200 bg-white py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="博客"
              title="记录一些思考和学习过程。"
              description="关于前端、工程化，以及我如何使用 AI 完成开发。"
            />
            <Link
              to="/blog"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-zinc-900 transition hover:text-brand-600"
            >
              查看全部文章
              <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        {posts.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Reveal key={post.slug} delay={index * 80}>
                <BlogCard post={post} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="还没有文章"
              description="在管理后台发布第一篇文章后，这里会自动展示。"
            />
          </div>
        )}
      </div>
    </section>
  )
}
