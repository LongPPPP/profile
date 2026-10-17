import { useState } from 'react'
import { AdminLayout, type AdminTab } from '../components/admin/AdminLayout'
import { BasicInfoForm } from '../components/admin/BasicInfoForm'
import { BlogManager } from '../components/admin/BlogManager'
import { DataManager } from '../components/admin/DataManager'
import { LoginScreen } from '../components/admin/LoginScreen'
import { MediaManager } from '../components/admin/MediaManager'
import { ProjectManager } from '../components/admin/ProjectManager'
import { SkillsForm } from '../components/admin/SkillsForm'
import {
  readSession,
  removeSession,
  STORAGE_KEYS,
  writeSession,
} from '../lib/storage'

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(
    () => readSession<boolean>(STORAGE_KEYS.admin) === true,
  )
  const [tab, setTab] = useState<AdminTab>('profile')

  const login = () => {
    writeSession(STORAGE_KEYS.admin, true)
    setAuthenticated(true)
  }

  const logout = () => {
    removeSession(STORAGE_KEYS.admin)
    setAuthenticated(false)
  }

  if (!authenticated) {
    return <LoginScreen onSuccess={login} />
  }

  return (
    <AdminLayout active={tab} onChange={setTab} onLogout={logout}>
      {tab === 'profile' ? (
        <BasicInfoForm onManageMedia={() => setTab('media')} />
      ) : null}
      {tab === 'skills' ? <SkillsForm /> : null}
      {tab === 'projects' ? <ProjectManager /> : null}
      {tab === 'blog' ? <BlogManager /> : null}
      {tab === 'media' ? <MediaManager /> : null}
      {tab === 'data' ? <DataManager /> : null}
    </AdminLayout>
  )
}
