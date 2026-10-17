import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Github } from '../components/ui/GithubIcon'
import { Link, useParams } from 'react-router-dom'
import { useSiteData } from '../context/SiteDataContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { Markdown } from '../components/ui/Markdown'
import { Tag } from '../components/ui/Tag'
import { NotFoundPage } from './NotFoundPage'

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data } = useSiteData()
  const project = data.projects.find((item) => item.slug === slug)
  usePageTitle(project?.title ?? '项目不存在')

  if (!project) return <NotFoundPage />

  return (
    <div className="container-page py-16 sm:py-20">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
      >
        <ArrowLeft size={15} />
        返回项目列表
      </Link>

      <header className="mt-8 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span className="font-medium uppercase tracking-wider">
            {project.period || '项目'}
          </span>
          {project.featured ? <Tag tone="brand">精选</Tag> : null}
        </div>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          {project.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          {project.summary}
        </p>

        {project.tech.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.tech.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </div>
        ) : null}

        {project.link || project.repo ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.link ? (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-primary"
              >
                访问项目
                <ArrowUpRight size={16} />
              </a>
            ) : null}
            {project.repo ? (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-secondary"
              >
                <Github size={16} />
                查看源码
              </a>
            ) : null}
          </div>
        ) : null}
      </header>

      <div className="mt-10 max-w-3xl border-t border-zinc-200 pt-10">
        <Markdown content={project.content} />
      </div>
    </div>
  )
}
