export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}

export function slugify(input: string): string {
  const base = input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

  return base || `item-${Date.now().toString(36)}`
}

export function ensureUniqueSlug(
  base: string,
  existing: string[],
  currentSlug?: string,
): string {
  const taken = new Set(existing.filter((slug) => slug !== currentSlug))
  if (!taken.has(base)) return base
  let index = 2
  while (taken.has(`${base}-${index}`)) index += 1
  return `${base}-${index}`
}

export function parseCommaList(input: string): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const raw of input.split(/[,，]/)) {
    const value = raw.trim()
    if (value && !seen.has(value)) {
      seen.add(value)
      result.push(value)
    }
  }
  return result
}

export function formatDate(date: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
  if (!match) return date
  return `${match[1]} 年 ${Number(match[2])} 月 ${Number(match[3])} 日`
}

export function formatShortDate(date: string): string {
  return date.replaceAll('-', '.')
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const value = bytes / 1024 ** exponent
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`
}

export function readingTime(content: string): number {
  const plain = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#>*_`~\-[\]()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const chinese = (plain.match(/[一-龥]/g) ?? []).length
  const words = plain
    .replace(/[一-龥]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(chinese / 400 + words / 200))
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//i.test(url)
}
