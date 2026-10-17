import { useEffect, useState } from 'react'
import { useSiteData } from '../context/SiteDataContext'
import { getMedia } from '../lib/media'
import type { MediaKey } from '../types'

/**
 * 从 IndexedDB 读取媒体 Blob 并生成 object URL；
 * 不存在或读取失败时返回 fallback（通常是 public 下的默认资源）。
 */
export function useMediaUrl(key: MediaKey, fallback: string): string {
  const { mediaVersion } = useSiteData()
  const [url, setUrl] = useState(fallback)

  useEffect(() => {
    let active = true
    let objectUrl: string | null = null

    setUrl(fallback)

    getMedia(key)
      .then((blob) => {
        if (!active || !blob) return
        objectUrl = URL.createObjectURL(blob)
        setUrl(objectUrl)
      })
      .catch(() => {
        if (active) setUrl(fallback)
      })

    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [key, fallback, mediaVersion])

  return url
}
