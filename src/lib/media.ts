import { SITE_CONFIG } from '../config'
import type { MediaKey, MediaMeta } from '../types'
import { readMediaState, writeMediaState } from './storage'

const DB_NAME = 'profile-media'
const STORE_NAME = 'files'
const DB_VERSION = 1

let databasePromise: Promise<IDBDatabase> | null = null

function openDatabase(): Promise<IDBDatabase> {
  if (databasePromise) return databasePromise

  databasePromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('当前浏览器不支持 IndexedDB'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () =>
      reject(request.error ?? new Error('IndexedDB 打开失败'))
  })

  return databasePromise
}

function runRequest<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDatabase().then(
    (database) =>
      new Promise<T>((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, mode)
        const request = operation(transaction.objectStore(STORE_NAME))
        request.onsuccess = () => resolve(request.result)
        request.onerror = () =>
          reject(request.error ?? new Error('IndexedDB 操作失败'))
      }),
  )
}

export async function putMedia(key: MediaKey, blob: Blob): Promise<void> {
  await runRequest('readwrite', (store) => store.put(blob, key))
}

export async function getMedia(key: MediaKey): Promise<Blob | null> {
  const result = await runRequest<Blob | undefined>('readonly', (store) =>
    store.get(key),
  )
  return result ?? null
}

export async function deleteMedia(key: MediaKey): Promise<void> {
  await runRequest('readwrite', (store) => store.delete(key))
}

export async function clearAllMedia(): Promise<void> {
  await runRequest('readwrite', (store) => store.clear())
}

export function getMediaMeta(key: MediaKey): MediaMeta | undefined {
  return readMediaState()[key]
}

export async function saveMedia(
  key: MediaKey,
  blob: Blob,
  meta: MediaMeta,
): Promise<void> {
  await putMedia(key, blob)
  const state = readMediaState()
  state[key] = meta
  writeMediaState(state)
}

export async function removeMedia(key: MediaKey): Promise<void> {
  await deleteMedia(key)
  const state = readMediaState()
  delete state[key]
  writeMediaState(state)
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('文件读取失败'))
    reader.readAsDataURL(blob)
  })
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl)
  return response.blob()
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

/**
 * 将图片等比缩放到最长边不超过 maxSize，优先 WebP，失败回退 JPEG。
 * 头像不追求原图质量，压缩后再写入 IndexedDB。
 */
export async function resizeImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(
    1,
    SITE_CONFIG.avatarMaxSize / Math.max(bitmap.width, bitmap.height),
  )
  const width = Math.max(1, Math.round(bitmap.width * scale))
  const height = Math.max(1, Math.round(bitmap.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    bitmap.close()
    throw new Error('无法创建图片画布')
  }

  context.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const webp = await canvasToBlob(
    canvas,
    'image/webp',
    SITE_CONFIG.avatarQuality,
  )
  if (webp && webp.type === 'image/webp') return webp

  const jpeg = await canvasToBlob(
    canvas,
    'image/jpeg',
    SITE_CONFIG.avatarQuality,
  )
  if (jpeg) return jpeg

  throw new Error('图片压缩失败，请换一张图片重试')
}
