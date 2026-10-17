import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSiteData } from '../../context/SiteDataContext'
import { ProjectCard } from '../projects/ProjectCard'
import { EmptyState } from '../ui/EmptyState'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function FeaturedProjects() {
  const { data } = useSiteData()
  const featured = [...data.projects]
    .filter((project) => project.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3)
  const projects = featured.length > 0 ? featured : data.projects.slice(0, 3)

  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="项目"
              title="一些我亲手做出来的东西。"
              description="从课程作业到个人工具，每个项目都记录了一次完整的问题解决过程。"
            />
            <Link
              to="/projects"
              className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-zinc-900 transition hover:text-brand-600"
            >
              查看全部项目
              <ArrowRight size={15} />
            </Link>
          </div>
        </Reveal>

        {projects.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.slug} delay={index * 80}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-10">
            <EmptyState
              title="还没有项目"
              description="在管理后台添加第一个项目后，这里会自动展示。"
            />
          </div>
        )}
      </div>
    </section>
  )
}
