import { Download, RotateCcw, Upload } from 'lucide-react'
import { useRef, useState, type ChangeEvent } from 'react'
import { useSiteData } from '../../context/SiteDataContext'
import { downloadExport, importSiteData } from '../../lib/exportData'
import { formatBytes } from '../../lib/utils'

interface Status {
  type: 'success' | 'error'
  text: string
}

type BusyKey = 'export' | 'import' | 'reset' | null

export function DataManager() {
  const { data, mediaState, resetAll, reload } = useSiteData()
  const importInput = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState<BusyKey>(null)
  const [status, setStatus] = useState<Status | null>(null)

  const handleExport = async () => {
    setBusy('export')
    setStatus(null)
    try {
      const size = await downloadExport(data)
      setStatus({
        type: 'success',
        text: `备份已导出（${formatBytes(size)}）`,
      })
    } catch (error) {
      setStatus({
        type: 'error',
        text: error instanceof Error ? error.message : '导出失败',
      })
    } finally {
      setBusy(null)
    }
  }

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setBusy('import')
    setStatus(null)
    const result = await importSiteData(file)
    if (result.ok) reload()
    setStatus({ type: result.ok ? 'success' : 'error', text: result.message })
    setBusy(null)
  }

  const handleReset = async () => {
    const confirmed = window.confirm(
      '确定恢复默认数据吗？当前浏览器中的修改、头像和简历都会被清除，此操作不可撤销。',
    )
    if (!confirmed) return

    setBusy('reset')
    setStatus(null)
    try {
      await resetAll()
      setStatus({ type: 'success', text: '已恢复默认数据' })
    } catch {
      setStatus({ type: 'error', text: '恢复默认失败，请刷新页面重试' })
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          数据管理
        </h2>
        <p className="mt-1 text-sm leading-6 text-zinc-500">
          当前浏览器中的修改保存在 localStorage，头像和简历保存在 IndexedDB。
          导出备份可以把这些内容打包成一个 JSON 文件。
        </p>

        <dl className="mt-5 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3">
            <dt className="text-xs text-zinc-400">项目</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-900">
              {data.projects.length}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3">
            <dt className="text-xs text-zinc-400">文章</dt>
            <dd className="mt-1 text-lg font-semibold text-zinc-900">
              {data.blog.length}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3">
            <dt className="text-xs text-zinc-400">自定义头像</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">
              {mediaState.avatar ? '已上传' : '默认'}
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3">
            <dt className="text-xs text-zinc-400">自定义简历</dt>
            <dd className="mt-1 text-sm font-medium text-zinc-900">
              {mediaState.resume ? '已上传' : '示例'}
            </dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="card flex flex-col p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Download size={19} />
          </span>
          <h3 className="mt-4 text-base font-semibold text-zinc-900">
            导出备份
          </h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-zinc-500">
            导出个人信息、项目、文章以及头像/简历的 base64 数据。建议在更换设备前先导出。
          </p>
          <button
            type="button"
            className="btn-primary mt-5"
            disabled={busy !== null}
            onClick={handleExport}
          >
            <Download size={16} />
            {busy === 'export' ? '导出中…' : '导出 JSON'}
          </button>
        </div>

        <div className="card flex flex-col p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Upload size={19} />
          </span>
          <h3 className="mt-4 text-base font-semibold text-zinc-900">
            导入备份
          </h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-zinc-500">
            选择此前导出的 JSON 文件，恢复全部文本数据和媒体文件。导入会覆盖当前浏览器中的内容。
          </p>
          <input
            ref={importInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImport}
          />
          <button
            type="button"
            className="btn-secondary mt-5"
            disabled={busy !== null}
            onClick={() => importInput.current?.click()}
          >
            <Upload size={16} />
            {busy === 'import' ? '导入中…' : '选择 JSON 文件'}
          </button>
        </div>

        <div className="card flex flex-col p-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <RotateCcw size={19} />
          </span>
          <h3 className="mt-4 text-base font-semibold text-zinc-900">
            恢复默认
          </h3>
          <p className="mt-2 flex-1 text-sm leading-6 text-zinc-500">
            清除当前浏览器中的全部修改，恢复项目内置的默认内容、默认头像和示例简历。
          </p>
          <button
            type="button"
            className="btn-danger mt-5"
            disabled={busy !== null}
            onClick={handleReset}
          >
            <RotateCcw size={16} />
            {busy === 'reset' ? '恢复中…' : '恢复默认数据'}
          </button>
        </div>
      </div>

      {status ? (
        <p
          className={
            status.type === 'success'
              ? 'text-sm text-emerald-600'
              : 'text-sm text-red-500'
          }
        >
          {status.text}
        </p>
      ) : null}

      <p className="text-xs leading-5 text-zinc-400">
        注意：这些数据只属于当前浏览器。其他访客打开域名时看到的是随项目构建的默认数据。
        如需让修改对所有访客生效，请把导出的 JSON 交给开发者，将内容固化到
        <span className="mx-1 font-mono">src/data</span>
        与
        <span className="mx-1 font-mono">src/content</span>
        后重新部署。
      </p>
    </div>
  )
}
