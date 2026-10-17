import type { ExportBundle, SiteData } from '../types'
import { blobToDataUrl, dataUrlToBlob, getMedia, removeMedia, saveMedia } from './media'
import { readMediaState, STORAGE_KEYS, writeJSON } from './storage'
import { todayISO } from './utils'

export async function buildExportBundle(data: SiteData): Promise<ExportBundle> {
  const mediaState = readMediaState()
  const media: ExportBundle['media'] = {}

  if (mediaState.avatar) {
    const blob = await getMedia('avatar')
    if (blob) {
      media.avatar = {
        meta: mediaState.avatar,
        dataUrl: await blobToDataUrl(blob),
      }
    }
  }

  if (mediaState.resume) {
    const blob = await getMedia('resume')
    if (blob) {
      media.resume = {
        meta: mediaState.resume,
        dataUrl: await blobToDataUrl(blob),
      }
    }
  }

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: data.profile,
    projects: data.projects,
    blog: data.blog,
    media,
  }
}

export async function downloadExport(data: SiteData): Promise<number> {
  const bundle = await buildExportBundle(data)
  const json = JSON.stringify(bundle, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `profile-export-${todayISO()}.json`
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  return blob.size
}

function isExportBundle(value: unknown): value is ExportBundle {
  if (!value || typeof value !== 'object') return false
  const bundle = value as Partial<ExportBundle>
  return (
    bundle.version === 1 &&
    Boolean(bundle.profile) &&
    Array.isArray(bundle.projects) &&
    Array.isArray(bundle.blog) &&
    typeof bundle.media === 'object'
  )
}

export interface ImportResult {
  ok: boolean
  message: string
}

export async function importSiteData(file: File): Promise<ImportResult> {
  let bundle: ExportBundle

  try {
    const text = await file.text()
    const parsed: unknown = JSON.parse(text)
    if (!isExportBundle(parsed)) {
      return { ok: false, message: '文件格式不正确，请选择本站导出的 JSON 备份' }
    }
    bundle = parsed
  } catch {
    return { ok: false, message: 'JSON 解析失败，文件可能已损坏' }
  }

  try {
    if (!writeJSON(STORAGE_KEYS.profile, bundle.profile)) {
      throw new Error('写入个人信息失败')
    }
    if (!writeJSON(STORAGE_KEYS.projects, bundle.projects)) {
      throw new Error('写入项目数据失败')
    }
    if (!writeJSON(STORAGE_KEYS.blog, bundle.blog)) {
      throw new Error('写入博客数据失败')
    }
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : '写入浏览器存储失败',
    }
  }

  try {
    await removeMedia('avatar')
    await removeMedia('resume')


    if (bundle.media.avatar) {
      const blob = await dataUrlToBlob(bundle.media.avatar.dataUrl)
      await saveMedia('avatar', blob, bundle.media.avatar.meta)
    }

    if (bundle.media.resume) {
      const blob = await dataUrlToBlob(bundle.media.resume.dataUrl)
      await saveMedia('resume', blob, bundle.media.resume.meta)
    }
  } catch {
    return {
      ok: false,
      message: '文本数据已导入，但媒体文件恢复失败，请重新上传头像或简历',
    }
  }

  return { ok: true, message: '导入成功，数据已恢复' }
}
