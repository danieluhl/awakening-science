// A barely-there living layer: a slow WebGL colour field, rare sparkle patterns,
// and an occasional shimmer across a word. Everything here is meant to go unnoticed
// most of the time, and to delight when it is noticed.
// Returns a cleanup function.

const FRAGMENT = `
  precision highp float;
  uniform vec2 res; uniform float t; uniform vec3 ca, cb, cc; uniform float sat, bri;
  // simplex noise (Ashima / Stefan Gustavson)
  vec3 m289(vec3 x){ return x - floor(x*(1./289.))*289.; }
  vec2 m289(vec2 x){ return x - floor(x*(1./289.))*289.; }
  vec3 perm(vec3 x){ return m289(((x*34.)+1.)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(.211324865405187, .366025403784439, -.577350269189626, .024390243902439);
    vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = m289(i);
    vec3 p = perm(perm(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
    vec3 m = max(.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.); m = m*m; m = m*m;
    vec3 x = 2.*fract(p*C.www) - 1.; vec3 h = abs(x) - .5; vec3 ox = floor(x + .5); vec3 a0 = x - ox;
    m *= 1.79284291400159 - .85373472095314*(a0*a0 + h*h);
    vec3 g; g.x = a0.x*x0.x + h.x*x0.y; g.yz = a0.yz*x12.xz + h.yz*x12.yw;
    return 130.*dot(m, g);
  }
  float blob(vec2 uv, vec2 c, vec2 r){ vec2 d = (uv - c) / r; return exp(-dot(d, d) * 1.6); }
  void main(){
    vec2 uv = gl_FragCoord.xy / res; uv.y = 1. - uv.y;
    float asp = res.x / res.y;
    // a slow, organic warp of the whole field
    vec2 w = vec2(snoise(uv*1.3 + vec2(t*.006, -t*.004)), snoise(uv*1.3 + vec2(-t*.005, t*.007) + 7.3));
    uv += w * .045;
    // the colour spots drift on long, unhurried paths (minutes, not seconds)
    vec2 pa = vec2(.25, .30) + vec2(sin(t*.013 + 1.2), cos(t*.011)) * vec2(.07, .06);
    vec2 pb = vec2(.80, .75) + vec2(cos(t*.009 + 2.), sin(t*.012 + .4)) * vec2(.08, .06);
    vec2 pm = vec2(.55, .50) + vec2(sin(t*.007 + 4.), cos(t*.008 + 1.)) * vec2(.12, .10);
    float fa = blob(uv, pa, vec2(.42, .38*asp*.75));
    float fb = blob(uv, pb, vec2(.44, .46*asp*.75));
    float fm = blob(uv, pm, vec2(.30, .30*asp*.75)) * .35;
    vec3 col = cc;
    col = mix(col, ca, fa * .95);
    col = mix(col, cb, fb * .95);
    col = mix(col, mix(ca, cb, .5 + .5*sin(t*.01)), fm);
    // match the page's Me-ing/Being colour treatment
    float l = dot(col, vec3(.299, .587, .114));
    col = mix(vec3(l), col, sat) * bri;
    // a whisper of dither to keep the gradients free of banding
    col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - .5) / 255.;
    gl_FragColor = vec4(col, 1.);
  }`

interface Spark { x: number; y: number; born: number; life: number; r: number; rise: number; rot: number }

