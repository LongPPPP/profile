import { useSiteData } from '../context/SiteDataContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { BlogCard } from '../components/blog/BlogCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Reveal } from '../components/ui/Reveal'

export function BlogListPage() {
  usePageTitle('博客')
  const { data } = useSiteData()
  const posts = [...data.blog].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="container-page py-16 sm:py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Blog
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          文章与思考
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
          记录前端开发、工程化实践，以及我在学习和做项目过程中的一些想法。
        </p>
      </Reveal>

      {posts.length > 0 ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={Math.min(index, 5) * 60}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="还没有文章"
            description="在管理后台发布文章后，这里会自动展示。"
          />
        </div>
      )}
    </div>
  )
}
