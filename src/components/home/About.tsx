import { Globe, Mail, MapPin } from 'lucide-react'
import { Github } from '../ui/GithubIcon'
import { useSiteData } from '../../context/SiteDataContext'
import { Reveal } from '../ui/Reveal'
import { SectionHeading } from '../ui/SectionHeading'

export function About() {
  const { data } = useSiteData()
  const { profile } = data
  const paragraphs = profile.bio.split(/\n{2,}/).filter(Boolean)

  const facts = [
    { icon: MapPin, label: '所在地', value: profile.location },
    {
      icon: Mail,
      label: '邮箱',
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    { icon: Github, label: 'GitHub', value: 'LongPPPP', href: profile.github },
  ]

  if (profile.website) {
    facts.push({
      icon: Globe,
      label: '个人网站',
      value: profile.website.replace(/^https?:\/\//, ''),
      href: profile.website,
    })
  }

  return (
    <section id="about" className="scroll-mt-24 py-20 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="关于我"
            title="保持好奇，持续把想法做出来。"
            description="比起停留在概念，我更享受把一个功能从想法推进到可用产品的过程。"
          />
        </Reveal>

        <Reveal delay={100}>
          <div className="space-y-4 text-sm leading-7 text-zinc-600 sm:text-base">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            {facts.map((fact) => {
              const Icon = fact.icon
              const content = (
                <>
                  <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
                    <Icon size={14} />
                    {fact.label}
                  </dt>
                  <dd className="mt-1 truncate text-sm font-medium text-zinc-800">
                    {fact.value}
                  </dd>
                </>
              )

              return fact.href ? (
                <a
                  key={fact.label}
                  href={fact.href}
                  target={fact.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    fact.href.startsWith('http')
                      ? 'noreferrer noopener'
                      : undefined
                  }
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  {content}
                </a>
              ) : (
                <div
                  key={fact.label}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3"
                >
                  {content}
                </div>
              )
            })}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
