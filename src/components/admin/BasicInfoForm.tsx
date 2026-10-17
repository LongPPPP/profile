import { Image } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { SITE_CONFIG } from '../../config'
import { useSiteData } from '../../context/SiteDataContext'
import { useMediaUrl } from '../../hooks/useMediaUrl'
import type { Profile } from '../../types'
import { Field, TextArea, TextInput } from './fields'

interface BasicInfoFormProps {
  onManageMedia: () => void
}

export function BasicInfoForm({ onManageMedia }: BasicInfoFormProps) {
  const { data, updateProfile } = useSiteData()
  const [draft, setDraft] = useState<Profile>(data.profile)
  const [status, setStatus] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const avatarUrl = useMediaUrl('avatar', SITE_CONFIG.defaultAvatar)

  useEffect(() => {
    setDraft(data.profile)
  }, [data.profile])

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setDraft((previous) => ({ ...previous, [key]: value }))
    setStatus(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!draft.name.trim() || !draft.role.trim() || !draft.tagline.trim()) {
      setStatus({
        type: 'error',
        text: '姓名、身份和一句话介绍不能为空',
      })
      return
    }

    if (
      draft.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())
    ) {
      setStatus({ type: 'error', text: '邮箱格式不正确' })
      return
    }

    const saved = updateProfile({
      ...draft,
      name: draft.name.trim(),
      englishName: draft.englishName.trim(),
      role: draft.role.trim(),
      tagline: draft.tagline.trim(),
      location: draft.location.trim(),
      email: draft.email.trim(),
      github: draft.github.trim(),
      website: draft.website?.trim() ?? '',
      bio: draft.bio.trim(),
    })

    setStatus(
      saved
        ? { type: 'success', text: '已保存，前台已同步更新' }
        : {
            type: 'error',
            text: '保存失败：浏览器存储可能已满，请导出备份后清理空间',
          },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          基本信息
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          这些内容会展示在首页 Hero、关于我和页脚。
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-5 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-4">
          <img
            src={avatarUrl}
            alt="头像预览"
            className="h-16 w-16 rounded-full border border-zinc-200 bg-white object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-zinc-900">头像与简历</p>
            <p className="mt-0.5 text-xs leading-5 text-zinc-500">
              头像会压缩后存入浏览器，简历支持 PDF 预览与下载。
            </p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={onManageMedia}
          >
            <Image size={16} />
            管理媒体
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="姓名" htmlFor="profile-name" required>
            <TextInput
              id="profile-name"
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder="你的名字"
            />
          </Field>

          <Field
            label="英文名"
            htmlFor="profile-english-name"
            hint="用于首页大标题，可留空"
          >
            <TextInput
              id="profile-english-name"
              value={draft.englishName}
              onChange={(event) => update('englishName', event.target.value)}
              placeholder="Long"
            />
          </Field>

          <Field label="身份 / 职位" htmlFor="profile-role" required>
            <TextInput
              id="profile-role"
              value={draft.role}
              onChange={(event) => update('role', event.target.value)}
              placeholder="前端开发者 · 计算机专业学生"
            />
          </Field>

          <Field label="所在地" htmlFor="profile-location">
            <TextInput
              id="profile-location"
              value={draft.location}
              onChange={(event) => update('location', event.target.value)}
              placeholder="大连 · 中国"
            />
          </Field>

          <Field label="一句话介绍" htmlFor="profile-tagline" required className="sm:col-span-2">
            <TextInput
              id="profile-tagline"
              value={draft.tagline}
              onChange={(event) => update('tagline', event.target.value)}
              placeholder="用一句话说明你在做什么"
            />
          </Field>

          <Field
            label="个人简介"
            htmlFor="profile-bio"
            hint="使用空行分段，展示在首页「关于我」区域"
            className="sm:col-span-2"
          >
            <TextArea
              id="profile-bio"
              value={draft.bio}
              onChange={(event) => update('bio', event.target.value)}
              rows={6}
              placeholder="介绍一下你自己……"
            />
          </Field>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          联系方式
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          邮箱和 GitHub 会出现在首页、关于我和页脚。
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="邮箱" htmlFor="profile-email">
            <TextInput
              id="profile-email"
              type="email"
              value={draft.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="hello@example.com"
            />
          </Field>

          <Field label="GitHub 地址" htmlFor="profile-github">
            <TextInput
              id="profile-github"
              value={draft.github}
              onChange={(event) => update('github', event.target.value)}
              placeholder="https://github.com/your-name"
            />
          </Field>

          <Field
            label="个人网站"
            htmlFor="profile-website"
            hint="可选，填写后会显示在「关于我」中"
            className="sm:col-span-2"
          >
            <TextInput
              id="profile-website"
              value={draft.website ?? ''}
              onChange={(event) => update('website', event.target.value)}
              placeholder="https://example.com"
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary">
          保存基本信息
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => {
            setDraft(data.profile)
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
