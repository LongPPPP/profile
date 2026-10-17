import { ArrowRight, Download, MapPin, Mail } from 'lucide-react'
import { Github } from '../ui/GithubIcon'
import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '../../config'
import { useSiteData } from '../../context/SiteDataContext'
import { useMediaUrl } from '../../hooks/useMediaUrl'
import { Reveal } from '../ui/Reveal'

export function Hero() {
  const { data, mediaState } = useSiteData()
  const { profile } = data
  const avatarUrl = useMediaUrl('avatar', SITE_CONFIG.defaultAvatar)
  const resumeUrl = useMediaUrl('resume', SITE_CONFIG.defaultResume)
  const resumeName = mediaState.resume?.name ?? SITE_CONFIG.defaultResumeName

  return (
    <section className="relative overflow-hidden">
      <div
        className="hero-grid pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-80 w-80 rounded-full bg-brand-100/70 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative grid gap-14 py-20 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              开放实习与合作机会
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.08] tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
              你好，我是
              <br />
              <span className="font-serif italic text-brand-600">
                {profile.englishName || profile.name}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 text-lg font-medium text-zinc-800 sm:text-xl">
              {profile.role}
            </p>
            <p className="mt-3 max-w-xl text-base leading-7 text-zinc-600">
              {profile.tagline}
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={15} />
                {profile.location}
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 transition hover:text-zinc-900"
              >
                <Mail size={15} />
                {profile.email}
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 transition hover:text-zinc-900"
              >
                <Github size={15} />
                GitHub
              </a>
            </div>
          </Reveal>

          <Reveal delay={260}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/projects" className="btn-primary">
                查看项目
                <ArrowRight size={16} />
              </Link>
              <a
                href={resumeUrl}
                download={resumeName}
                className="btn-secondary"
              >
                <Download size={16} />
                下载简历
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={220} className="relative mx-auto w-full max-w-sm">
          <div
            className="absolute inset-0 -rotate-3 rounded-[2rem] bg-gradient-to-br from-brand-100 via-white to-zinc-100"
            aria-hidden="true"
          />
          <div className="relative rounded-[2rem] border border-zinc-200 bg-white p-3 shadow-xl shadow-zinc-200/60">
            <img
              src={avatarUrl}
              alt={`${profile.name} 的头像`}
              className="aspect-square w-full rounded-[1.6rem] bg-zinc-100 object-cover"
            />
            <div className="flex items-center justify-between px-3 pb-1 pt-4">
              <div>
                <p className="text-sm font-semibold text-zinc-900">
                  {profile.name}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">
                  {profile.location}
                </p>
              </div>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="访问 GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white transition hover:bg-brand-600"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          <div className="absolute -left-5 bottom-20 hidden rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 text-xs font-medium text-zinc-600 shadow-lg backdrop-blur sm:block">
            React · TypeScript · Vite
          </div>
        </Reveal>
      </div>
    </section>
  )
}
