# AGENTS.md — 开发规则与协作约定

本文件面向参与本项目开发的 AI 助手与人类开发者，定义项目结构、代码规范、数据规则、测试要求和交付标准。开始任何修改前，请先阅读本文件与 `PRD.md`、`TECH_DESIGN.md`。

## 1. 项目概述

- **项目**：Long 的个人展示网站（展示端 + 浏览器端管理后台）
- **形态**：纯前端 SPA，无后端、无数据库、无第三方数据接口
- **技术栈**：Vite 8 + React 19 + TypeScript 6 + Tailwind CSS 3.4 + React Router 7
- **内容存储**：默认数据为 TS/Markdown；运行时修改存 localStorage；头像/简历存 IndexedDB
- **部署**：GitHub `LongPPPP/profile` → Cloudflare Pages
- **语言**：界面、文档、注释优先使用中文；代码标识符使用英文

## 2. 常用命令

```bash
npm install        # 安装依赖
npm run dev        # 开发服务器
npm run build      # tsc -b && vite build（提交前必须通过）
npm run preview    # 预览 dist/
npm run lint       # oxlint 静态检查
```

## 3. 目录与职责

| 目录 | 职责 | 不要放什么 |
| --- | --- | --- |
| `src/pages/` | 路由页面，只做数据组装与布局 | 复杂表单逻辑、底层存储代码 |
| `src/components/` | 可复用 UI 组件 | 路由定义、直接读写 localStorage |
| `src/context/` | 全局数据状态与持久化入口 | 具体页面样式 |
| `src/lib/` | 纯函数与浏览器能力封装（存储、Markdown、导出） | React 组件、JSX |
| `src/data/` | 默认个人信息与站点数据组装 | 运行时状态 |
| `src/content/` | 默认项目/博客 Markdown | 组件代码 |
| `src/hooks/` | 可复用 React hooks | 页面级一次性逻辑 |
| `public/` | 随站点发布的静态资源 | 需要被 TypeScript 引用的源码 |
| `scripts/` | 一次性构建脚本 | 运行时依赖 |

## 4. TypeScript 规范

1. 保持 `strict` 模式，不使用 `any`；确需未知类型时使用 `unknown` 并做类型收窄。
2. 所有数据结构必须先在 `src/types.ts` 定义接口，禁止在组件中临时拼匿名对象类型。
3. 函数参数与返回值尽量显式标注；React 组件使用函数声明或 `const` + 箭头函数均可，但同一文件保持一致。
4. 使用 `type` 导入类型：`import type { Profile } from '../types'`。
5. 不使用非空断言 `!` 掩盖可能的空值；使用可选链、默认值或显式判断。
6. 事件处理函数命名：`handleXxx`；回调用 `onXxx`。
7. 避免 `enum`，使用字符串字面量联合类型。
8. 不引入 `@ts-ignore` / `@ts-expect-error`，除非有注释说明且确无替代方案。

## 5. React 规范

1. 只使用函数组件 + Hooks，不使用 class 组件。
2. 组件文件使用 PascalCase，一个文件一个主组件；辅助小组件可在同文件内定义但不超过 2 个。
3. Props 使用 `interface XxxProps` 定义并导出。
4. 副作用只放在 `useEffect` 中；`useEffect` 必须写清依赖数组，禁止留空依赖来“只跑一次”却引用外部变量。
5. 列表渲染必须提供稳定 `key`（优先使用 slug/id，不用数组索引）。
6. 不在渲染过程中读写 localStorage、IndexedDB 或修改全局变量。
7. 表单使用受控组件；提交时统一校验，错误提示放在字段下方。
8. 组件卸载时清理 object URL、定时器和事件监听。

## 6. 数据与存储规则

1. **单一数据源**：当前生效数据只从 `SiteDataContext` 读取，组件不得自行拼装另一份 profile/projects/blog。
2. **默认数据不可在运行时修改**：`src/data/profile.ts` 与 `src/content/**/*.md` 是构建时默认值，后台保存只能写 localStorage。
3. **Key 统一**：所有 localStorage key 从 `src/lib/storage.ts` 的 `STORAGE_KEYS` 读取，禁止在组件中写字符串 key。
4. **版本化**：key 形如 `profile.v1.xxx`；修改数据结构时升级版本号，并在读取时兼容或回退默认值。
5. **容错**：所有 `JSON.parse` 必须 `try/catch`；解析失败返回 `null`，页面回退默认数据，不白屏。
6. **文本与文件分离**：localStorage 只存文本和媒体元数据；图片/PDF 的 Blob 必须存 IndexedDB。
7. **媒体读取**：通过 `useMediaUrl` 获取 object URL；不要在组件中直接操作 IndexedDB。
8. **导出格式**：保持 `ExportBundle` 结构稳定，新增字段必须可选，避免旧备份无法导入。
9. **隐私**：不得把用户上传的文件、base64 数据或个人信息发送到任何第三方服务。

## 7. 样式规范

