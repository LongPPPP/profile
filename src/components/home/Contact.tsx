import { Check, Copy, Mail } from 'lucide-react'
import { Github } from '../ui/GithubIcon'
import { useState } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import { Reveal } from '../ui/Reveal'

export function Contact() {
  const { data } = useSiteData()
  const { profile } = data
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className="py-20 sm:py-24">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-6 py-14 text-center sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-brand-400/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
                Contact
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                让我们一起做点有意思的东西
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                如果你对我的项目感兴趣，或者想聊聊前端、AI 与产品，欢迎随时发邮件给我。
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={`mailto:${profile.email}`}
                  className="btn bg-white text-zinc-900 hover:bg-zinc-100"
                >
                  <Mail size={16} />
                  {profile.email}
                </a>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800"
                >
                  <Github size={16} />
                  GitHub
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="btn border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? '已复制' : '复制邮箱'}
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
