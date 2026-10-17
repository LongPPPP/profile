import { About } from '../components/home/About'
import { Contact } from '../components/home/Contact'
import { FeaturedProjects } from '../components/home/FeaturedProjects'
import { Hero } from '../components/home/Hero'
import { LatestPosts } from '../components/home/LatestPosts'
import { Skills } from '../components/home/Skills'
import { usePageTitle } from '../hooks/usePageTitle'

export function HomePage() {
  usePageTitle()

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <FeaturedProjects />
      <LatestPosts />
      <Contact />
    </>
  )
}
