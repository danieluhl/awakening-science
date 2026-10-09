import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Plate } from '../sit/scenes'
import { OX_SCENES } from './scenes'
import { NIGHT, STAGES } from './stages'

// "The ox and the herder": the Ten Ox-Herding Pictures as a picture book, one stage per page.
// It turns like "How to sit": spread 0 is the cover, 1..10 are the stages, and the last spread closes the book.
const LAST = STAGES.length + 1
// a page turn is a crossfade: the next page rises through the one that is leaving
const SETTLE = 1900 // how long a leaving page lingers before it is taken away

function look(i: number) {
  return i >= 1 && i <= STAGES.length ? STAGES[i - 1] : NIGHT
}

// leave for another page of the site with the same slow fade the book uses
function leaveTo(href: string) {
  document.body.classList.add('leaving')
  setTimeout(() => window.location.assign(href), 1300)
}

export function OxBook() {
  // every page on screen is a layer; the newest one is the page being read, older ones are fading away
  const [layers, setLayers] = useState<{ n: number; id: number }[]>([{ n: 0, id: 0 }])
  const [live, setLive] = useState(-1)
  const want = useRef(0)
  const nextId = useRef(1)
  const uid = useId().replace(/:/g, '')
  const at = layers[layers.length - 1].n

  // the colours of the page follow the stage, easing over a few seconds
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

  const cur = at >= 1 && at <= STAGES.length ? STAGES[at - 1] : null

  return (
    <div className="book ox" onPointerDown={onDown} onPointerUp={onUp}>
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
        <span className="where">{cur ? `${cur.numeral} / X` : 'The ox and the herder'}</span>
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

      {/* the ten stages along the bottom, a quiet mark for each, the current one named */}
      <nav className={`chapters stages ${at === 0 ? 'hidden' : ''}`} aria-label="The ten stages">
        {STAGES.map((s, i) => (
          <button type="button" key={s.numeral} className={`${i + 1 === at ? 'on' : ''} ${i + 1 <= at ? 'done' : ''}`} onClick={() => go(i + 1)} aria-label={`${s.numeral}. ${s.title}`}>
            <span className="name">{s.numeral}</span>
            <span className="track">
              <span className="fill" style={{ transform: `scaleX(${i + 1 <= at ? 1 : 0})` }} />
            </span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// one spread: the plate and its words
function Spread({ n, on, u, onNext, onFirst }: { n: number; on: boolean; u: string; onNext: () => void; onFirst: () => void }) {
  const stage = n >= 1 && n <= STAGES.length ? STAGES[n - 1] : null
  const scene = n === 0 ? 'cover' : n === LAST ? 'end' : (stage?.scene ?? 'cover')
  const label = stage ? `${stage.title}: ${stage.verse.join(' ')}` : 'A herder riding an ox home under a full moon'
  return (
    <main className={`spread ${on ? 'on' : ''}`} aria-live={on ? 'polite' : undefined} aria-hidden={on ? undefined : true} inert={!on}>
      <div className="art">
        <Plate draw={OX_SCENES[scene]} p={look(n).p} u={u} label={label} />
      </div>
      <div className="words">
        {n === 0 && (
          <>
            <div className="kick">The ten ox-herding pictures</div>
            <h1>The ox and the herder</h1>
            <p className="lede">A herder loses an ox, follows its tracks, catches it, tames it and rides it home. Then the ox is forgotten, the herder too, and only the circle is left. Then back to the world, with open hands.</p>
            <button type="button" className="glass" onClick={onNext}>
              Open the book
            </button>
            <p className="credit">Verses by the Chan master Kuo-an Shih-yuan (廓庵師遠), twelfth-century China, freshly rendered from the Chinese</p>
          </>
        )}

        {stage && (
          <>
            <div className="chapter">
              <span>{stage.numeral}</span> {stage.han}
            </div>
            <h2 className="stage">{stage.title}</h2>
            <p className="verse">
              {stage.verse.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </p>
          </>
        )}

        {n === LAST && (
          <>
            <p className="line">The search ends where it began: right here, in the ordinary day, with open hands.</p>
            <div className="ends">
              <button type="button" className="glass" onClick={() => leaveTo('/sit')}>
                How to sit
              </button>
              <button type="button" className="glass soft" onClick={onFirst}>
                Read it again
              </button>
            </div>
            <p className="credit">After the ten verses of Kuo-an Shih-yuan</p>
          </>
        )}
      </div>
    </main>
  )
}
