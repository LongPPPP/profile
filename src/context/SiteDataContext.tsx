import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  BlogPost,
  MediaState,
  Profile,
  Project,
  SiteData,
} from '../types'
import { getDefaultSiteData } from '../data/site'
import { clearAllMedia } from '../lib/media'
import {
  ALL_CONTENT_KEYS,
  readJSON,
  readMediaState,
  removeStorageKeys,
  STORAGE_KEYS,
  writeJSON,
} from '../lib/storage'

interface SiteDataContextValue {
  data: SiteData
  mediaState: MediaState
  mediaVersion: number
  updateProfile: (profile: Profile) => boolean
  updateProjects: (projects: Project[]) => boolean
  updateBlog: (blog: BlogPost[]) => boolean
  refreshMedia: () => void
  reload: () => void
  resetAll: () => Promise<void>
}

const SiteDataContext = createContext<SiteDataContextValue | null>(null)

function loadSiteData(): SiteData {
  const defaults = getDefaultSiteData()
  return {
    profile: readJSON<Profile>(STORAGE_KEYS.profile) ?? defaults.profile,
    projects:
      readJSON<Project[]>(STORAGE_KEYS.projects) ?? defaults.projects,
    blog: readJSON<BlogPost[]>(STORAGE_KEYS.blog) ?? defaults.blog,
  }
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(loadSiteData)
  const [mediaState, setMediaState] = useState<MediaState>(readMediaState)
  const [mediaVersion, setMediaVersion] = useState(0)

  const updateProfile = useCallback((profile: Profile) => {
    const saved = writeJSON(STORAGE_KEYS.profile, profile)
    if (saved) setData((previous) => ({ ...previous, profile }))
    return saved
  }, [])

  const updateProjects = useCallback((projects: Project[]) => {
    const saved = writeJSON(STORAGE_KEYS.projects, projects)
    if (saved) setData((previous) => ({ ...previous, projects }))
    return saved
  }, [])

  const updateBlog = useCallback((blog: BlogPost[]) => {
    const saved = writeJSON(STORAGE_KEYS.blog, blog)
    if (saved) setData((previous) => ({ ...previous, blog }))
    return saved
  }, [])

  const refreshMedia = useCallback(() => {
    setMediaState(readMediaState())
    setMediaVersion((version) => version + 1)
  }, [])

  const reload = useCallback(() => {
    setData(loadSiteData())
    setMediaState(readMediaState())
    setMediaVersion((version) => version + 1)
  }, [])

  const resetAll = useCallback(async () => {
    await clearAllMedia()
    removeStorageKeys(ALL_CONTENT_KEYS)
    setData(getDefaultSiteData())
    setMediaState({})
    setMediaVersion((version) => version + 1)
  }, [])

  const value = useMemo<SiteDataContextValue>(
    () => ({
      data,
      mediaState,
      mediaVersion,
      updateProfile,
      updateProjects,
      updateBlog,
      refreshMedia,
      reload,
      resetAll,
    }),
    [
      data,
      mediaState,
      mediaVersion,
      updateProfile,
      updateProjects,
      updateBlog,
      refreshMedia,
      reload,
      resetAll,
    ],
  )

  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  )
}

export function useSiteData(): SiteDataContextValue {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error('useSiteData 必须在 SiteDataProvider 内使用')
  }
  return context
}

