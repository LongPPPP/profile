// 生成一份占位简历 PDF，供默认站点的“下载简历”和后台预览功能使用。
// 运行：node scripts/generate-resume.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outputPath = join(here, '..', 'public', 'resume-sample.pdf')

const BS = String.fromCharCode(92)
const escapeText = (value) =>
  value
    .split(BS).join(BS + BS)
    .split('(').join(BS + '(')
    .split(')').join(BS + ')')

const text = (x, y, value, { font = 'F1', size = 9.5, tone = 0 } = {}) =>
  `BT ${tone} ${tone} ${tone} rg /${font} ${size} Tf 1 0 0 1 ${x} ${y} Tm (${escapeText(value)}) Tj ET`

const rule = (y) => `0.86 0.86 0.86 RG 0.7 w 56 ${y} m 539 ${y} l S`

const content = [
  text(56, 776, 'LONG', { font: 'F2', size: 28 }),
  text(56, 748, 'Frontend Developer / Computer Science Student', { size: 12, tone: 0.35 }),
  text(56, 730, 'Dalian, China  |  hello@example.com  |  github.com/LongPPPP', { size: 9, tone: 0.35 }),
  rule(714),

  text(56, 690, 'PROFILE', { font: 'F2', size: 10.5 }),
  rule(683),
  text(56, 664, 'Frontend developer focused on React, TypeScript and interaction design.', { size: 9.5, tone: 0.2 }),
  text(56, 649, 'Comfortable building maintainable interfaces and exploring AI-assisted workflows.', { size: 9.5, tone: 0.2 }),

  text(56, 612, 'EDUCATION', { font: 'F2', size: 10.5 }),
  rule(605),
  text(56, 586, 'Dalian Maritime University - Computer Science', { font: 'F2', size: 9.5 }),
  text(56, 571, '2023 - 2027 (expected)', { size: 9.5, tone: 0.4 }),

  text(56, 534, 'SKILLS', { font: 'F2', size: 10.5 }),
  rule(527),
  text(56, 508, 'Frontend: React, TypeScript, JavaScript, HTML/CSS, Tailwind CSS', { size: 9.5, tone: 0.2 }),
  text(56, 493, 'Tools: Vite, Git/GitHub, ESLint, Figma, Markdown', { size: 9.5, tone: 0.2 }),
  text(56, 478, 'Exploring: Node.js basics, AI-assisted development, web performance', { size: 9.5, tone: 0.2 }),

  text(56, 441, 'PROJECTS', { font: 'F2', size: 10.5 }),
  rule(434),

  text(56, 414, 'Personal Profile Website - 2026', { font: 'F2', size: 9.5 }),
  text(56, 399, 'A maintainable personal homepage with a browser-based admin panel.', { size: 9.5, tone: 0.2 }),
  text(56, 386, 'React / TypeScript / Vite / IndexedDB', { size: 9, tone: 0.4 }),

  text(56, 356, 'Campus Marketplace - 2025', { font: 'F2', size: 9.5 }),
  text(56, 341, 'A second-hand trading platform with search, categories and listings.', { size: 9.5, tone: 0.2 }),
  text(56, 328, 'React / TypeScript / Supabase', { size: 9, tone: 0.4 }),

  text(56, 298, 'Markdown Notes - 2024', { font: 'F2', size: 9.5 }),
  text(56, 283, 'An offline-first Markdown editor with live preview and local storage.', { size: 9.5, tone: 0.2 }),
  text(56, 270, 'Vue 3 / TypeScript / IndexedDB', { size: 9, tone: 0.4 }),

  rule(84),
  text(56, 70, 'Placeholder resume for the personal profile demo. Replace it from the admin panel.', { size: 8, tone: 0.5 }),
].join('\n')

const objects = [
  null,
  '<< /Type /Catalog /Pages 2 0 R >>',
  '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
  '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>',
  `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`,
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
  '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
]

let pdf = '%PDF-1.4\n%âãÏÓ\n'
const offsets = new Array(objects.length).fill(0)

for (let i = 1; i < objects.length; i += 1) {
  offsets[i] = Buffer.byteLength(pdf, 'latin1')
  pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`
}

const xrefOffset = Buffer.byteLength(pdf, 'latin1')
pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`
for (let i = 1; i < objects.length; i += 1) {
  pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
}
pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, Buffer.from(pdf, 'latin1'))
console.log(`Wrote ${outputPath} (${Buffer.byteLength(pdf, 'latin1')} bytes)`)
