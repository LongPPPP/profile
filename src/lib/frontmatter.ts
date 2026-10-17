export interface ParsedMarkdown {
  data: Record<string, string>
  content: string
}

/**
 * 解析轻量 frontmatter：只支持 `key: value` 单行格式，
 * 不引入 YAML 依赖，足够覆盖项目与博客的字段。
 */
export function parseFrontmatter(raw: string): ParsedMarkdown {
  const normalized = raw.replace(/\r\n/g, '\n')
  if (!normalized.startsWith('---\n')) {
    return { data: {}, content: normalized.trim() }
  }

  const closingIndex = normalized.indexOf('\n---', 4)
  if (closingIndex === -1) {
    return { data: {}, content: normalized.trim() }
  }

  const header = normalized.slice(4, closingIndex)
  const content = normalized.slice(closingIndex + 4).replace(/^\n+/, '').trim()
  const data: Record<string, string> = {}

  for (const line of header.split('\n')) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    if (!key) continue
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, '')
    data[key] = value
  }

  return { data, content }
}

export function getString(
  data: Record<string, string>,
  key: string,
  fallback = '',
): string {
  return data[key]?.trim() || fallback
}

export function getList(data: Record<string, string>, key: string): string[] {
  const raw = data[key]?.trim() ?? ''
  const unwrapped = raw.replace(/^\[/, '').replace(/\]$/, '')
  return unwrapped
    .split(/[,，]/)
    .map((item) => item.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

export function getBoolean(
  data: Record<string, string>,
  key: string,
  fallback = false,
): boolean {
  const raw = data[key]?.trim().toLowerCase()
  if (!raw) return fallback
  return raw === 'true' || raw === '1' || raw === 'yes'
}

export function getNumber(
  data: Record<string, string>,
  key: string,
  fallback = 0,
): number {
  const value = Number(data[key])
  return Number.isFinite(value) ? value : fallback
}
