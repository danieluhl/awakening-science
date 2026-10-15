import { Fragment, useCallback, useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CHAPTERS as SIT_CHAPTERS } from '../sit/pages'
import { PALETTES, Plate } from '../sit/scenes'
import { INSIGHTS } from './parse'
import type { Block } from './parse'

// Dan's own notes, from INSIGHTS.md, as a book that turns like "How to sit".
// Spread 0 is the cover, 1..n are the file's chapters, and the last spread closes the book.
// A chapter is often longer than the screen, so each page scrolls on its own and a turn starts at its top.
const { title, intro, chapters } = INSIGHTS
const LAST = chapters.length + 1
const SETTLE = 1900 // how long a leaving page lingers before it is taken away

// each chapter borrows a quiet plate and the colours of the How to sit book, in turn
const SCENES = ['enso', 'own-light', 'singing-bowl', 'footprints', 'ripples', 'widening', 'journey', 'moon', 'stones', 'morning', 'heart-glow', 'clouds-part']
const PALS = [PALETTES.what, PALETTES.sit, PALETTES.practice, PALETTES.day]
const look = (n: number) => ({
  scene: n === 0 ? 'enso' : n === LAST ? 'end' : SCENES[(n - 1) % SCENES.length],
  p: n === 0 || n === LAST ? PALETTES.sit : PALS[(n - 1) % PALS.length],
  bg: SIT_CHAPTERS[n === 0 || n === LAST ? 1 : (n - 1) % SIT_CHAPTERS.length].bg,
})

// leave for another page of the site with the same slow fade the book uses
function leaveTo(href: string) {
  document.body.classList.add('leaving')
  setTimeout(() => window.location.assign(href), 1300)
}

// the few marks the notes use: _italic_, *italic*, **bold**, `code` and [links](...)
function inline(text: string): ReactNode[] {
  const out: ReactNode[] = []
  const re = /\*\*(.+?)\*\*|(?<![\w])_(.+?)_(?![\w])|(?<![\w*])\*(?!\s)(.+?)\*(?![\w*])|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g
  let last = 0
  let k = 0
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[1]) out.push(<strong key={k++}>{inline(m[1])}</strong>)
    else if (m[2] || m[3]) out.push(<em key={k++}>{inline(m[2] ?? m[3])}</em>)
    else if (m[4]) out.push(<code key={k++}>{m[4]}</code>)
    else if (m[5])
      out.push(
        <a key={k++} href={m[6]} target="_blank" rel="noopener">
          {inline(m[5])}
        </a>,
      )
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

