import {
  Bold,
  Code2,
  Eye,
  Heading2,
  Italic,
  Link2,
  List,
  Pencil,
  Quote,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import { Markdown } from '../ui/Markdown'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

type Mode = 'edit' | 'preview'

const toolbarButton =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-zinc-200/70 hover:text-zinc-900'

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [mode, setMode] = useState<Mode>('edit')

  const apply = (before: string, after = '', placeholder = '文本') => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.slice(start, end) || placeholder
    const next =
      value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      )
    })
  }

  const prefixLine = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart)
    onChange(next)
    requestAnimationFrame(() => {
      textarea.focus()
      const position = start + prefix.length
      textarea.setSelectionRange(position, position)
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-2 py-1.5">
        <div className="flex flex-wrap items-center gap-0.5">
          <button
            type="button"
            className={toolbarButton}
            title="加粗"
            aria-label="加粗"
            onClick={() => apply('**', '**', '加粗文本')}
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            className={toolbarButton}
            title="斜体"
            aria-label="斜体"
            onClick={() => apply('*', '*', '斜体文本')}
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            className={toolbarButton}
            title="二级标题"
            aria-label="二级标题"
            onClick={() => prefixLine('## ')}
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            className={toolbarButton}
            title="列表"
            aria-label="列表"
            onClick={() => prefixLine('- ')}
          >
            <List size={16} />
          </button>
          <button
            type="button"
            className={toolbarButton}
            title="引用"
            aria-label="引用"
            onClick={() => prefixLine('> ')}
          >
            <Quote size={16} />
          </button>
          <button
            type="button"
            className={toolbarButton}
            title="链接"
            aria-label="链接"
            onClick={() => apply('[', '](https://)', '链接文字')}
          >
            <Link2 size={16} />
          </button>
          <button
            type="button"
            className={toolbarButton}
            title="行内代码"
            aria-label="行内代码"
            onClick={() => apply('`', '`', '代码')}
          >
            <Code2 size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => setMode('edit')}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
              mode === 'edit'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500',
            )}
          >
            <Pencil size={13} />
            编辑
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition',
              mode === 'preview'
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500',
            )}
          >
            <Eye size={13} />
            预览
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className={cn(mode === 'edit' ? 'block' : 'hidden', 'lg:block')}>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={18}
            spellCheck={false}
            placeholder="使用 Markdown 编写正文……"
            className="min-h-[380px] w-full resize-y border-0 bg-white px-4 py-3 font-mono text-sm leading-6 text-zinc-800 placeholder:text-zinc-400 focus:outline-none"
          />
        </div>

        <div
          className={cn(
            mode === 'preview' ? 'block' : 'hidden',
            'lg:block lg:border-l lg:border-zinc-200',
          )}
        >
          <div className="h-full min-h-[380px] bg-zinc-50/60 px-5 py-4">
            {value.trim() ? (
              <Markdown content={value} className="text-sm" />
            ) : (
              <p className="text-sm text-zinc-400">预览会显示在这里。</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-400">
        <span>支持 Markdown 与 GFM 表格、任务列表</span>
        <span>{value.length} 字符</span>
      </div>
    </div>
  )
}
