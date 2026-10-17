export interface SkillGroup {
  category: string
  items: string[]
}

export interface Profile {
  name: string
  englishName: string
  role: string
  tagline: string
  bio: string
  location: string
  email: string
  github: string
  website?: string
  skills: SkillGroup[]
}

export interface Project {
  slug: string
  title: string
  period: string
  summary: string
  tech: string[]
  link?: string
  repo?: string
  featured: boolean
  order: number
  content: string
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  content: string
}

export interface SiteData {
  profile: Profile
  projects: Project[]
  blog: BlogPost[]
}

export interface MediaMeta {
  name: string
  size: number
  type: string
  updatedAt: string
}

export interface MediaState {
  avatar?: MediaMeta
  resume?: MediaMeta
}

export interface ExportBundle extends SiteData {
  version: 1
  exportedAt: string
  media: {
    avatar?: { meta: MediaMeta; dataUrl: string }
    resume?: { meta: MediaMeta; dataUrl: string }
  }
}

export type MediaKey = 'avatar' | 'resume'
