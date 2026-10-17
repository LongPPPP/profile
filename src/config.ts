export const SITE_CONFIG = {
  /** 展示用站点名，可在后台修改个人信息中的姓名 */
  siteName: 'Long',
  /** 纯前端演示口令，仅用于遮挡管理界面，不是真正的安全边界 */
  adminPassword: 'admin123',
  defaultAvatar: '/avatar-default.svg',
  defaultResume: '/resume-sample.pdf',
  defaultResumeName: 'Long-前端开发-简历.pdf',
  maxResumeSize: 10 * 1024 * 1024,
  avatarMaxSize: 512,
  avatarQuality: 0.85,
} as const

export const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: '项目', href: '/projects' },
  { label: '博客', href: '/blog' },
  { label: '关于', href: '/#about' },
] as const
