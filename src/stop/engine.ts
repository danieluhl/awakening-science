// The Stop page's behaviour.
// It drives the static shell rendered by <StopPage>, and returns a cleanup
// function that stops every timer, frame loop and listener it started.
import { REAL as R } from './real'
import { SITE as S } from './site-data'

const X = S.experiences
const esc = (s: unknown) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string)
const PAL = [['#f6d5c4','#c9c2ef','#f3efe6'],['#ffd1b8','#a8d8ff','#f4efe7'],['#cfe7ff','#e6e1ff','#f2f4f7'],['#ffe7b3','#f7c6d9','#f6f1e6'],['#c9f2dc','#ffd6a8','#f3f4ec'],['#e4dcff','#ffe0ec','#f5f2f7'],['#ffd9c2','#ffe9b8','#f8f3ea'],['#ffffff','#f6e3c9','#f7f3ec']]
const STEPS = ['Try', 'Inside', 'The ancestor', 'Behind']
const THOUGHTS = ['did I reply to that email','what will they think','I should be better at this','later I need to','am I doing this right','remember when','what if it doesn’t work','I’m not there yet','this isn’t it','tomorrow','what does this say about me','one more thing','I need to get somewhere','almost','not like last time','why did I say that','I should call them back','is this working yet','what time is it','I forgot to','they probably think','when this is over','I’m wasting time','if only I had','what’s for dinner','maybe next time','I can’t stop thinking about it','how long does this last','am I supposed to do something']
const STATES: [number, string][] = [[0,'narrating'],[.18,'planning, replaying'],[.36,'noticing the noise'],[.52,'hearing, seeing'],[.68,'resting'],[.84,'just this']]
const MAX = 50

function stateWord(b: number) { let w = STATES[0][1]; for (const [t, s] of STATES) if (b >= t) w = s; return w }

