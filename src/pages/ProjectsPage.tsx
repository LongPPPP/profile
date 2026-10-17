import { useSiteData } from '../context/SiteDataContext'
import { usePageTitle } from '../hooks/usePageTitle'
import { ProjectCard } from '../components/projects/ProjectCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Reveal } from '../components/ui/Reveal'

export function ProjectsPage() {
  usePageTitle('项目')
  const { data } = useSiteData()
  const projects = [...data.projects].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  )

  return (
    <div className="container-page py-16 sm:py-20">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
          Projects
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
          我做过的项目
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
          这里收录了我参与或独立完成的项目。每个项目都包含背景、核心功能和技术要点。
        </p>
      </Reveal>

      {projects.length > 0 ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={Math.min(index, 5) * 60}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            title="还没有项目"
            description="在管理后台添加项目后，这里会自动展示。"
          />
        </div>
      )}
    </div>
  )
}