export function mountAlive(): () => void {
  let disposed = false
  const timeouts = new Set<number>()
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(() => { timeouts.delete(id); if (!disposed) fn() }, ms)
    timeouts.add(id)
  }
  const frame = (fn: FrameRequestCallback) => requestAnimationFrame((t) => { if (!disposed) fn(t) })
  const offs: (() => void)[] = []
  const onResize = (fn: () => void) => { addEventListener('resize', fn); offs.push(() => removeEventListener('resize', fn)) }

  const root = document.documentElement
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const rand = (a: number, b: number) => a + Math.random() * (b - a)
  const css = (name: string) => getComputedStyle(root).getPropertyValue(name).trim()
  const rgb = (str: string) => { const m = str.match(/[\d.]+/g); return m ? m.slice(0, 3).map((v) => +v / 255) : [1, 1, 1] }
  const hex = (str: string) => { if (str[0] !== '#') return rgb(str); const n = parseInt(str.slice(1), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255] }
  const colour = (name: string) => hex(css(name))

  // ---------- 1. the colour field ----------
  const field = document.createElement('canvas')
  field.className = 'field'
  field.setAttribute('aria-hidden', 'true')
  document.body.prepend(field)
  const gl = field.getContext('webgl', { antialias: false, premultipliedAlpha: false, alpha: false })

  if (gl) {
    const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`
    const sh = (type: number, src: string) => { const s = gl.createShader(type) as WebGLShader; gl.shaderSource(s, src); gl.compileShader(s); return s }
    const prog = gl.createProgram() as WebGLProgram
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAGMENT)); gl.linkProgram(prog)
    if (gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      gl.useProgram(prog)
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
      const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      const U = (n: string) => gl.getUniformLocation(prog, n)
      const u = { res: U('res'), t: U('t'), ca: U('ca'), cb: U('cb'), cc: U('cc'), sat: U('sat'), bri: U('bri') }
      const SCALE = .4 // a soft field needs few pixels; the browser upscales it smoothly
      const size = () => { field.width = Math.max(2, Math.round(innerWidth * SCALE)); field.height = Math.max(2, Math.round(innerHeight * SCALE)); gl.viewport(0, 0, field.width, field.height) }
      size(); onResize(size)
      document.body.classList.add('alive')
      const t0 = performance.now() - rand(0, 600000) // start somewhere in the cycle
      let last = 0
      const draw = (now: number) => {
        frame(draw)
        if (now - last < 66) return; last = now // ~15fps is plenty for something this slow
        const being = parseFloat(css('--being')) || 0
        const t = (now - t0) / 1000 * (reduce ? .6 : 1) // with Reduce Motion, slower still
        // a slow breath: the field brightens imperceptibly every so often
        const breath = Math.pow(Math.max(0, Math.sin(t * .05)), 8) * .018
        gl.uniform2f(u.res, field.width, field.height); gl.uniform1f(u.t, t)
        gl.uniform3fv(u.ca, colour('--a')); gl.uniform3fv(u.cb, colour('--b')); gl.uniform3fv(u.cc, colour('--c'))
        gl.uniform1f(u.sat, .55 + being * 1.1); gl.uniform1f(u.bri, .97 + being * .06 + breath)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      frame(draw)
    }
  }

  // ---------- 2. sparkles: rare, tiny, in little patterns ----------
  const sky = document.createElement('canvas')
  sky.className = 'sparkles'; sky.setAttribute('aria-hidden', 'true')
  document.body.appendChild(sky)
  const sx = sky.getContext('2d') as CanvasRenderingContext2D
  const sizeSky = () => { const d = devicePixelRatio || 1; sky.width = innerWidth * d; sky.height = innerHeight * d; sx.setTransform(d, 0, 0, d, 0, 0) }
  sizeSky(); onResize(sizeSky)
  let sparks: Spark[] = [], running = false
  const add = (x: number, y: number, delay: number, o: Partial<Pick<Spark, 'life' | 'r' | 'rise'>> = {}) =>
    sparks.push({ x, y, born: performance.now() + delay, life: o.life || rand(1600, 2600), r: o.r || rand(1.2, 2.6), rise: reduce ? 0 : (o.rise || 0), rot: rand(0, Math.PI) })
  const PATTERNS: ((x: number, y: number) => void)[] = [
    // a loose cluster, like dew catching light
    (x, y) => { const n = Math.round(rand(3, 6)); for (let i = 0; i < n; i++) add(x + rand(-70, 70), y + rand(-50, 50), i * rand(180, 420)) },
    // a short arc traced one point at a time
    (x, y) => { const n = Math.round(rand(5, 8)), r = rand(60, 140), a0 = rand(0, 6.28), sweep = rand(.8, 1.6) * (Math.random() < .5 ? -1 : 1)
      for (let i = 0; i < n; i++) { const a = a0 + sweep * i / n; add(x + Math.cos(a) * r, y + Math.sin(a) * r * .6, i * 170, { r: 1.2 + i * .12 }) } },
    // two far-apart twinkles answering each other
    (x, y) => { add(x, y, 0, { r: 2.4 }); add(x + rand(-260, 260), y + rand(-140, 140), rand(700, 1300), { r: 2 }) },
    // a few motes rising like breath in cold air
    (x, y) => { const n = Math.round(rand(3, 5)); for (let i = 0; i < n; i++) add(x + rand(-30, 30), y + rand(0, 30), i * 500, { life: rand(3200, 4400), rise: rand(18, 34), r: rand(1, 1.8) }) },
    // a single, slow star
    (x, y) => add(x, y, 0, { r: 3, life: 3400 })
  ]
  function scheduleSparkle() {
    later(() => {
      if (!document.hidden) {
        const x = rand(innerWidth * .06, innerWidth * .94), y = rand(innerHeight * .06, innerHeight * .72)
        PATTERNS[Math.floor(Math.random() * PATTERNS.length)](x, y)
        if (!running) { running = true; frame(drawSparks) }
      }
      scheduleSparkle()
    }, rand(10000, 20000))
  }
  function star(x: number, y: number, r: number, a: number, rot: number) {
    sx.save(); sx.translate(x, y); sx.rotate(rot); sx.globalAlpha = a
    const g = sx.createRadialGradient(0, 0, 0, 0, 0, r * 5)
    g.addColorStop(0, 'rgba(255,250,232,.9)'); g.addColorStop(.25, 'rgba(255,236,190,.35)'); g.addColorStop(1, 'rgba(255,236,190,0)')
    sx.fillStyle = g; sx.beginPath(); sx.arc(0, 0, r * 5, 0, 6.283); sx.fill()
    sx.fillStyle = 'rgba(255,253,244,.95)'; sx.beginPath()
    for (let i = 0; i < 4; i++) { const ang = i * Math.PI / 2; sx.moveTo(0, 0); sx.quadraticCurveTo(Math.cos(ang + .7) * r * .5, Math.sin(ang + .7) * r * .5, Math.cos(ang) * r * 2.6, Math.sin(ang) * r * 2.6); sx.quadraticCurveTo(Math.cos(ang - .7) * r * .5, Math.sin(ang - .7) * r * .5, 0, 0) }
    sx.fill(); sx.restore()
  }
  function drawSparks(now: number) {
    sx.clearRect(0, 0, innerWidth, innerHeight)
    sparks = sparks.filter((s) => now < s.born + s.life)
    for (const s of sparks) {
      if (now < s.born) continue
      const p = (now - s.born) / s.life, a = Math.sin(p * Math.PI) ** 2 * .55
      star(s.x, s.y - s.rise * p, s.r * (.7 + .3 * Math.sin(p * Math.PI)), a, s.rot + p * .6)
    }
    if (sparks.length) frame(drawSparks); else { running = false; sx.clearRect(0, 0, innerWidth, innerHeight) }
  }
  later(scheduleSparkle, rand(4000, 9000))

  // ---------- 3. a shimmer passing over a few words ----------
  const SELECTORS = ['.exp h2', '.step.on .q', '.step.on .tr', '.step.on .body', '.step.on .who', '.exp .sub', '.intro:not(.gone) h1', '.intro:not(.gone) p', '.real.shown h3']
  function shimmerOnce() {
    const els = SELECTORS.flatMap((s) => [...document.querySelectorAll<HTMLElement>(s)]).filter((el) => el.offsetParent && el.getBoundingClientRect().height)
    if (!els.length) return
    const el = els[Math.floor(Math.random() * els.length)]
    const nodes: Text[] = []; const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    while (tw.nextNode()) { const n = tw.currentNode as Text; if ((n.nodeValue || '').trim().length > 3 && !n.parentElement?.closest('.shimmer')) nodes.push(n) }
    if (!nodes.length) return
    const node = nodes[Math.floor(Math.random() * nodes.length)]
    const words = [...(node.nodeValue || '').matchAll(/\S+/g)].filter((m) => m[0].length > 2)
    if (!words.length) return
    const span = Math.random() < .3 ? 3 : Math.random() < .5 ? 2 : 1 // usually one word, sometimes a short phrase
    const i = Math.floor(Math.random() * words.length), j = Math.min(words.length - 1, i + span - 1)
    const start = words[i].index as number, end = (words[j].index as number) + words[j][0].length
    const range = document.createRange(); range.setStart(node, start); range.setEnd(node, end)
    const wrap = document.createElement('span'); wrap.className = 'shimmer'
    wrap.style.setProperty('--sh-base', getComputedStyle(node.parentElement as HTMLElement).color)
    range.surroundContents(wrap)
    wrap.addEventListener('animationend', () => { const parent = wrap.parentNode; if (!parent) return; wrap.replaceWith(...wrap.childNodes); parent.normalize() }, { once: true })
  }
  ;(function scheduleShimmer() { later(() => { if (!document.hidden) shimmerOnce(); scheduleShimmer() }, rand(60000, 180000)) })()
  // the first one arrives a little sooner, so it can be found
  later(() => { if (!document.hidden) shimmerOnce() }, rand(25000, 45000))

  const w = window as unknown as { __alive?: unknown }
  w.__alive = { shimmerOnce, sparkle: () => { PATTERNS[Math.floor(Math.random() * PATTERNS.length)](innerWidth / 2, innerHeight / 3); if (!running) { running = true; frame(drawSparks) } } }

  return () => {
    disposed = true
    for (const id of timeouts) clearTimeout(id)
    for (const off of offs) off()
    field.remove(); sky.remove()
    document.body.classList.remove('alive')
    delete w.__alive
  }
}
