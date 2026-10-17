# Long | 个人主页

一个纯前端的个人展示网站，包含**展示端**与**浏览器内管理后台**。项目不使用任何后端服务或数据库：默认内容来自 TypeScript / Markdown 文件，后台修改后的内容保存在浏览器 `localStorage`，头像与简历等媒体文件保存在 `IndexedDB`。

> 这是课程作业项目，站点中的姓名、邮箱、项目与文章均为占位内容，请在管理后台或源文件中替换。

## 功能

- 首页：个人简介、技能、精选项目、最新文章、联系方式
- 项目页与项目详情页（Markdown 正文）
- 博客列表与文章详情页（Markdown 正文、标签、阅读时长）
- 管理后台 `/admin`：
  - 基本信息与技能编辑
  - 项目、文章的增删改，Markdown 编辑器带实时预览
  - 头像上传（自动压缩为 WebP/JPEG）与简历 PDF 上传、预览、下载
  - 数据导出 / 导入（JSON，含 Base64 媒体）与一键恢复默认
- 响应式布局、移动端导航、减少动效偏好支持

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS + `@tailwindcss/typography`
- React Router
- `react-markdown` + `remark-gfm`
- `lucide-react` 图标
- IndexedDB（媒体文件）与 `localStorage`（文本内容）

## 本地运行

要求 Node.js 22+。

```bash
npm install
npm run dev
```

- 展示端：`http://localhost:5173/`
- 管理后台：`http://localhost:5173/admin`
- 演示密码：`admin123`（见 `src/config.ts`）

生产构建与本地预览：

```bash
npm run build
npm run preview
```

代码检查：

```bash
npm run lint
```

重新生成占位简历 PDF：

```bash
node scripts/generate-resume.mjs
```

## 数据是怎么保存的

| 数据 | 默认来源 | 运行时覆盖 |
| --- | --- | --- |
| 基本信息、技能 | `src/data/profile.ts` | `localStorage` |
| 项目 | `src/content/projects/*.md` | `localStorage` |
| 文章 | `src/content/blog/*.md` | `localStorage` |
| 头像、简历 | `public/` 下的占位文件 | `IndexedDB` |

这意味着：

1. 后台的修改**只对当前浏览器生效**，不会自动写回 GitHub，也不会影响其他访客。
2. 想让所有访客看到你的真实内容，有两种方式：
   - 直接在 `src/data/profile.ts` 和 `src/content/**/*.md` 中修改默认数据；
   - 在后台录入内容后使用「数据管理 → 导出数据」，再把导出的 JSON / 媒体文件整理进默认数据（详见 `TECH_DESIGN.md` 的「数据发布」一节）。
3. 清理浏览器站点数据会清空后台修改，站点会回到仓库中的默认内容。
4. 管理密码只做界面层演示，不是真正的安全机制；任何人都可以打开 `/admin` 并修改自己浏览器里的数据。

## 部署到 Cloudflare Pages

1. 将仓库推送到 GitHub（本项目的目标仓库：`https://github.com/LongPPPP/profile`）。
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
3. 选择仓库 `LongPPPP/profile`，构建配置如下：
   - Framework preset：`Vite`
   - Build command：`npm run build`
   - Build output directory：`dist`
   - Node version：`22`（仓库已提供 `.nvmrc`）
4. 保存并部署，完成后会得到一个 `https://<project>.pages.dev` 域名。
5. `public/_redirects` 已配置 SPA 回退（`/* /index.html 200`），直接访问 `/projects/xxx` 等路由不会 404。

也可以使用 Vercel：导入仓库后，Framework 选择 Vite，Build Command 为 `npm run build`，Output Directory 为 `dist`。

## 目录结构

```text
profile/
├─ public/                 # 静态资源、默认头像/简历、_redirects
├─ scripts/                # 辅助脚本（占位简历 PDF 生成）
├─ src/
│  ├─ components/          # 展示端与后台组件
│  ├─ content/             # 默认项目与文章（Markdown）
│  ├─ context/             # 站点数据 Context
│  ├─ data/                # 默认个人信息
│  ├─ hooks/               # 页面标题、媒体 URL
│  ├─ lib/                 # 存储、媒体、Markdown、导出等工具
│  ├─ pages/               # 路由页面
│  ├─ App.tsx              # 路由与全局 Provider
│  └─ config.ts            # 站点与后台配置
├─ PRD.md                  # 产品需求文档
├─ TECH_DESIGN.md          # 技术设计文档
└─ AGENTS.md               # 协作与开发规范
```

## 已知限制

- 纯前端方案没有服务端鉴权与持久化；后台修改仅保存在当前浏览器。
- 管理后台不做多人协作、版本回滚与冲突处理。
- 上传的 PDF 仅校验类型与大小，不做内容解析。
- Markdown 渲染禁用原始 HTML，以避免 XSS。

更多设计细节见 `PRD.md`、`TECH_DESIGN.md` 与 `AGENTS.md`。
