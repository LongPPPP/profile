import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import {
  formatDate,
  parseCommaList,
  slugify,
  todayISO,
} from '../../lib/utils'
import type { BlogPost } from '../../types'
import { EmptyState } from '../ui/EmptyState'
import { Tag } from '../ui/Tag'
import { Field, TextArea, TextInput } from './fields'
import { MarkdownEditor } from './MarkdownEditor'

interface Status {
  type: 'success' | 'error'
  text: string
}

interface BlogDraft {
  title: string
  slug: string
  date: string
  summary: string
  tags: string
  content: string
}

function createDraft(): BlogDraft {
  return {
    title: '',
    slug: '',
    date: todayISO(),
    summary: '',
    tags: '',
    content: '',
  }
}

function toDraft(post: BlogPost): BlogDraft {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date,
    summary: post.summary,
    tags: post.tags.join(', '),
    content: post.content,
  }
}

function toPost(draft: BlogDraft): BlogPost {
  return {
    title: draft.title.trim(),
    slug: draft.slug.trim(),
    date: draft.date,
    summary: draft.summary.trim(),
    tags: parseCommaList(draft.tags),
    content: draft.content,
  }
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

interface BlogFormProps {
  initial: BlogPost | null
  existingSlugs: string[]
  onSave: (post: BlogPost) => boolean
  onCancel: () => void
}

function BlogForm({
  initial,
  existingSlugs,
  onSave,
  onCancel,
}: BlogFormProps) {
  const [draft, setDraft] = useState<BlogDraft>(() =>
    initial ? toDraft(initial) : createDraft(),
  )
  const [slugTouched, setSlugTouched] = useState(Boolean(initial))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slugTouched && draft.title) {
      setDraft((previous) => ({ ...previous, slug: slugify(draft.title) }))
    }
  }, [draft.title, slugTouched])

  const update = <K extends keyof BlogDraft>(key: K, value: BlogDraft[K]) => {
    setDraft((previous) => ({ ...previous, [key]: value }))
    setError('')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!draft.title.trim()) {
      setError('文章标题不能为空')
      return
    }
    if (!draft.slug.trim() || !slugPattern.test(draft.slug.trim())) {
      setError('slug 只能包含小写字母、数字和连字符，例如 ai-workflow')
      return
    }
    if (
      existingSlugs.includes(draft.slug.trim()) &&
      draft.slug.trim() !== initial?.slug
    ) {
      setError('slug 已被其他文章使用，请换一个')
      return
    }
    if (!draft.date) {
      setError('请选择发布日期')
      return
    }

    const saved = onSave(toPost(draft))
    if (!saved) setError('保存失败，请检查浏览器存储空间')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              {initial ? '编辑文章' : '新增文章'}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              正文支持 Markdown，保存后会出现在博客列表。
            </p>
          </div>
          <button type="button" className="btn-ghost" onClick={onCancel}>
            取消
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="文章标题" htmlFor="blog-title" required>
            <TextInput
              id="blog-title"
              value={draft.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="纯前端应用如何做数据持久化"
            />
          </Field>

          <Field
            label="slug"
            htmlFor="blog-slug"
            required
            hint="用于文章地址，例如 local-first-frontend"
          >
            <TextInput
              id="blog-slug"
              value={draft.slug}
              onChange={(event) => {
                setSlugTouched(true)
                update('slug', event.target.value)
              }}
              placeholder="local-first-frontend"
            />
          </Field>

          <Field label="发布日期" htmlFor="blog-date" required>
            <TextInput
              id="blog-date"
              type="date"
              value={draft.date}
              onChange={(event) => update('date', event.target.value)}
            />
          </Field>

          <Field
            label="标签"
            htmlFor="blog-tags"
            hint="用逗号分隔，例如：前端, 存储"
          >
            <TextInput
              id="blog-tags"
              value={draft.tags}
              onChange={(event) => update('tags', event.target.value)}
              placeholder="前端, 存储, IndexedDB"
            />
          </Field>

          <Field
            label="文章摘要"
            htmlFor="blog-summary"
            hint="展示在列表卡片上"
            className="sm:col-span-2"
          >
            <TextArea
              id="blog-summary"
              value={draft.summary}
              onChange={(event) => update('summary', event.target.value)}
              rows={3}
              placeholder="用一两句话概括这篇文章"
            />
          </Field>

          <div className="sm:col-span-2">
            <span className="label">文章正文（Markdown）</span>
            <MarkdownEditor
              value={draft.content}
              onChange={(value) => update('content', value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary">
          {initial ? '保存修改' : '发布文章'}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          取消
        </button>
        {error ? <span className="text-sm text-red-500">{error}</span> : null}
      </div>
    </form>
  )
}

export function BlogManager() {
  const { data, updateBlog } = useSiteData()
  const [mode, setMode] = useState<'list' | 'create' | 'edit'>('list')
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [status, setStatus] = useState<Status | null>(null)

  const posts = [...data.blog].sort((a, b) => b.date.localeCompare(a.date))

  const startCreate = () => {
    setEditing(null)
    setMode('create')
    setStatus(null)
  }

  const startEdit = (post: BlogPost) => {
    setEditing(post)
    setMode('edit')
    setStatus(null)
  }

  const closeEditor = () => {
    setMode('list')
    setEditing(null)
  }

  const handleSave = (post: BlogPost): boolean => {
    const duplicated = data.blog.some(
      (item) => item.slug === post.slug && item.slug !== editing?.slug,
    )
    if (duplicated) return false

    const nextPosts = editing
      ? data.blog.map((item) => (item.slug === editing.slug ? post : item))
      : [...data.blog, post]

    const saved = updateBlog(nextPosts)
    if (saved) {
      setStatus({
        type: 'success',
        text: editing ? '文章已更新' : '文章已发布',
      })
      closeEditor()
    }
    return saved
  }

  const handleDelete = (post: BlogPost) => {
    const confirmed = window.confirm(
      `确定删除文章「${post.title}」吗？此操作不可撤销。`,
    )
    if (!confirmed) return

    const saved = updateBlog(
      data.blog.filter((item) => item.slug !== post.slug),
    )
    setStatus(
      saved
        ? { type: 'success', text: '文章已删除' }
        : { type: 'error', text: '删除失败，请稍后重试' },
    )
  }

  if (mode !== 'list') {
    return (
      <BlogForm
        key={editing?.slug ?? 'new-post'}
        initial={editing}
        existingSlugs={data.blog.map((post) => post.slug)}
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
              博客
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              共 {posts.length} 篇文章，按发布日期倒序展示。
            </p>
          </div>
          <button type="button" className="btn-primary" onClick={startCreate}>
            <Plus size={16} />
            新增文章
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

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-zinc-900">{post.title}</h3>
                  <span className="text-xs text-zinc-400">
                    {formatDate(post.date)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">/{post.slug}</p>
                <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
                  {post.summary || '暂无摘要'}
                </p>
                {post.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => startEdit(post)}
                >
                  <Pencil size={15} />
                  编辑
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => handleDelete(post)}
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
          title="还没有文章"
          description="点击「新增文章」发布第一篇内容，保存后会立即出现在前台。"
          action={
            <button type="button" className="btn-primary" onClick={startCreate}>
              <Plus size={16} />
              新增文章
            </button>
          }
        />
      )}
    </div>
  )
}
