# 个人展示网站 TECH_DESIGN

| 项目 | 内容 |
| --- | --- |
| 项目名称 | Long 的个人展示网站（Profile） |
| 文档版本 | v1.0 |
| 编写日期 | 2026-10-17 |
| 对应 PRD | PRD.md v1.0 |
| 部署目标 | Cloudflare Pages（静态站点） |

## 1. 设计概述

本项目是一个**纯前端单页应用（SPA）**：展示端负责内容呈现，管理端负责在浏览器内编辑内容。项目不包含任何后端服务、数据库或第三方数据接口。

核心设计思想是「**默认数据 + 运行时覆盖 + 媒体本地存储**」：

1. 默认内容以 TypeScript 和 Markdown 文件的形式随项目一起构建，保证首次访问和所有访客都能看到完整内容。
2. 管理员在后台的修改写入 `localStorage`，只影响当前浏览器，刷新后仍然保留。
3. 头像和简历等二进制文件写入 `IndexedDB`，避免 localStorage 的 5MB 配额限制。
4. 提供「导出 JSON」功能，把当前浏览器中的修改导出，便于备份或固化到默认数据中。

## 2. 技术选型

| 层级 | 技术 | 版本 | 选择理由 |
| --- | --- | --- | --- |
| 构建工具 | Vite | 8.x | 启动快、构建快，静态产物可直接部署 |
| 前端框架 | React | 19.x | 组件化、生态成熟，适合管理端复杂表单 |
| 语言 | TypeScript | 6.x | strict 模式约束数据模型，减少运行时错误 |
| 路由 | React Router | 7.x | 声明式路由，支持动态参数与 404 |
| 样式 | Tailwind CSS | 3.4.x | 原子类快速实现响应式与设计系统 |
| 排版 | @tailwindcss/typography | 0.5.x | 为 Markdown 正文提供 `prose` 排版 |
| Markdown 渲染 | react-markdown + remark-gfm | 最新稳定版 | 纯前端渲染，默认不执行原始 HTML，安全 |
| 图标 | lucide-react | 最新稳定版 | 按需打包的 SVG 图标，风格统一 |
| 数据存储 | localStorage + IndexedDB | 浏览器原生 | 无后端、无第三方依赖 |
| 部署 | Cloudflare Pages | - | 免费、全球 CDN、自动 HTTPS、支持 GitHub 自动部署 |

**不引入**：后端框架、数据库、状态管理库（Redux/Zustand）、组件库（Ant Design/MUI）、CSS-in-JS。项目规模不需要这些依赖。

## 3. 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        浏览器                               │
│                                                             │
│  ┌──────────────┐        ┌──────────────────────────────┐   │
│  │   展示端      │        │          管理端 /admin       │   │
│  │  Home        │        │  Login → 基本信息 / 技能     │   │
│  │  Projects    │◄──────►│  项目 / 博客 / 媒体 / 数据   │   │
│  │  Blog        │  共享   │                              │   │
│  └──────┬───────┘  数据   └──────────────┬───────────────┘   │
│         │                               │                   │
│         ▼                               ▼                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              SiteDataContext（全局数据层）           │   │
│  │   loadSiteData / updateProfile / updateProjects ...  │   │
│  └──────────┬───────────────────────┬───────────────────┘   │
│             │                       │                       │
│             ▼                       ▼                       │
│  ┌────────────────────┐   ┌──────────────────────────────┐  │
│  │ 默认数据（构建时） │   │ localStorage（运行时覆盖）   │  │
│  │ profile.ts + md    │   │ profile / projects / blog    │  │
│  └────────────────────┘   └──────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ IndexedDB：头像 Blob / 简历 PDF Blob                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                 Cloudflare Pages（静态文件）
                 HTML / JS / CSS / public 资源
