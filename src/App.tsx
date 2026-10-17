import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { ScrollToTop } from './components/layout/ScrollToTop'
import { SiteDataProvider } from './context/SiteDataContext'
import { AdminPage } from './pages/AdminPage'
import { BlogDetailPage } from './pages/BlogDetailPage'
import { BlogListPage } from './pages/BlogListPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { ProjectsPage } from './pages/ProjectsPage'

export default function App() {
  return (
    <BrowserRouter>
      <SiteDataProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </SiteDataProvider>
    </BrowserRouter>
  )
}
