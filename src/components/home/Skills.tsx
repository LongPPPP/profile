import { Code2, Sparkles, Wrench } from 'lucide-react'
import { useSiteData } from '../../context/SiteDataContext'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'
import { Tag } from '../ui/Tag'

const icons = [Code2, Wrench, Sparkles]

export function Skills() {
  const { data } = useSiteData()

  if (data.profile.skills.length === 0) return null

  return (
    <section className="border-y border-zinc-200 bg-white py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="技能"
            title="我正在使用和持续学习的技术。"
            description="从页面实现到工程化工具，保持对新技术的好奇，也重视把基础打牢。"
          />
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.profile.skills.map((group, index) => {
            const Icon = icons[index % icons.length] ?? Code2
            return (
              <Reveal key={group.category} delay={index * 80}>
                <div className="card card-hover h-full p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon size={19} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-zinc-900">
                    {group.category}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
