import type { BlogPost, Project } from '../types'
import {
  getBoolean,
  getList,
  getNumber,
  getString,
  parseFrontmatter,
} from './frontmatter'

type RawModules = Record<string, string>

const projectModules = import.meta.glob('../content/projects/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as RawModules

const blogModules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as RawModules

function filenameSlug(path: string): string {
  const file = path.split('/').pop() ?? 'untitled'
  return file.replace(/\.md$/i, '')
}

export function loadDefaultProjects(): Project[] {
  return Object.entries(projectModules)
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw)
      const fallback = filenameSlug(path)
      return {
        slug: getString(data, 'slug', fallback),
        title: getString(data, 'title', fallback),
        period: getString(data, 'period'),
        summary: getString(data, 'summary'),
        tech: getList(data, 'tech'),
        link: getString(data, 'link') || undefined,
        repo: getString(data, 'repo') || undefined,
        featured: getBoolean(data, 'featured'),
        order: getNumber(data, 'order', 999),
        content,
      } satisfies Project
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}

export function loadDefaultBlog(): BlogPost[] {
  return Object.entries(blogModules)
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw)
      const fallback = filenameSlug(path)
      return {
        slug: getString(data, 'slug', fallback),
        title: getString(data, 'title', fallback),
        date: getString(data, 'date', '1970-01-01'),
        tags: getList(data, 'tags'),
        summary: getString(data, 'summary'),
        content,
      } satisfies BlogPost
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}
