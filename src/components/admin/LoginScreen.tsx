import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { SITE_CONFIG } from '../../config'

export function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password === SITE_CONFIG.adminPassword) {
      onSuccess()
      return
    }
    setError('口令不正确，请重试')
    setPassword('')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-5 py-16">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
        >
          <ArrowLeft size={15} />
          返回网站
        </Link>

        <div className="card p-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white">
            <LockKeyhole size={22} />
          </span>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-900">
            管理后台
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-500">
            输入口令后可以修改个人信息、项目和博客，上传头像与简历。
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label" htmlFor="admin-password">
                管理口令
              </label>
              <input
                id="admin-password"
                type="password"
                className="input"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (error) setError('')
                }}
                placeholder="请输入管理口令"
                autoComplete="current-password"
                autoFocus
              />
              {error ? (
                <p className="mt-1.5 text-xs text-red-500">{error}</p>
              ) : null}
            </div>

            <button type="submit" className="btn-primary w-full">
              进入后台
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-zinc-50 px-4 py-3 text-xs leading-5 text-zinc-500">
            <p>
              课程演示口令：<span className="font-mono text-zinc-800">admin123</span>
            </p>
            <p className="mt-1">
              纯前端口令只用于遮挡界面，不是真正的安全机制，请勿存放隐私内容。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