```

## 4. 目录结构

```
profile/
├── public/
│   ├── _redirects                  # Cloudflare Pages SPA 路由回退
│   ├── avatar-default.svg          # 默认头像
│   ├── favicon.svg                 # 站点图标
│   └── resume-sample.pdf           # 示例简历（可被后台上传替换）
├── scripts/
│   └── generate-resume.mjs         # 生成示例 PDF 的一次性脚本
├── src/
│   ├── components/
│   │   ├── admin/                  # 管理端组件
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── BasicInfoForm.tsx
│   │   │   ├── SkillsForm.tsx
│   │   │   ├── ProjectManager.tsx
│   │   │   ├── BlogManager.tsx
│   │   │   ├── MediaManager.tsx
│   │   │   ├── DataManager.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── MarkdownEditor.tsx
│   │   │   └── fields.tsx          # 表单输入组件
│   │   ├── blog/
│   │   │   └── BlogCard.tsx
│   │   ├── home/
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── FeaturedProjects.tsx
│   │   │   ├── LatestPosts.tsx
│   │   │   └── Contact.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PublicLayout.tsx
│   │   │   └── ScrollToTop.tsx
│   │   ├── projects/
│   │   │   └── ProjectCard.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Reveal.tsx
│   │       ├── SectionHeading.tsx
│   │       └── Tag.tsx
│   ├── content/
│   │   ├── blog/                   # 默认博客 Markdown
│   │   └── projects/               # 默认项目 Markdown
│   ├── context/
│   │   └── SiteDataContext.tsx     # 全局数据 Provider
│   ├── data/
│   │   ├── profile.ts              # 默认个人信息与技能
│   │   └── site.ts                 # 组装默认 SiteData
│   ├── hooks/
│   │   ├── useMediaUrl.ts          # IndexedDB Blob → object URL
│   │   └── usePageTitle.ts
│   ├── lib/
│   │   ├── content.ts              # 读取并解析默认 Markdown
│   │   ├── exportData.ts           # 导出 / 导入 / 恢复
│   │   ├── frontmatter.ts          # 轻量 frontmatter 解析
│   │   ├── media.ts                # IndexedDB 封装
│   │   ├── storage.ts              # localStorage 封装
│   │   └── utils.ts                # slug、日期、字节格式化
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProjectsPage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   ├── BlogListPage.tsx
│   │   ├── BlogDetailPage.tsx
│   │   ├── AdminPage.tsx
│   │   └── NotFoundPage.tsx
│   ├── App.tsx
│   ├── config.ts                   # 站点配置、后台口令
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── AGENTS.md
├── PRD.md
├── TECH_DESIGN.md
├── README.md
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig*.json
└── vite.config.ts
```

## 5. 数据模型

所有类型集中定义在 `src/types.ts`：

```ts
export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Profile {
  name: string;
  englishName: string;
  role: string;
  tagline: string;
  bio: string;              // 多段文本，用空行分段
  location: string;
  email: string;
  github: string;
  website?: string;
  skills: SkillGroup[];
}

export interface Project {
  slug: string;
  title: string;
  period: string;
  summary: string;
  tech: string[];
  link?: string;
  repo?: string;
  featured: boolean;
  order: number;
  content: string;          // Markdown 正文
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;             // YYYY-MM-DD
  tags: string[];
  summary: string;
  content: string;          // Markdown 正文
}

export interface SiteData {
  profile: Profile;
  projects: Project[];
  blog: BlogPost[];
}

export interface MediaMeta {
  name: string;
  size: number;
  type: string;
  updatedAt: string;        // ISO 时间
}

export interface MediaState {
  avatar?: MediaMeta;
  resume?: MediaMeta;
}