// a heading's words without its marks, for tooltips and labels
const plain = (text: string) => text.replace(/\*\*(.+?)\*\*|(?<![\w])_(.+?)_(?![\w])|`([^`]+)`/g, (_, a, b, c) => a ?? b ?? c)

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        const key = `${b.kind}${i}`
        if (b.kind === 'h') return b.level === 2 ? <h3 key={key}>{inline(b.text)}</h3> : <h4 key={key}>{inline(b.text)}</h4>
        if (b.kind === 'quote') return <blockquote key={key}>{inline(b.text)}</blockquote>
        if (b.kind === 'p') return <p key={key}>{inline(b.text)}</p>
        const items = b.items.map((paras, j) => (
          <li key={`${key}-${j}`}>
            {paras.map((t, x) => (
              <Fragment key={x}>{paras.length > 1 ? <p>{inline(t)}</p> : inline(t)}</Fragment>
            ))}
          </li>
        ))
        return b.ordered ? (
          <ol key={key} start={b.start}>
            {items}
          </ol>
        ) : (
          <ul key={key}>{items}</ul>
        )
      })}
    </>
  )
}

export function InsightsBook() {
  // every page on screen is a layer; the newest one is the page being read, older ones are fading away
  const [layers, setLayers] = useState<{ n: number; id: number }[]>([{ n: 0, id: 0 }])
  const [live, setLive] = useState(-1)
  const want = useRef(0)
  const nextId = useRef(1)
  const uid = useId().replace(/:/g, '')
  const at = layers[layers.length - 1].n

  // the colours of the page follow the chapter, easing over a few seconds
  useEffect(() => {
    const bg = look(at).bg
    const root = document.documentElement
    root.style.setProperty('--a', bg[0])
    root.style.setProperty('--b', bg[1])
    root.style.setProperty('--c', bg[2])
  }, [at])

  // first arrival: the whole page fades up
  useEffect(() => {
    const start = Number.parseInt(location.hash.slice(1), 10)
    if (start > 0 && start <= LAST) {
      want.current = start
      setLayers([{ n: start, id: 0 }])
    }
    const t = setTimeout(() => {
      document.body.classList.add('arrived')
      setLive(0)
    }, 120)
    // coming back with the browser's back button can restore a faded-out page; bring it back
    const onShow = () => document.body.classList.remove('leaving')
    addEventListener('pageshow', onShow)
    return () => {
      clearTimeout(t)
      removeEventListener('pageshow', onShow)
      document.body.classList.remove('arrived', 'leaving')
      for (const p of ['--a', '--b', '--c']) document.documentElement.style.removeProperty(p)
    }
  }, [])

  // the page number lives in the address (#4), so a page can be linked to and survives a reload
  useEffect(() => {
    history.replaceState(null, '', at ? `#${at}` : location.pathname)
  }, [at])

  // turning a page never waits: the new page starts fading in at once, even mid-turn
  const go = useCallback((n: number) => {
    const target = Math.max(0, Math.min(LAST, n))
    if (target === want.current) return
    want.current = target
    const id = nextId.current++
    setLayers((ls) => [...ls.slice(-2), { n: target, id }])
    setTimeout(() => {
      setLive(id)
      setTimeout(() => setLayers((ls) => ls.filter((l) => l.id >= id)), SETTLE)
    }, 40)
  }, [])

  useEffect(() => {
    const onHash = () => {
      const n = Number.parseInt(location.hash.slice(1), 10)
      if (n > 0) go(n)
    }
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [go])

  const next = useCallback(() => go(want.current + 1), [go])
  const prev = useCallback(() => go(want.current - 1), [go])

  // left and right turn the page; space, page up and down are left to scroll the long chapters
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prev()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [next, prev])

  // a sideways swipe of a finger turns the page (a mouse drag is left free for selecting words)
  const start = useRef<{ x: number; y: number } | null>(null)
  const onDown = (e: React.PointerEvent) => {
    start.current = e.pointerType === 'touch' ? { x: e.clientX, y: e.clientY } : null
  }
  const onUp = (e: React.PointerEvent) => {
    if (!start.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    start.current = null
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) (dx < 0 ? next : prev)()
  }

  return (
    <div className="book insights" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => {
        start.current = null
      }}>
      <div className="bg" />
      <div className="grain" />

      <header className="top">
        <a
          className="brand"
          href="/"
          onClick={(e) => {
            e.preventDefault()
            leaveTo('/')
          }}
        >
          Unbound
        </a>
        <span className="where">{at >= 1 && at <= chapters.length ? `${at} / ${chapters.length}` : title}</span>
      </header>

      {layers.map((l) => (
        <Spread key={l.id} n={l.n} on={l.id === live} u={`${uid}l${l.id}`} onNext={next} onFirst={() => go(1)} />
      ))}

      <button type="button" className={`edge prev ${at > 0 ? 'show' : ''}`} onClick={prev} aria-label="Previous page">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 4.5 7.5 12 15 19.5" />
        </svg>
      </button>
      <button type="button" className={`edge next ${at < LAST ? 'show' : ''}`} onClick={next} aria-label="Next page">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 4.5 16.5 12 9 19.5" />
        </svg>
      </button>

      {/* a quiet mark for each chapter along the bottom */}
      <nav className={`chapters stages ${at === 0 ? 'hidden' : ''}`} aria-label="Chapters">
        {chapters.map((c, i) => (
          <button type="button" key={c.title} className={`${i + 1 === at ? 'on' : ''} ${i + 1 <= at ? 'done' : ''}`} onClick={() => go(i + 1)} aria-label={plain(c.title)} title={plain(c.title)}>
            <span className="name">{i + 1}</span>
            <span className="track">
              <span className="fill" style={{ transform: `scaleX(${i + 1 <= at ? 1 : 0})` }} />
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// one spread: a small plate, and the chapter's words beneath it
function Spread({ n, on, u, onNext, onFirst }: { n: number; on: boolean; u: string; onNext: () => void; onFirst: () => void }) {
  const chapter = n >= 1 && n <= chapters.length ? chapters[n - 1] : null
  const { scene, p } = look(n)
  const ref = useRef<HTMLElement>(null)
  // the page being read takes the keyboard, so the arrow keys and space scroll it
  useEffect(() => {
    if (on) ref.current?.focus({ preventScroll: true })
  }, [on])
  return (
    <main ref={ref} tabIndex={-1} className={`spread ${n === 0 ? 'cover' : ''} ${on ? 'on' : ''}`} aria-live={on ? 'polite' : undefined} aria-hidden={on ? undefined : true} inert={!on}>
      <div className="art">
        <Plate scene={scene} p={p} u={u} label={plain(chapter?.title ?? title)} />
      </div>
      <div className="words">
        {n === 0 && (
          <>
            <div className="kick">In my own words</div>
            <h1>{title}</h1>
            <div className="lede">
              <Blocks blocks={intro} />
            </div>
            <button type="button" className="glass" onClick={onNext}>
              Open the book
            </button>
          </>
        )}

        {chapter && (
          <>
            <div className="chapter">
              <span>{n}</span> of {chapters.length}
            </div>
            <h2 className="stage">{inline(chapter.title)}</h2>
            <div className="prose">
              <Blocks blocks={chapter.blocks} />
            </div>
          </>
        )}

        {n === LAST && (
          <>
            <p className="line">That’s all for now. These notes keep growing, so come back now and then.</p>
            <div className="ends">
              <button type="button" className="glass" onClick={() => leaveTo('/stop')}>
                Be still
              </button>
              <button type="button" className="glass soft" onClick={onFirst}>
                Read it again
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
