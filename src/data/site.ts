import type { SiteData } from '../types'
import { loadDefaultBlog, loadDefaultProjects } from '../lib/content'
import { defaultProfile } from './profile'

export const defaultSiteData: SiteData = {
  profile: defaultProfile,
  projects: loadDefaultProjects(),
  blog: loadDefaultBlog(),
}

export function getDefaultSiteData(): SiteData {
  return {
    profile: {
      ...defaultSiteData.profile,
      skills: defaultSiteData.profile.skills.map((group) => ({
        ...group,
        items: [...group.items],
      })),
    },
    projects: defaultSiteData.projects.map((project) => ({ ...project })),
    blog: defaultSiteData.blog.map((post) => ({ ...post })),
  }
}
