import { useEffect, useId } from 'react'
import { OX_SCENES } from '../ox/scenes'
import { NIGHT } from '../ox/stages'
import { PALETTES, Plate } from '../sit/scenes'

// The front door: what Unbound is, and three ways in.
// Leaving fades the whole page before the next one loads, as everywhere else on the site.
function leaveTo(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  const href = e.currentTarget.href
  document.body.classList.add('leaving')
  setTimeout(() => window.location.assign(href), 1300)
}

export function HomePage() {
  const u = useId().replace(/:/g, '')

  useEffect(() => {
    const t = setTimeout(() => document.body.classList.add('arrived'), 120)
    // coming back with the browser's back button can restore a faded-out page; bring it back
    const onShow = () => document.body.classList.remove('leaving')
    addEventListener('pageshow', onShow)
    return () => {
      clearTimeout(t)
      removeEventListener('pageshow', onShow)
      document.body.classList.remove('arrived', 'leaving')
    }
  }, [])

  return (
    <div className="home">
      <div className="bg" />
      <div className="grain" />

      <header className="intro">
        <div className="brand">Unbound</div>
        <h1>What’s left when the narrator goes quiet</h1>
        <p>
          Some people describe a shift where the running voice in the head stops, the line between “me” and “the world” falls away, and
          what remains is open, intimate and alive. Unbound gathers eight of those experiences.
        </p>
        <p>
          Each one is told three ways: by someone living it now, by Dōgen, a Zen teacher writing eight hundred years ago, and by the
          brain research that has started to map it. These accounts usually sit scattered across interviews and dense papers. Here they
          sit side by side, and you can try a taste of each one yourself.
        </p>
        <p>
          Come if you meditate and want words for what you notice, if you’re curious what the science actually says, or if you’ve never
          sat and want a simple place to start.
        </p>
      </header>

      <nav className="doors" aria-label="Three ways in">
        <a className="door" href="/stop" onClick={leaveTo}>
          <span className="art">
            <Plate scene="passing-clouds" p={PALETTES.sit} u={`${u}a`} label="A figure sitting still as clouds pass" />
          </span>
          <span className="kick">Eight guided experiences</span>
          <span className="name">Be still</span>
          <span className="desc">Sit with each experience for a minute, then hear what people living it, Dōgen and the research say about it.</span>
          <span className="go">Begin</span>
        </a>
        <a className="door" href="/sit" onClick={leaveTo}>
          <span className="art">
            <Plate scene="cover" p={PALETTES.what} u={`${u}b`} label="A figure seated on a lotus under a rising sun" />
          </span>
          <span className="kick">A picture book</span>
          <span className="name">How to sit</span>
          <span className="desc">The basic practice, one picture at a time: posture, the breath, and carrying it through your day.</span>
          <span className="go">Open the book</span>
        </a>
        <a className="door" href="/ox" onClick={leaveTo}>
          <span className="art">
            <Plate draw={OX_SCENES.cover} p={NIGHT.p} u={`${u}c`} label="A herder riding an ox home under a full moon, playing a flute" />
          </span>
          <span className="kick">Ten pictures</span>
          <span className="name">The ox and the herder</span>
          <span className="desc">The old Zen story of the way home, in ten pictures and ten short poems: searching, finding, taming, forgetting, and coming back.</span>
          <span className="go">Open the book</span>
        </a>
      </nav>

      <p className="fine">The brain data and the first-person reports point at the same territory from opposite sides. Neither side owns it.</p>
    </div>
  )
}
