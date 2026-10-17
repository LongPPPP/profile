import type { MediaState } from '../types'

export const STORAGE_KEYS = {
  profile: 'profile.v1.profile',
  projects: 'profile.v1.projects',
  blog: 'profile.v1.blog',
  mediaMeta: 'profile.v1.mediaMeta',
  admin: 'profile.v1.admin',
} as const

export const ALL_CONTENT_KEYS = [
  STORAGE_KEYS.profile,
  STORAGE_KEYS.projects,
  STORAGE_KEYS.blog,
  STORAGE_KEYS.mediaMeta,
] as const

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function readJSON<T>(key: string): T | null {
  if (!hasWindow()) return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeJSON<T>(key: string, value: T): boolean {
  if (!hasWindow()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeStorageKeys(keys: readonly string[]): void {
  if (!hasWindow()) return
  for (const key of keys) {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // 忽略单次删除失败，继续清理其他 key
    }
  }
}

export function readSession<T>(key: string): T | null {
  if (!hasWindow()) return null
  try {
    const raw = window.sessionStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export function writeSession<T>(key: string, value: T): void {
  if (!hasWindow()) return
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    // sessionStorage 不可用时仅影响本次登录状态
  }
}

export function removeSession(key: string): void {
  if (!hasWindow()) return
  try {
    window.sessionStorage.removeItem(key)
  } catch {
    // 忽略
  }
}

export function readMediaState(): MediaState {
  return readJSON<MediaState>(STORAGE_KEYS.mediaMeta) ?? {}
}

export function writeMediaState(state: MediaState): boolean {
  return writeJSON(STORAGE_KEYS.mediaMeta, state)
}
