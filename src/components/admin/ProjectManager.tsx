import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import { parseCommaList, slugify } from '../../lib/utils'
import type { Project } from '../../types'
import { EmptyState } from '../ui/EmptyState'
import { Tag } from '../ui/Tag'
import { Field, TextArea, TextInput } from './fields'
import { MarkdownEditor } from './MarkdownEditor'

interface Status {
  type: 'success' | 'error'
  text: string
}

interface ProjectDraft {
  title: string
  slug: string
  period: string
  summary: string
  tech: string
  link: string
  repo: string
  featured: boolean
  order: string
  content: string
}

function createDraft(order: number): ProjectDraft {
  return {
    title: '',
    slug: '',
    period: '',
    summary: '',
    tech: '',
    link: '',
    repo: '',
    featured: false,
    order: String(order),
    content: '',
  }
}

function toDraft(project: Project): ProjectDraft {
  return {
    title: project.title,
    slug: project.slug,
    period: project.period,
    summary: project.summary,
    tech: project.tech.join(', '),
    link: project.link ?? '',
    repo: project.repo ?? '',
    featured: project.featured,
    order: String(project.order),
    content: project.content,
  }
}

function toProject(draft: ProjectDraft): Project {
  return {
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    period: draft.period.trim(),
    summary: draft.summary.trim(),
    tech: parseCommaList(draft.tech),
    link: draft.link.trim() || undefined,
    repo: draft.repo.trim() || undefined,
    featured: draft.featured,
    order: Number(draft.order) || 0,
    content: draft.content,
  }
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

interface ProjectFormProps {
  initial: Project | null
  suggestedOrder: number
  existingSlugs: string[]
  onSave: (project: Project) => boolean
  onCancel: () => void
}

function ProjectForm({
  initial,
  suggestedOrder,
  existingSlugs,
  onSave,
  onCancel,
}: ProjectFormProps) {
  const [draft, setDraft] = useState<ProjectDraft>(() =>
    initial ? toDraft(initial) : createDraft(suggestedOrder),
  )
  const [slugTouched, setSlugTouched] = useState(Boolean(initial))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slugTouched && draft.title) {
      setDraft((previous) => ({ ...previous, slug: slugify(draft.title) }))
    }
  }, [draft.title, slugTouched])

  const update = <K extends keyof ProjectDraft>(
    key: K,
    value: ProjectDraft[K],
  ) => {
    setDraft((previous) => ({ ...previous, [key]: value }))
    setError('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!draft.title.trim()) {
      setError('项目标题不能为空')
      return
    }
    if (!draft.slug.trim() || !slugPattern.test(draft.slug.trim())) {
      setError('slug 只能包含小写字母、数字和连字符，例如 personal-profile')
      return
    }
    if (
      existingSlugs.includes(draft.slug.trim()) &&
      draft.slug.trim() !== initial?.slug
    ) {
      setError('slug 已被其他项目使用，请换一个')
      return
    }

    const saved = onSave(toProject(draft))
    if (!saved) setError('保存失败，请检查浏览器存储空间')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              {initial ? '编辑项目' : '新增项目'}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              项目详情页会渲染下方的 Markdown 正文。
            </p>
          </div>
          <button type="button" className="btn-ghost" onClick={onCancel}>
            取消
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="项目标题" htmlFor="project-title" required>
            <TextInput
              id="project-title"
              value={draft.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="个人展示网站"
            />
          </Field>

          <Field
            label="slug"
            htmlFor="project-slug"
            required
            hint="用于详情页地址，例如 personal-profile"
          >
            <TextInput
              id="project-slug"
              value={draft.slug}
              onChange={(event) => {
                setSlugTouched(true)
                update('slug', event.target.value)
              }}
              placeholder="personal-profile"
            />
          </Field>

          <Field label="项目周期" htmlFor="project-period">
            <TextInput
              id="project-period"
              value={draft.period}
              onChange={(event) => update('period', event.target.value)}
              placeholder="2026.09 - 2026.10"
            />
          </Field>

          <Field label="排序值" htmlFor="project-order" hint="数字越小越靠前">
            <TextInput
              id="project-order"
              type="number"
              value={draft.order}
              onChange={(event) => update('order', event.target.value)}
            />
          </Field>

          <Field
            label="项目摘要"
            htmlFor="project-summary"
            hint="展示在项目卡片上，建议 1～2 句话"
            className="sm:col-span-2"
          >
            <TextArea
              id="project-summary"
              value={draft.summary}
              onChange={(event) => update('summary', event.target.value)}
              rows={3}
              placeholder="一句话说明项目做了什么"
            />
          </Field>

          <Field
            label="技术栈"
            htmlFor="project-tech"
            hint="用逗号分隔，例如：React, TypeScript, Vite"
            className="sm:col-span-2"
          >
            <TextInput
              id="project-tech"
              value={draft.tech}
              onChange={(event) => update('tech', event.target.value)}
              placeholder="React, TypeScript, Vite"
            />
          </Field>

          <Field label="项目链接" htmlFor="project-link">
            <TextInput
              id="project-link"
              value={draft.link}
              onChange={(event) => update('link', event.target.value)}
              placeholder="https://example.com"
            />
          </Field>

          <Field label="仓库链接" htmlFor="project-repo">
            <TextInput
              id="project-repo"
              value={draft.repo}
              onChange={(event) => update('repo', event.target.value)}
              placeholder="https://github.com/..."
            />
          </Field>

          <label className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => update('featured', event.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500"
            />
            <span>
              <span className="block text-sm font-medium text-zinc-900">
                设为精选项目
              </span>
              <span className="block text-xs text-zinc-500">
                精选项目会优先展示在首页「精选项目」区域。
              </span>
            </span>
          </label>

          <div className="sm:col-span-2">
            <span className="label">项目正文（Markdown）</span>
            <MarkdownEditor
              value={draft.content}
              onChange={(value) => update('content', value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary">
          {initial ? '保存修改' : '创建项目'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          取消
        </button>
        {error ? <span className="text-sm text-red-500">{error}</span> : null}
      </div>
    </form>
  )
}

export function ProjectManager() {
  const { data, updateProjects } = useSiteData()
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editing, setEditing] = useState<Project | null>(null)
  const [status, setStatus] = useState<Status | null>(null)

  const projects = [...data.projects].sort(
    (a, b) => a.order - b.order || a.title.localeCompare(b.title),
  )
  const nextOrder =
    projects.length > 0
      ? Math.max(...projects.map((project) => project.order)) + 1
      : 1

  const startCreate = () => {
    setEditing(null)
    setMode('create')
    setStatus(null)
  }

  const startEdit = (project: Project) => {
    setEditing(project)
    setMode('edit')
    setStatus(null)
  }

  const closeEditor = () => {
    setMode('list')
    setEditing(null)
  }

  const handleSave = (project: Project): boolean => {
    const duplicated = data.projects.some(
      (item) => item.slug === project.slug && item.slug !== editing?.slug,
    )
    if (duplicated) return false

    const nextProjects = editing
      ? data.projects.map((item) =>
          item.slug === editing.slug ? project : item,
        )
      : [...data.projects, project]

    const saved = updateProjects(nextProjects)
    if (saved) {
      setStatus({
        type: 'success',
        text: editing ? '项目已更新' : '项目已创建',
      })
      closeEditor()
    }
    return saved
  }

  const handleDelete = (project: Project) => {
    const confirmed = window.confirm(
      `确定删除项目「${project.title}」吗？此操作不可撤销。`,
    )
    if (!confirmed) return

    const saved = updateProjects(
      data.projects.filter((item) => item.slug !== project.slug),
    )
    setStatus(
      saved
        ? { type: 'success', text: '项目已删除' }
        : { type: 'error', text: '删除失败，请稍后重试' },
    )
  }

  if (mode !== 'list') {
    return (
      <ProjectForm
        key={editing?.slug ?? 'new-project'}
        initial={editing}
        suggestedOrder={nextOrder}
        existingSlugs={data.projects.map((project) => project.slug)}
        onSave={handleSave}
        onCancel={closeEditor}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              项目
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              共 {projects.length} 个项目，排序值越小越靠前。
            </p>
          </div>
          <button type="button" className="btn-primary" onClick={startCreate}>
            <Plus size={16} />
            新增项目
          </button>
        </div>

        {status ? (
          <p
            className={
              status.type === 'success'
                ? 'mt-4 text-sm text-emerald-600'
                : 'mt-4 text-sm text-red-500'
            }
          >
            {status.text}
          </p>
        ) : null}
      </div>

      {projects.length > 0 ? (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-zinc-900">
                    {project.title}
                  </h3>
                  {project.featured ? <Tag tone="brand">精选</Tag> : null}
                  <span className="text-xs text-zinc-400">
                    /{project.slug}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                  {project.summary || '暂无摘要'}
                </p>
                {project.tech.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.tech.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => startEdit(project)}
                >
                  <Pencil size={15} />
                  编辑
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => handleDelete(project)}
                >
                  <Trash2 size={15} />
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="还没有项目"
          description="点击「新增项目」添加第一个项目，保存后会立即出现在前台。"
          action={
            <button type="button" className="btn-primary" onClick={startCreate}>
              <Plus size={16} />
              新增项目
            </button>
          }
        />
      )}
    </div>
  )
}
