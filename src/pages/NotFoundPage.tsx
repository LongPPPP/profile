import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

export function NotFoundPage() {
  usePageTitle('页面不存在')

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
        404
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
        这个页面不存在
      </h1>
      <p className="mt-4 max-w-md text-sm leading-7 text-zinc-500">
        链接可能已经失效，或者内容已经被移动。你可以回到首页继续浏览。
      </p>
      <Link to="/" className="btn-primary mt-8">
        <ArrowLeft size={16} />
        返回首页
      </Link>
    </div>
  )
}
