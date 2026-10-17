import { Plus, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import { parseCommaList } from '../../lib/utils'
import type { SkillGroup } from '../../types'
import { Button } from '../ui/Button'
import { Field, TextInput } from './fields'

interface SkillDraft {
  category: string
  items: string
}

function toDraft(groups: SkillGroup[]): SkillDraft[] {
  return groups.map((group) => ({
    category: group.category,
    items: group.items.join(', '),
  }))
}

export function SkillsForm() {
  const { data, updateProfile } = useSiteData()
  const [drafts, setDrafts] = useState<SkillDraft[]>(() =>
    toDraft(data.profile.skills),
  )
  const [status, setStatus] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  useEffect(() => {
    setDrafts(toDraft(data.profile.skills))
  }, [data.profile.skills])

  const updateDraft = (index: number, patch: Partial<SkillDraft>) => {
    setDrafts((previous) =>
      previous.map((draft, position) =>
        position === index ? { ...draft, ...patch } : draft,
      ),
    )
    setStatus(null)
  }

  const addGroup = () => {
    setDrafts((previous) => [...previous, { category: '', items: '' }])
    setStatus(null)
  }

  const removeGroup = (index: number) => {
    setDrafts((previous) => previous.filter((_, position) => position !== index))
    setStatus(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (drafts.length === 0) {
      setStatus({ type: 'error', text: '至少保留一个技能分类' })
      return
    }

    const groups: SkillGroup[] = []
    for (const draft of drafts) {
      const category = draft.category.trim()
      const items = parseCommaList(draft.items)
      if (!category) {
        setStatus({ type: 'error', text: '技能分类名称不能为空' })
        return
      }
      if (items.length === 0) {
        setStatus({
          type: 'error',
          text: `「${category}」至少需要填写一个技能标签`,
        })
        return
      }
      groups.push({ category, items })
    }

    const saved = updateProfile({ ...data.profile, skills: groups })
    setStatus(
      saved
        ? { type: 'success', text: '技能已保存' }
        : { type: 'error', text: '保存失败，请检查浏览器存储空间' },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
              技能
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              按分类组织技能标签，标签之间用逗号分隔。
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={addGroup}>
            <Plus size={16} />
            新增分类
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {drafts.map((draft, index) => (
            <div
              key={index}
              className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  分类 {index + 1}
                </p>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-red-50 hover:text-red-500"
                  aria-label={`删除分类 ${index + 1}`}
                  onClick={() => removeGroup(index)}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="mt-3 grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
                <Field label="分类名称" htmlFor={`skill-category-${index}`}>
                  <TextInput
                    id={`skill-category-${index}`}
                    value={draft.category}
                    onChange={(event) =>
                      updateDraft(index, { category: event.target.value })
                    }
                    placeholder="前端开发"
                  />
                </Field>

                <Field
                  label="技能标签"
                  htmlFor={`skill-items-${index}`}
                  hint="例如：React, TypeScript, Tailwind CSS"
                >
                  <TextInput
                    id={`skill-items-${index}`}
                    value={draft.items}
                    onChange={(event) =>
                      updateDraft(index, { items: event.target.value })
                    }
                    placeholder="React, TypeScript, Tailwind CSS"
                  />
                </Field>
              </div>
            </div>
          ))}

          {drafts.length === 0 ? (
            <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-400">
              还没有技能分类，点击「新增分类」开始添加。
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary">
          保存技能
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setDrafts(toDraft(data.profile.skills))
            setStatus(null)
          }}
        >
          撤销修改
        </button>
        {status ? (
          <span
            className={
              status.type === 'success'
                ? 'text-sm text-emerald-600'
                : 'text-sm text-red-500'
            }
          >
            {status.text}
          </span>
        ) : null}
      </div>
    </form>
  )
}