export function mountStop(): () => void {
  // ---- lifetime bookkeeping, so unmounting leaves nothing running ----
  let disposed = false
  const timeouts = new Set<number>()
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => { timeouts.delete(id); if (!disposed) fn() }, ms)
    timeouts.add(id); return id
  }
  const cancel = (id: number | undefined) => { if (id !== undefined) { clearTimeout(id); timeouts.delete(id) } }
  const frame = (fn: FrameRequestCallback) => requestAnimationFrame((t) => { if (!disposed) fn(t) })
  const offs: (() => void)[] = []
  const on = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void) => {
    addEventListener(type, fn); offs.push(() => removeEventListener(type, fn))
  }
  const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T

  const root = document.documentElement
  const river = $('river'), svg = $('riverSvg') as unknown as SVGSVGElement
  const stage = $('stage'), real = $('real'), realCard = $('realCard')
  const chatter = $('chatter')

  let cur = 0, step = 0, B = 0
  const done = new Set<number>() // experiences whose Try exercise has been completed
  let timing = false
  function setBeing(v: number) { B = Math.max(0, Math.min(1, v)); root.style.setProperty('--being', String(B)); river.setAttribute('aria-valuenow', String(Math.round(B * 100))); river.setAttribute('aria-valuetext', stateWord(B)) }

  // the narrator: drifting thought-chatter, fades as Being rises
  let live: HTMLSpanElement[] = []
  function spawnThought() {
    if (!timing && Math.random() > 1 - B * .95) return // during a sit, thoughts keep returning at their usual pace
    const s = document.createElement('span')
    s.textContent = THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)]
    // anywhere on the screen above the river, faint and behind everything else
    s.style.left = (Math.random() * (innerWidth < 700 ? 60 : 82)) + '%'; s.style.top = (4 + Math.random() * 72) + '%'
    s.style.fontSize = (13 + Math.random() * 19) + 'px'
    s.style.setProperty('--dx', (Math.random() * 120 - 60) + 'px'); s.style.setProperty('--dy', (Math.random() * -80 - 20) + 'px')
    chatter.appendChild(s); live.push(s)
    frame(() => frame(() => s.classList.add('in')))
    // never more than MAX on screen: the oldest drift away as new ones arrive
    while (live.length > MAX) { const old = live.shift() as HTMLSpanElement; old.classList.add('out'); later(() => old.remove(), 5200) }
  }
  // starting a sit: every thought falls away, then they begin to return
  function clearThoughts() { for (const s of live) { s.classList.add('clear'); later(() => s.remove(), 1300) } live = [] }
  const chatterInterval = setInterval(spawnThought, 700)

  // ---- the river ----
  const wave = $('wave') as unknown as SVGPathElement, glow = $('glow') as unknown as SVGPathElement, orbHalo = $('orbHalo') as unknown as SVGEllipseElement
  let Bg = 0, Bv = 0 // the river's own, slowly-following sense of where the mind is
  let W = 0, H = 0
  function sizeRiver() {
    W = river.clientWidth; H = river.clientHeight; svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
    $('meNoise').textContent = Array.from({ length: 6 }, () => THOUGHTS).flat().join(' / ')
  }
  on('resize', sizeRiver)
  // how agitated the stream is at horizontal position u (0..1), given where the mind is
  function amp(u: number) { u = Math.max(0, Math.min(1, u)); return (Math.pow(1 - u, 1.6) * 20 + 1.5) * (.55 + (1 - Bv) * .6) }
  function yAt(x: number, t: number) {
    const u = Math.min(1, x / W), mid = H * .42
    const a = amp(u)
    const f1 = .045 - u * .03, f2 = .13 - u * .1
    const T = t * .18 // a slow tide, not a twitch
    return mid + Math.sin(x * f1 + T * (2.4 - u * 1.8)) * a + Math.sin(x * f2 - T * (3.1 - u * 2.6)) * a * .35
  }
  function drawRiver(t: number) {
    if (!W) return
    Bv += (B - Bv) * .012; Bg += (B - Bg) * .012 // drift toward the real value over several seconds
    let d = ''
    const stepX = 6
    for (let x = 0; x <= W + stepX; x += stepX) { const y = yAt(x, t); d += (x ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) }
    wave.setAttribute('d', d); glow.setAttribute('d', d)
    // only a soft glow where the mind is
    const ox = Bg * W
    orbHalo.setAttribute('cx', String(ox)); orbHalo.setAttribute('cy', String(yAt(ox, t)))
  }
  ;(function loop(now: number) { drawRiver(now / 1000); frame(loop) })(0)

  // drag anywhere along the river
  let dragging = false
  function fromPointer(e: PointerEvent) { if (timing) return; const r = river.getBoundingClientRect(); setBeing((e.clientX - r.left) / r.width) }
  river.onpointerdown = (e) => { dragging = true; river.setPointerCapture(e.pointerId); fromPointer(e) }
  river.onpointermove = (e) => { if (dragging) fromPointer(e) }
  river.onpointerup = () => { dragging = false }
  river.onkeydown = (e) => { if (timing) return; if (e.key === 'ArrowLeft') { setBeing(B - .05); e.preventDefault(); e.stopPropagation() } if (e.key === 'ArrowRight') { setBeing(B + .05); e.preventDefault(); e.stopPropagation() } }

  // hold to begin
  const hold = $('hold'), prog = $('prog') as unknown as SVGCircleElement
  let raf = 0, t0 = 0
  // once the ring is full it stays full: it turns gold, blooms softly, and then the page opens
  let held = false
  function complete() {
    if (held) return; held = true; cancelAnimationFrame(raf)
    prog.style.transition = ''; prog.style.strokeDashoffset = '0'
    hold.classList.add('done'); hold.setAttribute('aria-disabled', 'true')
    later(enter, 1100)
  }
  function holdStart(e: PointerEvent) { e.preventDefault(); if (held) return; t0 = performance.now(); const loop = (now: number) => { const p = Math.min(1, (now - t0) / 1600); prog.style.strokeDashoffset = String(289 * (1 - p)); if (p < 1) raf = frame(loop); else complete() }; raf = frame(loop) }
  function holdEnd() { if (held) return; cancelAnimationFrame(raf); prog.style.transition = 'stroke-dashoffset .5s'; prog.style.strokeDashoffset = '289'; later(() => { if (!held) prog.style.transition = '' }, 500) }
  hold.onpointerdown = holdStart; hold.onpointerup = holdEnd; hold.onpointerleave = holdEnd
  hold.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); prog.style.transition = 'stroke-dashoffset .9s ease'; prog.style.strokeDashoffset = '0'; later(complete, 900) } }
  let entered = false
  function enter() {
    if (entered) return; entered = true
    stage.classList.add('fade')
    $('intro').classList.add('gone'); document.body.classList.add('entered'); sizeRiver()
    later(() => { render(); frame(() => frame(() => stage.classList.remove('fade'))) }, 1400)
  }
  // moving to another experience: fade the whole stage out, swap, fade back in
  let swapping = false
  function changeExp(i: number, s: number) {
    if (swapping || timing) return; swapping = true; cancel(pauseT); document.body.classList.remove('edges-on')
    stage.classList.add('fade')
    later(() => { cur = i; step = s; if (s > 0) done.add(i); offerDeeper(); render(); stage.scrollTop = 0; later(() => { stage.classList.remove('fade'); swapping = false }, 60) }, 1700)
  }

  on('keydown', (e) => {
    if (!entered) return
    if (!done.has(cur)) return
    if (e.key === 'Escape') closeReal()
    if (real.classList.contains('open')) return
    if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev()
  })
  function next() { if (step < 3) setStep(step + 1); else changeExp((cur + 1) % X.length, 0) }
  function prev() { if (step > 0) setStep(step - 1); else changeExp((cur + X.length - 1) % X.length, 3) }

  function render() {
    const e = X[cur], p = PAL[cur]
    root.style.setProperty('--a', p[0]); root.style.setProperty('--b', p[1]); root.style.setProperty('--c', p[2])
    $('where').textContent = String(cur + 1).padStart(2, '0') + ' / 08'
    const regions = (S.experience_brain_region_links.find((r) => r.experience_id === e.id) || { regions: [] }).regions
    const q = e.first_person.quotes[0], q2 = e.first_person.quotes[1]
    const dq = e.dogen.quotes[0]
    const nothing = e.id === 'the-click'
    stage.innerHTML = `<div class="exp">
    <h2>${esc(e.title)}</h2><div class="sub">${esc(e.subtitle)}</div>
    <div class="steps">
      <div class="step"><p class="tr">${esc(e.practice.instruction)}</p>
        ${nothing ? '' : `<button class="timer" id="timer"><span id="tl">Begin, when you’re ready</span></button><p class="remain" id="remain">What remained?</p>`}</div>
      <div class="step"><p class="q">“${esc(q.text)}”</p><div class="who">${esc(q.by)} · ${esc(q.source)}</div>
        ${q2 ? `<p class="body" style="margin-top:26px;font-family:'EB Garamond';font-style:italic;font-size:19px">“${esc(q2.text)}”</p>` : ''}
        <button class="realbtn" id="realBtn">But is this real<span class="q-mark">?</span></button></div>
      <div class="step"><p class="q" style="font-style:italic">“${esc(dq.text)}”</p><div class="who">Dōgen Zenji · ${esc(dq.work)} · trans. ${esc(dq.translator)}</div>
        <p class="body" style="margin-top:24px">${esc(e.dogen.note)}</p></div>
      <div class="step"><p class="body">${esc(e.science.summary)}</p>
        <div class="regions">${regions.map((r) => `<span>${esc(r.name)}</span>`).join('')}</div>
        <ul class="findings">${e.science.findings.slice(0, 3).map((f) => `<li>${esc(f.text)}</li>`).join('')}</ul>
        <p class="honest">${esc(S.bottom_line)}</p>
        ${cur === X.length - 1 ? `<a class="deeper-invite" href="/sit" data-deeper>One level deeper: how to sit<span aria-hidden="true"> →</span></a>` : ''}</div>
    </div>
    <nav class="stepnav chrome ${done.has(cur) ? '' : 'locked'}" id="stepnav" aria-label="Steps">
      ${STEPS.map((s, i) => `<button class="w" data-s="${i}">${s}</button>`).join('')}<span class="bar" aria-hidden="true"></span>
    </nav>
  </div>`
    stage.querySelectorAll<HTMLButtonElement>('.stepnav .w').forEach((b) => { b.onclick = () => setStep(+(b.dataset.s as string)) })
    $('realBtn').onclick = openReal
    const tb = document.getElementById('timer'); if (tb) tb.onclick = runTimer
    else if (!done.has(cur)) { const c = cur; later(() => { if (cur === c) unlock() }, 8000) }
    frame(() => setStep(step))
    showEdges()
  }

  // next/previous only appear after a pause on a step
  let pauseT: number | undefined, stepTok = 0
  function setStep(s: number) {
    step = s
    const steps = [...stage.querySelectorAll('.step')], wasOn = steps.some((el) => el.classList.contains('on'))
    steps.forEach((el) => el.classList.remove('on'))
    const tok = ++stepTok; later(() => { if (tok === stepTok) steps[s].classList.add('on') }, wasOn ? 1000 : 0)
    stage.querySelectorAll('.stepnav .w').forEach((b, i) => b.classList.toggle('on', i === s))
    placeBar()
  }
  // slide the underline to the current word (placed instantly the first time, then glides)
  function placeBar() {
    const nav = document.getElementById('stepnav'), bar = nav?.querySelector<HTMLElement>('.bar'), on = nav?.querySelector<HTMLElement>('.w.on')
    if (!nav || !bar || !on) return
    bar.style.left = on.offsetLeft + 'px'; bar.style.width = on.offsetWidth + 'px'; bar.style.top = (on.offsetTop + on.offsetHeight - 1) + 'px'; bar.style.bottom = 'auto'
    if (!nav.classList.contains('sliding')) { nav.classList.add('sliding'); frame(() => frame(() => bar.classList.add('glide'))) }
  }
  on('resize', placeBar)
  // the edge circles appear only once this experience's Try is done, after a quiet moment
  function showEdges() { cancel(pauseT); document.body.classList.remove('edges-on'); if (done.has(cur)) pauseT = later(() => document.body.classList.add('edges-on'), 3000) }
  $('edgePrev').onclick = prev
  $('edgeNext').onclick = next

  // once a few experiences have been lived through, "How to sit" quietly appears in the top bar
  function offerDeeper() { if (done.size >= 3) document.body.classList.add('deeper-on') }
  // leaving for the picture book: the whole page fades before the next one loads
  document.addEventListener('click', onDeeper)
  on('pageshow', () => document.body.classList.remove('leaving')) // back button: never return to a faded-out page
  function onDeeper(e: MouseEvent) {
    const a = (e.target as HTMLElement).closest('[data-deeper]') as HTMLAnchorElement | null
    if (!a) return
    e.preventDefault(); document.body.classList.add('leaving'); later(() => window.location.assign(a.href), 1300)
  }

  function unlock() { done.add(cur); offerDeeper(); const n = document.getElementById('stepnav'); if (n) n.classList.remove('locked'); showEdges() }

  // guided minute: the river resets to the middle, then drifts toward Being on its own
  function runTimer() {
    const tl = $('tl'), tb = $('timer'), halo = orbHalo
    if (timing) return; tb.onclick = null; tb.classList.add('sitting'); tb.setAttribute('aria-disabled', 'true'); tb.tabIndex = -1
    timing = true; root.style.setProperty('--quiet', '0'); clearThoughts(); document.body.classList.add('focus', 'sitting')
    tl.classList.add('hush'); later(() => { tl.textContent = 'Just this'; tl.classList.remove('hush') }, 1250)
    // the glow slips away, reappears at the midpoint, then begins
    halo.style.opacity = '0'
    later(() => { if (!timing) return; setBeing(.5); Bg = .5; halo.style.opacity = ''; begin() }, 1600)
    function begin() {
      const start = performance.now(), D = 60000
      const loop = (now: number) => {
        if (!timing) return; const p = Math.min(1, (now - start) / D)
        const e = p * p * (3 - 2 * p) // eases in, eases out, spans the whole minute
        setBeing(.5 + .5 * e)
        // over the last ~20 seconds the background thoughts fade away completely
        // (finishing a touch early, since the opacity eases toward each new value)
        root.style.setProperty('--quiet', String(Math.max(0, Math.min(1, (now - start - 38000) / 17000))))
        if (p < 1) frame(loop); else finish()
      }
      frame(loop)
    }
    function finish() {
      timing = false; document.body.classList.remove('sitting')
      tb.classList.add('gone')
      const rm = $('remain')
      later(() => rm.classList.add('show'), 1200) // "What remained?" arrives softly
      later(() => rm.classList.remove('show'), 7400) // a moment to sit with it
      later(() => { document.body.classList.remove('focus'); unlock(); setStep(1) }, 9600)
    }
  }

  // "but is this real?"
  let realT: number | undefined
  function openReal() {
    const r = R[X[cur].id]
    realCard.innerHTML = `<div class="scroll"><div class="eyebrow">What the research says · ${esc(X[cur].title)}</div>
    <h3 id="realTitle">${esc(r.head)}</h3>
    ${r.body.map((p) => `<p>${esc(p)}</p>`).join('')}
    <div class="guess">${esc(r.guess)}</div>
    <ol>${r.sources.map(([t, u, d]) => `<li>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(t)} ↗</a>` : `<b>${esc(t)}</b>`}<span>${esc(d)}</span></li>`).join('')}</ol>
    <p class="fine">${esc(S.bottom_line)}</p>
    <button class="back" data-close>Back to the experience</button></div>`
    // the experience fades away first, then the card rises into the empty space
    stage.classList.add('fade')
    real.classList.add('open'); document.body.classList.add('real-open'); real.setAttribute('aria-hidden', 'false')
    cancel(realT); realT = later(() => real.classList.add('shown'), 1200)
    ;(realCard.querySelector('.scroll') as HTMLElement).scrollTop = 0
    later(() => (realCard.querySelector('.back') as HTMLElement).focus({ preventScroll: true }), 400)
  }
  function closeReal() {
    if (!real.classList.contains('open')) return
    cancel(realT); real.classList.remove('shown'); real.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('real-open'); realT = later(() => { real.classList.remove('open'); stage.classList.remove('fade') }, 1300)
  }
  real.onclick = (e) => { if ((e.target as HTMLElement).closest('[data-close]')) closeReal() }

  return () => {
    disposed = true
    clearInterval(chatterInterval)
    for (const id of timeouts) clearTimeout(id)
    timeouts.clear()
    cancelAnimationFrame(raf)
    for (const off of offs) off()
    for (const el of [river, hold, real, $('edgePrev'), $('edgeNext')]) { el.onpointerdown = el.onpointermove = el.onpointerup = el.onpointerleave = null; el.onkeydown = el.onclick = null }
    document.removeEventListener('click', onDeeper)
    document.body.classList.remove('entered', 'edges-on', 'focus', 'sitting', 'real-open', 'deeper-on', 'leaving')
    for (const p of ['--being', '--quiet', '--a', '--b', '--c']) root.style.removeProperty(p)
  }
}
