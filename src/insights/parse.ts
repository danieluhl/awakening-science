// INSIGHTS.md, read as a book. The file is the only source: add a "# Heading" and a new chapter appears.
// The first "# Heading" and the words under it are the cover; every later "# Heading" opens a chapter,
// and "## Headings" inside a chapter become its sections.
import raw from '../../INSIGHTS.md?raw'

export type Block =
  | { kind: 'h'; level: 2 | 3; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'quote'; text: string }
  | { kind: 'list'; ordered: boolean; start: number; items: string[][] }

export interface Chapter {
  title: string
  blocks: Block[]
}

const ITEM = /^(\s*)(\d+)[.)]\s+|^(\s*)[-*+]\s+/

function blocksOf(lines: string[]): Block[] {
  const out: Block[] = []
  let i = 0
  const blank = (l: string | undefined) => l === undefined || l.trim() === ''
  while (i < lines.length) {
    const line = lines[i]
    if (blank(line)) {
      i++
      continue
    }
    const h = /^(#{2,6})\s+(.*)$/.exec(line)
    if (h) {
      out.push({ kind: 'h', level: h[1].length === 2 ? 2 : 3, text: h[2].trim() })
      i++
      continue
    }
    if (/^\s*>/.test(line)) {
      const q: string[] = []
      while (i < lines.length && /^\s*>/.test(lines[i])) q.push(lines[i++].replace(/^\s*>\s?/, ''))
      out.push({ kind: 'quote', text: q.join(' ').trim() })
      continue
    }
    const m = ITEM.exec(line)
    if (m) {
      const ordered = m[2] !== undefined
      const items: string[][] = []
      // an item runs on through wrapped lines, and through blank lines when the next line is indented under it
      while (i < lines.length) {
        const im = ITEM.exec(lines[i])
        if (!im || (im[2] !== undefined) !== ordered) break
        const paras: string[] = [lines[i].slice(im[0].length).trim()]
        i++
        while (i < lines.length) {
          if (blank(lines[i])) {
            if (/^\s{2,}\S/.test(lines[i + 1] ?? '') && !ITEM.test(lines[i + 1])) {
              paras.push('')
              i++
              continue
            }
            break
          }
          if (ITEM.test(lines[i]) || /^#{1,6}\s/.test(lines[i])) break
          const t = lines[i].trim()
          paras[paras.length - 1] = paras[paras.length - 1] ? `${paras[paras.length - 1]} ${t}` : t
          i++
        }
        items.push(paras.filter(Boolean))
        // a blank line between items keeps the list going
        let j = i
        while (j < lines.length && blank(lines[j])) j++
        if (j < lines.length && ITEM.exec(lines[j]) && (ITEM.exec(lines[j])?.[2] !== undefined) === ordered) i = j
      }
      out.push({ kind: 'list', ordered, start: ordered ? Number(m[2]) : 1, items })
      continue
    }
    const p: string[] = []
    while (i < lines.length && !blank(lines[i]) && !/^#{1,6}\s/.test(lines[i]) && !ITEM.test(lines[i]) && !/^\s*>/.test(lines[i])) p.push(lines[i++].trim())
    out.push({ kind: 'p', text: p.join(' ') })
  }
  return out
}

function read(src: string) {
  const parts: { title: string; lines: string[] }[] = []
  for (const line of src.replace(/\r\n?/g, '\n').split('\n')) {
    const h = /^#\s+(.*)$/.exec(line)
    if (h) parts.push({ title: h[1].trim(), lines: [] })
    else if (parts.length) parts[parts.length - 1].lines.push(line)
  }
  const [cover, ...rest] = parts
  return {
    title: cover?.title ?? 'Insights',
    intro: cover ? blocksOf(cover.lines) : [],
    chapters: rest.map((c) => ({ title: c.title, blocks: blocksOf(c.lines) })) as Chapter[],
  }
}

export const INSIGHTS = read(raw)