export interface ExportBundle extends SiteData {
  version: 1;
  exportedAt: string;
  media: {
    avatar?: { meta: MediaMeta; dataUrl: string };
    resume?: { meta: MediaMeta; dataUrl: string };
  };
}
```

### 5.1 Markdown frontmatter 约定

项目文件 `src/content/projects/*.md`：

```markdown
---
title: 项目名称
period: 2026.03 - 2026.06
summary: 一句话摘要
tech: React, TypeScript, Vite
link: https://example.com
repo: https://github.com/example/repo
featured: true
order: 1
---

正文 Markdown
```

博客文件 `src/content/blog/*.md`：

```markdown
---
title: 文章标题
date: 2026-10-01
tags: 前端, 随笔
summary: 一句话摘要
---

正文 Markdown
```

解析规则：

- 文件以 `---` 开头，第二行到下一个 `---` 之间为 frontmatter。
- 每行按第一个 `:` 分割 key/value，值去除首尾空格与成对引号。
- 数组字段（`tech`、`tags`）按逗号分割。
- `featured` 解析为布尔值，`order` 解析为数字。
- slug 优先取 frontmatter 中的 `slug`，否则取文件名（去掉 `.md`）。

## 6. 存储设计

### 6.1 存储分层

| 层级 | 介质 | 内容 | 生命周期 |
| --- | --- | --- | --- |
| 默认数据 | 源码（TS/MD） | 初始个人信息、项目、文章 | 随构建发布，所有访客可见 |
| 运行时覆盖 | localStorage | 管理员修改后的文本数据 | 当前浏览器，永久直到清除 |
| 媒体文件 | IndexedDB | 头像 Blob、简历 Blob | 当前浏览器，永久直到清除 |
| 登录状态 | sessionStorage | 后台是否已登录 | 当前标签页会话 |

### 6.2 Key 命名

```ts
export const STORAGE_KEYS = {
  profile: 'profile.v1.profile',
  projects: 'profile.v1.projects',
  blog: 'profile.v1.blog',
  mediaMeta: 'profile.v1.mediaMeta',
  admin: 'profile.v1.admin',
} as const;
```

IndexedDB：

- 数据库：`profile-media`
- 版本：`1`
- Object store：`files`
- Key：`avatar`、`resume`

### 6.3 读取与合并

```ts
function loadSiteData(): SiteData {
  const defaults = getDefaultSiteData();
  return {
    profile: readJSON<Profile>(STORAGE_KEYS.profile) ?? defaults.profile,
    projects: readJSON<Project[]>(STORAGE_KEYS.projects) ?? defaults.projects,
    blog: readJSON<BlogPost[]>(STORAGE_KEYS.blog) ?? defaults.blog,
  };
}
```

- `readJSON` 内部 `try/catch`，解析失败返回 `null`。
- 只有当 localStorage 中存在合法数据时才覆盖默认值；否则完整回退。
- 媒体文件不进入 SiteData，由 `useMediaUrl` 在组件层按需读取。

### 6.4 配额与限制

| 介质 | 典型配额 | 本项目策略 |
| --- | --- | --- |
| localStorage | 约 5MB / origin | 只存文本，不存 base64 文件 |
| IndexedDB | 通常为磁盘可用空间的较大比例 | 存头像与简历 Blob，限制简历 10MB |
| sessionStorage | 约 5MB / origin | 只存一个登录标记 |

## 7. 核心流程

### 7.1 应用启动

1. `content.ts` 通过 `import.meta.glob` 在构建时收集所有默认 Markdown 文件。
2. `site.ts` 合并默认 profile、projects、blog，得到 `defaultSiteData`。
3. `SiteDataProvider` 调用 `loadSiteData()`，得到当前生效数据。
4. 路由渲染页面；子组件通过 Context 读取数据。

### 7.2 保存文本内容

1. 管理端表单在本地 state 中编辑。
2. 点击保存后调用 Context 的 `updateProfile` / `updateProjects` / `updateBlog`。
3. Context 更新 React state，并同步写入 localStorage。
4. 展示端因 Context 变化自动重新渲染。
5. 保存成功显示轻提示；失败（如配额不足）捕获异常并提示。

### 7.3 头像上传

```
选择图片 → 校验类型 → 读取为 Image
        → Canvas 等比缩放到最长边 512px
        → canvas.toBlob('image/webp', 0.85)
        → IndexedDB.put('avatar', blob)
        → localStorage 写入 mediaMeta.avatar
        → refreshMedia() 通知组件重新读取
        → useMediaUrl 生成 object URL 并渲染
```

- 若浏览器不支持 WebP 输出，回退为 `image/jpeg`。
- 上传后调用 `URL.revokeObjectURL` 释放旧的 object URL。
- 移除头像时删除 IndexedDB 记录和元数据，组件回退到 `/avatar-default.svg`。

### 7.4 简历上传

```
选择 PDF → 校验类型与大小（≤10MB）
        → IndexedDB.put('resume', blob)
        → localStorage 写入 mediaMeta.resume
        → refreshMedia()
        → 后台用 object URL 在 iframe 中预览
        → 前台下载按钮指向 object URL，download 属性使用原始文件名
```

- 简历预览使用浏览器原生 PDF 查看器，不引入 pdf.js。
- 下载链接在组件卸载时释放 object URL。

### 7.5 导出

1. 从 Context 读取 profile、projects、blog。
2. 从 IndexedDB 读取头像/简历 Blob，使用 `FileReader` 转为 data URL。
3. 组装 `ExportBundle`，`JSON.stringify` 后下载为 `profile-export-YYYYMMDD.json`。
4. 文件包含媒体 base64，可能较大，界面提示预计大小。

### 7.6 导入

1. 读取用户选择的 JSON 文件，`JSON.parse` 并校验 `version` 与必要字段。
2. 文本数据写入 localStorage；媒体 data URL 通过 `fetch(dataUrl).blob()` 写回 IndexedDB。
3. 更新 Context 与媒体版本号，页面立即刷新。
4. 任一步失败则中止并提示，不清空原有数据。

### 7.7 恢复默认

1. 二次确认。
2. 删除所有 `profile.v1.*` localStorage key。
3. 清空 IndexedDB `files` store。
4. 重置 Context 为 `defaultSiteData`，媒体版本号自增。

## 8. Markdown 渲染

- 使用 `react-markdown` + `remark-gfm`。
- 不启用 `rehype-raw`，原始 HTML 不会被执行，降低 XSS 风险。
- 自定义组件：
  - `a`：外部链接自动加 `target="_blank"` 与 `rel="noreferrer"`。
  - `img`：`loading="lazy"`，最大宽度 100%。
  - `code`：行内代码与代码块分别处理，代码块保留横向滚动。
- 正文外层使用 `prose prose-zinc max-w-none`，与站点配色一致。
- 后台编辑器与前台详情页使用同一个 `Markdown` 渲染组件，保证预览一致。

## 9. 路由设计

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/` | HomePage | 首页，聚合各模块 |
| `/projects` | ProjectsPage | 全部项目 |
| `/projects/:slug` | ProjectDetailPage | 项目详情 |
| `/blog` | BlogListPage | 博客列表 |
| `/blog/:slug` | BlogDetailPage | 博客详情 |
| `/admin` | AdminPage | 登录 + 管理面板 |
| `*` | NotFoundPage | 404 |

- 使用 `BrowserRouter`。
- `ScrollToTop` 在路由变化时回到页面顶部。
- `usePageTitle` 根据页面内容设置 `document.title`。
- `public/_redirects` 内容为 `/* /index.html 200`，保证 Cloudflare Pages 刷新子路由不 404。

## 10. 视觉与设计系统

### 10.1 风格

现代简约浅色：大面积留白、低饱和中性色、单一强调色、卡片与细边框、克制的动效。整体观感接近正式个人主页，而不是模板化后台。

### 10.2 设计 Token

| Token | 值 | 用途 |
| --- | --- | --- |
| 背景 | `#fafafa` / `#ffffff` | 页面底色 / 卡片 |
| 主文字 | `zinc-900` | 标题、正文 |
| 次文字 | `zinc-500` / `zinc-600` | 辅助信息 |
| 边框 | `zinc-200` | 卡片、分割线 |
| 强调色 | `blue-600` (`#2563eb`) | 链接、按钮、选中态 |
| 圆角 | `rounded-xl` / `rounded-2xl` | 卡片、输入框 |
| 阴影 | 极轻的 `shadow-sm`，hover 时加深 | 卡片层次 |
| 字体 | 系统无衬线栈 + 中文回退 | 保证国内加载速度 |

字体栈：

```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
  "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

不加载外部字体，避免 Google Fonts 在国内不可用导致首屏闪烁。

### 10.3 响应式

- 容器最大宽度 `1120px`，左右 padding `24px`。
- 首页 Hero 桌面双栏（文字 + 头像），移动端单栏。
- 项目/文章卡片桌面 2～3 列，移动端 1 列。
- 管理端桌面左侧导航 + 右侧内容；移动端顶部横向 tab。
- Markdown 编辑器桌面分屏，移动端「编辑 / 预览」切换。

### 10.4 动效

- 首屏元素 `fade-up`，进入视口时触发。
- 卡片 hover：轻微上移 + 边框加深。
- 所有过渡时长 150–250ms。
- `prefers-reduced-motion: reduce` 时关闭动画。

## 11. 构建与部署

### 11.1 本地命令

```bash
npm install
npm run dev       # 本地开发
npm run build     # 类型检查 + 生产构建，输出 dist/
npm run preview   # 预览生产构建
npm run lint      # oxlint 静态检查
```

### 11.2 Cloudflare Pages 配置

| 配置项 | 值 |
| --- | --- |
| 连接方式 | 连接 GitHub 仓库 `LongPPPP/profile` |
| 生产分支 | `main` |
| 框架预设 | Vite |
| 构建命令 | `npm run build` |
| 构建输出目录 | `dist` |
| Node 版本 | 22（通过环境变量 `NODE_VERSION=22` 或 `.nvmrc`） |

### 11.3 SPA 路由

`public/_redirects`：

```
/* /index.html 200
```

构建后该文件会出现在 `dist/_redirects`，Cloudflare Pages 会自动识别。

### 11.4 资源路径

- 所有静态资源使用根路径 `/...`。
- 不使用相对路径，避免子路由刷新时资源 404。
- 默认头像、示例简历放在 `public/`，构建后位于站点根目录。

## 12. 测试策略

### 12.1 自动化检查

| 检查 | 命令 | 通过标准 |
| --- | --- | --- |
| 类型检查 | `npm run build` 中的 `tsc -b` | 无 TypeScript 错误 |
| 生产构建 | `npm run build` | 构建成功，无阻断性警告 |
| 静态检查 | `npm run lint` | 无 error |

### 12.2 手工验收

按 PRD 第 8 节验收清单逐项检查，重点：

1. 桌面 1440px、平板 768px、手机 390px 三档截图。
2. 后台上传头像/简历后刷新页面，确认 IndexedDB 持久化。
3. 导出 → 恢复默认 → 导入，确认数据完整恢复。
4. 直接访问 `/blog/:slug` 刷新，确认 Cloudflare Pages 回退正常。
5. 键盘 Tab 遍历导航、表单、按钮，确认 focus 可见。

## 13. 安全与隐私

| 项目 | 说明 |
| --- | --- |
| 后台口令 | `src/config.ts` 中的常量，仅用于遮挡界面。前端代码公开，不能作为真实安全边界 |
| 敏感数据 | 仓库和网站中不存放密码、token、私钥、身份证号等敏感信息 |
| 上传文件 | 仅保存在访问者本地 IndexedDB，不上传到任何服务器 |
| Markdown | 不渲染原始 HTML，避免 XSS |
| 外部链接 | 使用 `rel="noreferrer noopener"` |
| 第三方脚本 | 不引入统计、广告、追踪脚本 |

## 14. 性能设计

- Vite 生产构建自动压缩 JS/CSS。
- `lucide-react` 按需导入具名图标，避免整包引入。
- 页面路由不做懒加载（项目规模小，避免额外请求），如后续体积增长可使用 `React.lazy`。
- 默认头像使用 SVG，体积小、任意缩放清晰。
- 项目卡片不加载封面大图，减少首屏请求。
- 构建产物目标：JS gzip < 300KB。

## 15. 已知限制

1. 后台修改只对当前浏览器生效，其他访客看到的是默认数据。这是纯前端、无数据库方案的固有限制。
2. 清除浏览器站点数据后，后台修改和上传的文件会丢失。
3. 纯前端口令可被绕过，不适合存放真实隐私内容。
4. 示例简历为英文占位内容，需站主在后台替换为自己的 PDF。
5. 简历预览依赖浏览器内置 PDF 查看器，极少数旧浏览器可能不支持内嵌预览，但仍可下载。
