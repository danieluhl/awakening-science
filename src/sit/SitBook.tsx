import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { BOOKLET_URL, CHAPTERS, PAGES } from './pages'
import type { ChapterId } from './pages'
import { PALETTES, Plate } from './scenes'

// "How to sit": a picture book, one thought per page.
// Spread 0 is the cover, 1..PAGES.length are the pages, and the last spread closes the book.
const LAST = PAGES.length + 1
// a page turn is a crossfade: the next page rises through the one that is leaving
const SETTLE = 1900 // how long a leaving page lingers before it is taken away

function chapterOf(i: number): ChapterId {
  if (i <= 0) return 'what'
  if (i > PAGES.length) return 'day'
  return PAGES[i - 1].chapter
}

// leave for another page of the site with the same slow fade the book uses
function leaveTo(href: string) {
  document.body.classList.add('leaving')
  setTimeout(() => window.location.assign(href), 1300)
}

export function SitBook() {
  // every page on screen is a layer; the newest one is the page being read, older ones are fading away
  const [layers, setLayers] = useState<{ n: number; id: number }[]>([{ n: 0, id: 0 }])
  const [live, setLive] = useState(-1)
  const want = useRef(0)
  const nextId = useRef(1)
  const uid = useId().replace(/:/g, '')
  const at = layers[layers.length - 1].n

  // the colours of the page follow the chapter, easing over a few seconds
  useEffect(() => {
    const c = CHAPTERS.find((ch) => ch.id === chapterOf(at)) ?? CHAPTERS[0]
    const root = document.documentElement
    root.style.setProperty('--a', c.bg[0])
    root.style.setProperty('--b', c.bg[1])
    root.style.setProperty('--c', c.bg[2])
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

  // the page number lives in the address (#12), so a page can be linked to and survives a reload
  useEffect(() => {
    history.replaceState(null, '', at ? `#${at}` : location.pathname)
  }, [at])

  // turning a page never waits: the new page starts fading in at once, even mid-turn,
  // so a reader can move as slowly or as quickly as they like
  const go = useCallback((n: number) => {
    const target = Math.max(0, Math.min(LAST, n))
    if (target === want.current) return
    want.current = target
    const id = nextId.current++
    // at most three pages share the screen; the oldest is all but gone by then
    setLayers((ls) => [...ls.slice(-2), { n: target, id }])
    // a beat later (so the new page is on screen, still invisible) it begins to fade in
    setTimeout(() => {
      setLive(id)
      setTimeout(() => setLayers((ls) => ls.filter((l) => l.id >= id)), SETTLE)
    }, 40)
  }, [])

  // a page number typed into the address (or the browser's back and forward) turns to that page
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !(e.target as HTMLElement).closest('button,a'))) {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        prev()
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [next, prev])

  // a horizontal swipe turns the page
  const sx = useRef<number | null>(null)
  const onDown = (e: React.PointerEvent) => {
    sx.current = e.clientX
  }
  const onUp = (e: React.PointerEvent) => {
    if (sx.current === null) return
    const dx = e.clientX - sx.current
    sx.current = null
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)()
  }

  const ch = chapterOf(at)

  // progress inside each chapter, for the four quiet bars along the bottom
  const progress = CHAPTERS.map((c) => {
    const idx = PAGES.map((p, i) => (p.chapter === c.id ? i + 1 : -1)).filter((i) => i > 0)
    const first = idx[0]
    const done = at === LAST ? idx.length : idx.filter((i) => i <= at).length
    return { c, first, frac: done / idx.length }
  })

  return (
    <div className="book" onPointerDown={onDown} onPointerUp={onUp}>
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
        <span className="where">{at === 0 || at === LAST ? 'How to sit' : `${String(at).padStart(2, '0')} / ${PAGES.length}`}</span>
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

      <nav className={`chapters ${at === 0 ? 'hidden' : ''}`} aria-label="Chapters">
        {progress.map(({ c, first, frac }) => (
          <button type="button" key={c.id} className={c.id === ch && at !== LAST ? 'on' : ''} onClick={() => go(first)}>
            <span className="name">
              {c.numeral} · {c.title}
            </span>
            <span className="track">
              <span className="fill" style={{ transform: `scaleX(${frac})` }} />
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// one spread: the plate and its words
function Spread({ n, on, u, onNext, onFirst }: { n: number; on: boolean; u: string; onNext: () => void; onFirst: () => void }) {
  const ch = chapterOf(n)
  const page = n >= 1 && n <= PAGES.length ? PAGES[n - 1] : null
  const chapter = CHAPTERS.find((c) => c.id === ch) ?? CHAPTERS[0]
  const scene = n === 0 ? 'cover' : n === LAST ? 'end' : (page?.scene ?? 'cover')
  return (
    <main className={`spread ${on ? 'on' : ''}`} aria-live={on ? 'polite' : undefined} aria-hidden={on ? undefined : true} inert={!on}>
      <div className="art">
        <Plate scene={scene} p={PALETTES[ch]} u={u} label={page?.text ?? 'How to sit'} />
      </div>
      <div className="words">
        {n === 0 && (
          <>
            <div className="kick">A picture book</div>
            <h1>How to sit</h1>
            <p className="lede">A picture book of the basic practice: how to sit, what to do with the mind, and how to carry it through the day.</p>
            <button type="button" className="glass" onClick={onNext}>
              Open the book
            </button>
            <p className="credit">
              After Ken Walkama’s{' '}
              <a href={BOOKLET_URL} target="_blank" rel="noopener">
                Mindfulness Meditation
              </a>
            </p>
          </>
        )}

        {page && (
          <>
            {page.opens ? (
              <div className="chapter">
                <span>{chapter.numeral}</span> {chapter.title}
              </div>
            ) : (
              <div className="chapter quiet">{chapter.title}</div>
            )}
            <p className="line">{page.text}</p>
          </>
        )}

        {n === LAST && (
          <>
            <p className="line">That is the whole of it. Sit a little each day, and come back, again and again.</p>
            <div className="ends">
              <button type="button" className="glass" onClick={() => leaveTo('/stop')}>
                Be still
              </button>
              <button type="button" className="glass soft" onClick={onFirst}>
                Read it again
              </button>
            </div>
            <p className="credit">
              Ken Walkama’s full booklet:{' '}
              <a href={BOOKLET_URL} target="_blank" rel="noopener">
                Mindfulness Meditation (PDF)
              </a>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
