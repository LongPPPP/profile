import {
  ArrowLeft,
  Database,
  FileText,
  FolderKanban,
  Image,
  LogOut,
  User,
  Wrench,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

export type AdminTab =
  | 'profile'
  | 'skills'
  | 'projects'
  | 'blog'
  | 'media'
  | 'data'

const tabs: Array<{
  key: AdminTab
  label: string
  icon: typeof User
}> = [
  { key: 'profile', label: '基本信息', icon: User },
  { key: 'skills', label: '技能', icon: Wrench },
  { key: 'projects', label: '项目', icon: FolderKanban },
  { key: 'blog', label: '博客', icon: FileText },
  { key: 'media', label: '媒体文件', icon: Image },
  { key: 'data', label: '数据管理', icon: Database },
]

interface AdminLayoutProps {
  active: AdminTab
  onChange: (tab: AdminTab) => void
  onLogout: () => void
  children: ReactNode
}

export function AdminLayout({
  active,
  onChange,
  onLogout,
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-[#fafafa]/90 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
            >
              <ArrowLeft size={15} />
              返回网站
            </Link>
            <span className="h-4 w-px bg-zinc-200" aria-hidden="true" />
            <span className="text-sm font-semibold text-zinc-900">
              管理后台
            </span>
          </div>

          <button type="button" className="btn-ghost" onClick={onLogout}>
            <LogOut size={16} />
            退出登录
          </button>
        </div>
      </header>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside>
          <nav className="no-scrollbar flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => onChange(tab.key)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium transition lg:w-full',
                    active === tab.key
                      ? 'bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200'
                      : 'text-zinc-500 hover:bg-white hover:text-zinc-900',
                  )}
                >
                  <Icon size={17} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
          <p className="mt-4 hidden text-xs leading-5 text-zinc-400 lg:block">
            修改保存在当前浏览器，不会同步给其他访客。可在「数据管理」中导出备份。
          </p>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
