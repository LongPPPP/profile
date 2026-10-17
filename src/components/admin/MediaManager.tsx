import { Download, ImageUp, Trash2, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { SITE_CONFIG } from '../../config'
import { useSiteData } from '../../context/SiteDataContext'
import { useMediaUrl } from '../../hooks/useMediaUrl'
import { removeMedia, resizeImage, saveMedia } from '../../lib/media'
import { formatBytes } from '../../lib/utils'
import type { MediaMeta } from '../../types'

type BusyKey = 'avatar' | 'resume' | null

interface Status {
  type: 'success' | 'error'
  text: string
}

function formatUpdatedAt(value: string): string {
  return new Date(value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MediaManager() {
  const { mediaState, refreshMedia } = useSiteData()
  const avatarUrl = useMediaUrl('avatar', SITE_CONFIG.defaultAvatar)
  const resumeUrl = useMediaUrl('resume', SITE_CONFIG.defaultResume)
  const avatarInput = useRef<HTMLInputElement>(null)
  const resumeInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<BusyKey>(null)
  const [status, setStatus] = useState<Status | null>(null)

  const avatarMeta = mediaState.avatar
  const resumeMeta = mediaState.resume

  const handleAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', text: '请选择图片文件' })
      return
    }

    setBusy('avatar')
    setStatus(null)
    try {
      const blob = await resizeImage(file)
      const extension = blob.type === 'image/webp' ? '.webp' : '.jpg'
      const baseName = file.name.replace(/\.[^.]+$/, '')
      const meta: MediaMeta = {
        name: `${baseName}${extension}`,
        size: blob.size,
        type: blob.type,
        updatedAt: new Date().toISOString(),
      }
      await saveMedia('avatar', blob, meta)
      refreshMedia()
      setStatus({ type: 'success', text: '头像已更新，前台已同步' })
    } catch (error) {
      setStatus({
        type: 'error',
        text: error instanceof Error ? error.message : '头像上传失败',
      })
    } finally {
      setBusy(null)
    }
  }

  const handleResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setStatus({ type: 'error', text: '简历仅支持 PDF 文件' })
      return
    }
    if (file.size > SITE_CONFIG.maxResumeSize) {
      setStatus({
        type: 'error',
        text: `简历不能超过 ${formatBytes(SITE_CONFIG.maxResumeSize)}`,
      })
      return
    }

    setBusy('resume')
    setStatus(null)
    try {
      const meta: MediaMeta = {
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        updatedAt: new Date().toISOString(),
      }
      await saveMedia('resume', file, meta)
      refreshMedia()
      setStatus({ type: 'success', text: '简历已更新，前台下载已同步' })
    } catch (error) {
      setStatus({
        type: 'error',
        text: error instanceof Error ? error.message : '简历上传失败',
      })
    } finally {
      setBusy(null)
    }
  }

  const remove = async (key: 'avatar' | 'resume') => {
    setBusy(key)
    setStatus(null)
    try {
      await removeMedia(key)
      refreshMedia()
      setStatus({
        type: 'success',
        text: key === 'avatar' ? '已恢复默认头像' : '已恢复示例简历',
      })
    } catch (error) {
      setStatus({
        type: 'error',
        text: error instanceof Error ? error.message : '移除失败',
      })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          头像
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          支持 JPG、PNG、WebP 等图片，上传后会压缩到最长边 512px。
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-5">
          <img
            src={avatarUrl}
            alt="当前头像"
            className="h-24 w-24 rounded-full border border-zinc-200 bg-zinc-50 object-cover"
          />

          <div className="min-w-0 flex-1">
            {avatarMeta ? (
              <>
                <p className="truncate text-sm font-medium text-zinc-900">
                  {avatarMeta.name}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {formatBytes(avatarMeta.size)} · 更新于{' '}
                  {formatUpdatedAt(avatarMeta.updatedAt)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-zinc-900">默认头像</p>
                <p className="mt-1 text-xs text-zinc-500">
                  当前使用站点内置的 SVG 头像。
                </p>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={avatarInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatar}
            />
            <button
              type="button"
              className="btn-primary"
              disabled={busy !== null}
              onClick={() => avatarInput.current?.click()}
            >
              <ImageUp size={16} />
              {busy === 'avatar' ? '处理中…' : '上传头像'}
            </button>
            {avatarMeta ? (
              <button
                type="button"
                className="btn-danger"
                disabled={busy !== null}
                onClick={() => remove('avatar')}
              >
                <Trash2 size={16} />
                移除
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          简历
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          仅支持 PDF，单个文件不超过 {formatBytes(SITE_CONFIG.maxResumeSize)}。
          前台「下载简历」会使用这里上传的文件。
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-5">
          <div className="min-w-0 flex-1">
            {resumeMeta ? (
              <>
                <p className="truncate text-sm font-medium text-zinc-900">
                  {resumeMeta.name}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {formatBytes(resumeMeta.size)} · 更新于{' '}
                  {formatUpdatedAt(resumeMeta.updatedAt)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-zinc-900">
                  示例简历（未上传）
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  当前使用项目内置的占位 PDF，建议替换为你的真实简历。
                </p>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={resumeInput}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleResume}
            />
            <button
              type="button"
              className="btn-primary"
              disabled={busy !== null}
              onClick={() => resumeInput.current?.click()}
            >
              <Upload size={16} />
              {busy === 'resume' ? '上传中…' : '上传简历'}
            </button>
            <a
              href={resumeUrl}
              download={resumeMeta?.name ?? SITE_CONFIG.defaultResumeName}
              className="btn-secondary"
            >
              <Download size={16} />
              下载
            </a>
            {resumeMeta ? (
              <button
                type="button"
                className="btn-danger"
                disabled={busy !== null}
                onClick={() => remove('resume')}
              >
                <Trash2 size={16} />
                移除
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200">
          <iframe
            src={resumeUrl}
            title="简历预览"
            className="h-[420px] w-full bg-zinc-50"
          />
        </div>
        <p className="mt-2 text-xs text-zinc-400">
          预览依赖浏览器内置 PDF 查看器；如果无法显示，可以直接下载查看。
        </p>
      </div>

      {status ? (
        <p
          className={
            status.type === 'success'
              ? 'text-sm text-emerald-600'
              : 'text-sm text-red-500'
          }
        >
          {status.text}
        </p>
      ) : null}

      <p className="text-xs leading-5 text-zinc-400">
        头像与简历仅保存在当前浏览器的 IndexedDB 中，不会上传到服务器；访客打开
        网站时仍会看到站点内置的默认资源。
      </p>
    </div>
  )
}
