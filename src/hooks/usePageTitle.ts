import { useEffect } from 'react'
import { useSiteData } from '../context/SiteDataContext'

export function usePageTitle(pageTitle?: string) {
  const { data } = useSiteData()
  const siteName = data.profile.name || '个人主页'

  useEffect(() => {
    document.title = pageTitle
      ? `${pageTitle} | ${siteName}`
      : `${siteName} | 个人主页`
  }, [pageTitle, siteName])
}
