import { Download, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { NAV_ITEMS, SITE_CONFIG } from '../../config'
import { useSiteData } from '../../context/SiteDataContext'
import { useMediaUrl } from '../../hooks/useMediaUrl'
import { cn } from '../../lib/utils'

export function Navbar() {
  const { data, mediaState } = useSiteData()
  const resumeUrl = useMediaUrl('resume', SITE_CONFIG.defaultResume)
  const resumeName = mediaState.resume?.name ?? SITE_CONFIG.defaultResumeName
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/' && location.hash !== '#about'
    }
    if (href === '/#about') {
      return location.pathname === '/' && location.hash === '#about'
    }
    return location.pathname === href || location.pathname.startsWith(`${href}/`)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-[#fafafa]/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          to="/"
          className="group flex items-center gap-2 text-base font-semibold tracking-tight text-zinc-900"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white transition group-hover:bg-brand-600">
            {data.profile.name.slice(0, 1).toUpperCase()}
          </span>
          <span>{data.profile.name}</span>
          <span className="text-brand-600">.</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition',
                isActive(item.href)
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900',
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={resumeUrl}
            download={resumeName}
            className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-800 transition hover:border-zinc-400 hover:bg-zinc-50"
          >
            <Download size={15} />
            简历
          </a>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-700 transition hover:bg-zinc-100 md:hidden"
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-zinc-200 bg-[#fafafa] md:hidden">
          <nav className="container-page flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive(item.href)
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-700 hover:bg-zinc-100',
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={resumeUrl}
              download={resumeName}
              className="mt-1 inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              <Download size={16} />
              下载简历
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