1. 使用 Tailwind 原子类，不新增全局 CSS，除非是实现动画、滚动条、prose 微调等 Tailwind 不擅长的情况。
2. 颜色只使用设计 token：`zinc` 中性色 + `blue-600` 强调色；不要在组件中随意引入新色值。
3. 间距使用 4 的倍数（`p-4`、`py-16`、`gap-6` 等）；卡片圆角统一 `rounded-2xl`，输入框 `rounded-xl`。
4. 文本层级：页面主标题 `text-4xl/5xl font-semibold tracking-tight`，区块标题 `text-2xl/3xl`，正文 `text-zinc-600 leading-7`。
5. 所有交互元素必须有 `hover` 与 `focus-visible` 状态；禁用状态使用 `disabled:opacity-50 disabled:cursor-not-allowed`。
6. 响应式优先：先写移动端，再用 `sm:`、`md:`、`lg:` 增强；禁止出现横向滚动。
7. 动画克制：150–250ms；尊重 `prefers-reduced-motion`。
8. 不引入外部字体与图片 CDN；图标使用 `lucide-react` 具名导入。

## 8. Markdown 规则

1. 默认内容文件必须包含 frontmatter，字段与 `TECH_DESIGN.md` 第 5.1 节一致。
2. 正文使用标准 Markdown + GFM；表格、任务列表、代码块可直接使用。
3. 渲染统一走 `Markdown` 组件；禁止使用 `dangerouslySetInnerHTML`。
4. 后台编辑器的预览与前台详情页必须使用同一渲染组件，避免样式/语法差异。
5. 代码块必须标注语言，便于高亮与阅读。

## 9. 开发流程

1. **一次只做一个功能**：按 PRD 的 FR 编号推进，完成、自测、通过后再做下一个。
2. **先数据后界面**：新增字段时先改 `types.ts`、默认数据、存储读取，再改表单与展示。
3. **每个功能完成后自测**：
   - `npm run build` 必须通过；
   - `npm run lint` 无 error；
   - 手动走一遍正常流程 + 一个异常流程（空值、非法文件、超限文件、错误 slug）。
4. **每完成一个可交付阶段做一次提交**，提交信息见第 11 节。
5. 遇到构建/运行错误，先读完整错误信息与相关文件，不要盲目改配置；修复后重新跑完整构建。
6. 不确定需求时，优先遵守 `PRD.md` 的范围；超出范围的改动先说明再做。

## 10. 测试要求

### 10.1 每次提交前

- [ ] `npm run build` 成功
- [ ] `npm run lint` 无 error
- [ ] 浏览器控制台无 error
- [ ] 新增/修改的功能在 1440px 与 390px 宽度下均正常

### 10.2 功能自测清单

- [ ] 首页各模块有内容时正常展示，无内容时显示空状态
- [ ] 路由跳转、刷新、直接访问详情页均正常
- [ ] 后台错误口令无法进入
- [ ] 基本信息保存后刷新仍保留
- [ ] 项目/博客增删改后前台同步
- [ ] slug 重复/非法时给出提示
- [ ] 头像上传后立即生效，移除后恢复默认
- [ ] 简历上传后下载的是新文件，移除后恢复示例
- [ ] 导出 → 恢复默认 → 导入 闭环正常
- [ ] 手机端导航、表单、编辑器可正常操作

### 10.3 回归重点

修改存储层或 Context 后，必须重新验证：保存、刷新、导出、导入、恢复默认五项。

## 11. Git 规范

### 11.1 分支

- `main`：可部署分支，保持随时可构建。
- 功能开发可在本地直接提交到 `main`（单人项目），但每次提交必须可构建。

### 11.2 提交信息

使用 Conventional Commits 前缀：

```
feat: 新增博客详情页
fix: 修复头像移除后仍显示旧图
docs: 更新 TECH_DESIGN 存储说明
style: 调整首页间距
refactor: 拆分管理端表单组件
chore: 升级依赖
```

- 一条提交只做一件事。
- 不提交 `node_modules/`、`dist/`、`.env`、本地截图和临时文件。

### 11.3 提交前检查

```bash
git status
git diff --stat
npm run build
```

## 12. 禁止事项

1. 禁止引入后端服务、数据库、云函数或第三方数据接口。
2. 禁止把头像/简历上传到外部存储；文件只能留在 IndexedDB。
3. 禁止把密码、token、密钥写入源码或提交到仓库。
4. 禁止使用 `dangerouslySetInnerHTML` 渲染 Markdown 或用户输入。
5. 禁止在组件中直接写死个人信息、项目、文章内容。
6. 禁止为了通过构建而使用 `any`、`@ts-ignore` 或删除类型检查。
7. 禁止删除或绕过 `public/_redirects`，否则 Cloudflare Pages 子路由会 404。
8. 禁止在未确认的情况下执行 `git push --force`、重置远程分支等破坏性操作。

## 13. 完成定义（Definition of Done）

一个功能只有同时满足以下条件才算完成：

1. 符合 PRD 中对应 FR 的验收标准。
2. TypeScript 无错误，`npm run build` 与 `npm run lint` 通过。
3. 桌面与手机端均可用，无布局溢出。
4. 空状态、错误状态、超限状态有明确提示。
5. 不破坏已有功能（回归五项通过）。
6. 相关文档（PRD/TECH_DESIGN/README）如有必要已同步更新。
7. 代码中无调试 `console.log`、无用注释和临时文件。
