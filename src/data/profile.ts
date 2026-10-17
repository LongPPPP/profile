import type { Profile } from '../types'

export const defaultProfile: Profile = {
  name: 'Long',
  englishName: 'Long',
  role: '前端开发者 · 计算机专业学生',
  tagline: '用代码把想法变成可用的产品。',
  bio: [
    '你好，我是 Long，一名正在学习前端开发与工程化的计算机专业学生。',
    '我关注 React、TypeScript 与交互体验，也喜欢研究 AI 辅助开发的工作流。这个网站记录我的项目、文章和近期思考，欢迎通过邮件或 GitHub 联系我。',
  ].join('\n\n'),
  location: '大连 · 中国',
  email: 'hello@example.com',
  github: 'https://github.com/LongPPPP',
  website: '',
  skills: [
    {
      category: '前端开发',
      items: ['React', 'TypeScript', 'JavaScript', 'HTML / CSS', 'Tailwind CSS'],
    },
    {
      category: '工程与工具',
      items: ['Vite', 'Git / GitHub', 'ESLint', 'Figma', 'Markdown'],
    },
    {
      category: '正在探索',
      items: ['Node.js 基础', 'AI 辅助开发', '前端性能优化'],
    },
  ],
}
