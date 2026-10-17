import { ArrowUpRight } from 'lucide-react'
import { Github } from '../ui/GithubIcon'
import { Link } from 'react-router-dom'
import type { Project } from '../../types'
import { Tag } from '../ui/Tag'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card card-hover flex h-full flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            {project.period || '项目'}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-zinc-900">
            <Link
              to={`/projects/${project.slug}`}
              className="underline-offset-4 hover:underline"
            >
              {project.title}
            </Link>
          </h3>
        </div>
        {project.featured ? <Tag tone="brand">精选</Tag> : null}
      </div>

      <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
        {project.summary}
      </p>

      {project.tech.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-zinc-900 transition hover:text-brand-600"
        >
          查看详情
          <ArrowUpRight size={15} />
        </Link>
        <div className="flex items-center gap-3 text-zinc-400">
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${project.title} 的 GitHub 仓库`}
              className="transition hover:text-zinc-900"
            >
              <Github size={16} />
            </a>
          ) : null}
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${project.title} 的在线地址`}
              className="transition hover:text-zinc-900"
            >
              <ArrowUpRight size={16} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  )
}
