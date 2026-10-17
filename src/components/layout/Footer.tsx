import { Mail } from 'lucide-react'
import { Github } from '../ui/GithubIcon'
import { Link } from 'react-router-dom'
import { useSiteData } from '../../context/SiteDataContext'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  const { data } = useSiteData()
  const { profile } = data

  return (
    <footer className="mt-24 border-t border-zinc-200 bg-white">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold tracking-tight text-zinc-900">
            {profile.name}
            <span className="text-brand-600">.</span>
          </p>
          <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
            {profile.tagline}
          </p>
        </div>

        <div className="flex flex-col gap-4 text-sm text-zinc-500 md:items-end">
          <div className="flex items-center gap-4">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 transition hover:text-zinc-900"
            >
              <Mail size={15} />
              邮箱
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
          <p className="text-xs text-zinc-400">
            © {CURRENT_YEAR} {profile.name} · 使用 React + Vite 构建
          </p>
          <Link
            to="/admin"
            className="text-xs text-zinc-400 underline-offset-4 transition hover:text-zinc-600 hover:underline"
          >
            管理后台
          </Link>
        </div>
      </div>
    </footer>
  )
}
