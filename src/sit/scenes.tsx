// The picture book's illustrations, drawn in code.
// Every plate shares one vocabulary: a round "moon window" framed by a rainbow aureole,
// a flat seated figure, banded suns, lotuses, clouds and rays. Colour comes from the chapter.
// Movement is slow and lives in CSS classes (sp-*); Reduce Motion keeps the glows and drops the motion.
import type { ReactNode } from 'react'
import type { ChapterId } from './pages'

export interface Pal {
  sky: [string, string]
  ground: string
  sun: string
  fig: string
  fig2: string
  skin: string
  cushion: string
  a1: string
  a2: string
  a3: string
  ink: string
  glow: string
}

export const PALETTES: Record<ChapterId, Pal> = {
  // dawn: violet into peach
  what: { sky: ['#b45fd0', '#ffb38a'], ground: '#6b3596', sun: '#fff1b8', fig: '#45266f', fig2: '#5a3388', skin: '#ffd9c0', cushion: '#e2577e', a1: '#ff6fa8', a2: '#ffc94d', a3: '#6fe0e8', ink: '#3a1f5c', glow: '#fff6d6' },
  // twilight: indigo, a warm figure
  sit: { sky: ['#2a2470', '#b866c9'], ground: '#1e1a52', sun: '#ffe08a', fig: '#ffb48a', fig2: '#f4946f', skin: '#ffe6d2', cushion: '#e04f7a', a1: '#ff7ac2', a2: '#ffd166', a3: '#62e3d6', ink: '#fff0e0', glow: '#fff1c9' },
  // lagoon: teal and mint, a deep-blue figure
  practice: { sky: ['#11899a', '#9ef2cf'], ground: '#0b5f6e', sun: '#fff4b0', fig: '#173f63', fig2: '#21507a', skin: '#ffd0b5', cushion: '#ff7a59', a1: '#ff8a65', a2: '#ffe066', a3: '#c39bff', ink: '#0f3049', glow: '#fffbe0' },
  // saffron: the day
  day: { sky: ['#ff7f3f', '#ffe7a3'], ground: '#b8410f', sun: '#fffbe6', fig: '#6e2a12', fig2: '#86361a', skin: '#ffd9b8', cushion: '#d6336c', a1: '#ff4f7b', a2: '#3fb8ec', a3: '#6fcf45', ink: '#5a1f0b', glow: '#fffbe6' },
}

export type Ctx = { p: Pal; u: string }
export const rad = (d: number) => (d * Math.PI) / 180
export const delay = (s: number) => ({ animationDelay: `${s}s` })

// ---------- primitives ----------

export function Sky({ p, u, from, to }: Ctx & { from?: string; to?: string }) {
  return (
    <>
      <defs>
        <linearGradient id={`${u}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from ?? p.sky[0]} />
          <stop offset="1" stopColor={to ?? p.sky[1]} />
        </linearGradient>
      </defs>
      <rect x="-10" y="-10" width="420" height="420" fill={`url(#${u}sky)`} />
    </>
  )
}

// a banded, psychedelic sun
export function Sun({ p, cx, cy, r, bands = true }: Ctx & { cx: number; cy: number; r: number; bands?: boolean }) {
  const rings = bands
    ? [
        [2.3, p.a3, 0.22],
        [1.9, p.a1, 0.32],
        [1.55, p.a2, 0.5],
        [1.25, p.glow, 0.7],
      ]
    : []
  return (
    <g>
      <g className="sp-glow">
        {rings.map(([k, c, o]) => (
          <circle key={String(k)} cx={cx} cy={cy} r={r * (k as number)} fill={c as string} opacity={o as number} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={r} fill={p.sun} />
    </g>
  )
}

export function Rays({ cx, cy, n = 32, r0 = 40, r1 = 300, color, op = 0.22, w = 3.2, spin = true, reverse = false }: { cx: number; cy: number; n?: number; r0?: number; r1?: number; color: string; op?: number; w?: number; spin?: boolean; reverse?: boolean }) {
  const tris = []
  for (let i = 0; i < n; i++) {
    const a = (i * 360) / n
    const p1 = [cx + Math.cos(rad(a - w)) * r1, cy + Math.sin(rad(a - w)) * r1]
    const p2 = [cx + Math.cos(rad(a + w)) * r1, cy + Math.sin(rad(a + w)) * r1]
    const p0 = [cx + Math.cos(rad(a)) * r0, cy + Math.sin(rad(a)) * r0]
    tris.push(<polygon key={i} points={`${p0} ${p1} ${p2}`} />)
  }
  return (
    <g style={{ transformOrigin: `${cx}px ${cy}px` }} className={spin ? (reverse ? 'sp-spin-r' : 'sp-spin') : undefined} fill={color} opacity={op}>
      {tris}
    </g>
  )
}

export function Ground({ p, y = 330, color }: Ctx & { y?: number; color?: string }) {
  return (
    <g>
      <path d={`M-10 ${y - 6} Q 100 ${y - 26} 200 ${y - 8} T 410 ${y - 12} V 410 H -10 Z`} fill={p.a1} opacity=".45" />
      <path d={`M-10 ${y} Q 110 ${y - 18} 210 ${y} T 410 ${y - 2} V 410 H -10 Z`} fill={color ?? p.ground} />
    </g>
  )
}

export function Mountains({ p, y = 300 }: Ctx & { y?: number }) {
  return (
    <g>
      <path d={`M-10 ${y} L 70 ${y - 120} L 140 ${y - 40} L 220 ${y - 170} L 310 ${y - 50} L 360 ${y - 100} L 410 ${y - 30} V 410 H -10 Z`} fill={p.a3} opacity=".55" />
      <path d={`M-10 ${y + 20} L 90 ${y - 70} L 170 ${y + 10} L 260 ${y - 110} L 350 ${y} L 410 ${y - 40} V 410 H -10 Z`} fill={p.a1} opacity=".55" />
      <path d={`M-10 ${y + 40} L 120 ${y - 20} L 230 ${y + 30} L 320 ${y - 30} L 410 ${y + 20} V 410 H -10 Z`} fill={p.ground} />
    </g>
  )
}

type Spot = 'belly' | 'heart' | 'knee' | 'none'
const SPOTS: Record<Exclude<Spot, 'none'>, [number, number, number]> = {
  belly: [0, -42, 26],
  heart: [0, -98, 24],
  knee: [74, -6, 14],
}

// the seated figure, cross-legged on a round cushion; origin is the centre of the seat
export function Figure({ p, x = 200, y = 330, s = 1, halo = false, spot = 'none', breathe = false, fill, legs, chakras = false, scan = false }: Ctx & { x?: number; y?: number; s?: number; halo?: boolean; spot?: Spot; breathe?: boolean; fill?: string; legs?: string; chakras?: boolean; scan?: boolean }) {
  const body = fill ?? p.fig
  const sp = spot === 'none' ? null : SPOTS[spot]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {halo && (
        <g className="sp-glow">
          <circle cx="0" cy="-178" r="74" fill={p.a2} opacity=".25" />
          <circle cx="0" cy="-178" r="58" fill={p.glow} opacity=".45" />
          <circle cx="0" cy="-178" r="44" fill="none" stroke={p.a1} strokeWidth="3" opacity=".8" />
        </g>
      )}
      <ellipse cx="0" cy="16" rx="92" ry="22" fill={p.cushion} />
      <ellipse cx="0" cy="10" rx="80" ry="12" fill="#fff" opacity=".18" />
      <path d="M-62 -6 C-60 -70 -54 -118 -36 -136 Q0 -150 36 -136 C54 -118 60 -70 62 -6 Z" fill={body} />
      <rect x="-11" y="-160" width="22" height="30" rx="9" fill={body} />
      <circle cx="0" cy="-180" r="29" fill={body} />
      <path d="M-106 2 C-104 -34 104 -34 106 2 C104 22 -104 22 -106 2 Z" fill={legs ?? (fill ? body : p.fig2)} />
      <ellipse cx="0" cy="-16" rx="25" ry="10" fill={p.skin} />
      <ellipse cx="0" cy="-19" rx="9" ry="4" fill={p.glow} fillOpacity=".9" className="sp-glow" />
      {sp && (
        <g>
          <circle cx={sp[0]} cy={sp[1]} r={sp[2] * 2.2} fill={p.a2} fillOpacity=".25" className={breathe ? 'sp-breathe' : 'sp-glow'} style={{ transformOrigin: `${sp[0]}px ${sp[1]}px` }} />
          <circle cx={sp[0]} cy={sp[1]} r={sp[2]} fill={p.glow} fillOpacity=".85" className={breathe ? 'sp-breathe' : 'sp-glow'} style={{ transformOrigin: `${sp[0]}px ${sp[1]}px` }} />
        </g>
      )}
      {chakras && (
        <g>
          <line x1="0" y1="-8" x2="0" y2="-190" stroke={p.glow} strokeWidth="3" opacity=".5" strokeLinecap="round" />
          {[p.a1, p.a2, p.glow, p.a3, p.a1, '#fff'].map((c, i) => (
            <circle key={i} cx="0" cy={-14 - i * 34} r="8" fill={c} className="sp-tw" style={delay(i * 0.6)} />
          ))}
        </g>
      )}
      {scan && (
        <g>
          {[-180, -140, -98, -56, -14, 4].map((cy, i) => (
            <ellipse key={i} cx="0" cy={cy} rx={i === 5 ? 96 : i < 2 ? 34 : 58} ry="9" fill={p.glow} className="sp-scan" style={delay(i * 1.1)} />
          ))}
        </g>
      )}
    </g>
  )
}

// seated on a chair, feet flat on the floor
function ChairFigure({ p, x = 200, y = 300, s = 1 }: Ctx & { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-74" y="-200" width="148" height="196" rx="18" fill={p.a3} opacity=".7" />
      <rect x="-86" y="-6" width="172" height="16" rx="8" fill={p.a3} />
      <rect x="-80" y="8" width="10" height="112" rx="4" fill={p.a3} />
      <rect x="70" y="8" width="10" height="112" rx="4" fill={p.a3} />
      <path d="M-58 -6 C-56 -70 -52 -118 -34 -136 Q0 -150 34 -136 C52 -118 56 -70 58 -6 Z" fill={p.fig} />
      <rect x="-11" y="-160" width="22" height="30" rx="9" fill={p.fig} />
      <circle cx="0" cy="-180" r="29" fill={p.fig} />
      <rect x="-60" y="-20" width="120" height="34" rx="16" fill={p.fig2} />
      <rect x="-52" y="4" width="34" height="112" rx="14" fill={p.fig2} />
      <rect x="18" y="4" width="34" height="112" rx="14" fill={p.fig2} />
      <ellipse cx="-38" cy="118" rx="26" ry="9" fill={p.fig} />
      <ellipse cx="38" cy="118" rx="26" ry="9" fill={p.fig} />
      <ellipse cx="0" cy="-22" rx="25" ry="10" fill={p.skin} />
    </g>
  )
}

function Standing({ p, x = 200, y = 330, s = 1, step = false, fill }: Ctx & { x?: number; y?: number; s?: number; step?: boolean; fill?: string }) {
  const c = fill ?? p.fig
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-160" r="20" fill={c} />
      <rect x="-7" y="-146" width="14" height="16" rx="6" fill={c} />
      <path d="M-28 -128 Q0 -140 28 -128 L36 -44 Q0 -34 -36 -44 Z" fill={c} />
      {step ? (
        <>
          <rect x="-17" y="-50" width="15" height="52" rx="7" fill={p.fig2} transform="rotate(14 -10 -50)" />
          <rect x="3" y="-50" width="15" height="52" rx="7" fill={p.fig2} transform="rotate(-12 10 -50)" />
        </>
      ) : (
        <>
          <rect x="-18" y="-50" width="15" height="52" rx="7" fill={p.fig2} />
          <rect x="3" y="-50" width="15" height="52" rx="7" fill={p.fig2} />
        </>
      )}
    </g>
  )
}

export function Cloud({ x, y, s = 1, fill = '#fff', op = 0.9, label, labelColor, drift, dur, cls }: { x: number; y: number; s?: number; fill?: string; op?: number; label?: string; labelColor?: string; drift?: 'l' | 'r' | 'b' | 'up'; dur?: number; cls?: string }) {
  const d = drift === 'l' ? 'sp-drift-l' : drift === 'r' ? 'sp-drift-r' : drift === 'b' ? 'sp-drift' : drift === 'up' ? 'sp-rise' : ''
  return (
    <g className={`${d} ${cls ?? ''}`} style={dur ? { animationDuration: `${dur}s` } : undefined}>
      <g transform={`translate(${x} ${y}) scale(${s})`} opacity={op}>
        <g fill={fill}>
          <circle cx="-42" cy="4" r="26" />
          <circle cx="-8" cy="-14" r="36" />
          <circle cx="32" cy="-2" r="28" />
          <circle cx="56" cy="12" r="18" />
          <rect x="-68" y="4" width="138" height="26" rx="13" />
        </g>
        {label && (
          <text x="0" y="14" textAnchor="middle" fontFamily="EB Garamond, serif" fontStyle="italic" fontSize="22" fill={labelColor ?? '#3a3040'}>
            {label}
          </text>
        )}
      </g>
    </g>
  )
}

export function Lotus({ x, y, s = 1, c, core = true }: { x: number; y: number; s?: number; c: [string, string, string]; core?: boolean }) {
  const petal = 'M0 0 C-20 -30 -16 -72 0 -92 C16 -72 20 -30 0 0 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="4" rx="78" ry="12" fill={c[1]} opacity=".5" />
      {[-72, -48, -24, 0, 24, 48, 72].map((a) => (
        <path key={a} d={petal} fill={c[0]} transform={`rotate(${a})`} opacity=".9" />
      ))}
      {[-36, -12, 12, 36].map((a) => (
        <path key={a} d={petal} fill={c[1]} transform={`rotate(${a}) scale(.78)`} />
      ))}
      {core && <path d={petal} fill={c[2]} transform="scale(.5)" />}
    </g>
  )
}

export function Twinkles({ p, pts, r = 2.4 }: { p: Pal; pts: [number, number][]; r?: number }) {
  return (
    <g fill={p.glow}>
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={r * (i % 3 === 0 ? 1.4 : 1)} className="sp-tw" style={delay((i * 0.73) % 4)} />
      ))}
    </g>
  )
}
export const STARS: [number, number][] = [[40, 60], [90, 30], [150, 70], [250, 40], [320, 80], [360, 140], [60, 150], [300, 30], [200, 20], [120, 120], [340, 210], [30, 230], [280, 120], [180, 110]]

// expanding rings that arrive one after another (opacity only, so they keep their rhythm under Reduce Motion)
function Rings({ cx, cy, n = 4, r0 = 40, gap = 34, colors, width = 3 }: { cx: number; cy: number; n?: number; r0?: number; gap?: number; colors: string[]; width?: number }) {
  return (
    <g fill="none" strokeWidth={width}>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={cx} cy={cy} r={r0 + i * gap} stroke={colors[i % colors.length]} className="sp-ring" style={delay(i * 0.9)} />
      ))}
    </g>
  )
}

export function Leaf({ x, y, r = 0, s = 1, fill }: { x: number; y: number; r?: number; s?: number; fill: string }) {
  return <path d="M0 22 C-20 8 -22 -14 -7 -22 Q0 -26 0 -42 Q0 -26 7 -22 C22 -14 20 8 0 22 Z" fill={fill} transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} />
}

function Foot({ x, y, r = 0, s = 1, p, left = false }: { x: number; y: number; r?: number; s?: number; p: Pal; left?: boolean }) {
  const m = left ? -1 : 1
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s * m} ${s})`}>
      <path d="M-14 26 C-22 6 -22 -18 -10 -30 C2 -40 18 -32 18 -14 C18 4 12 18 8 28 C4 40 -10 40 -14 26 Z" fill={p.glow} opacity=".9" />
      {[[-10, -44, 7], [1, -48, 6], [10, -45, 5], [17, -39, 4.4], [21, -31, 4]].map(([cx, cy, rr], i) => (
        <circle key={i} cx={cx} cy={cy} r={rr} fill={p.glow} opacity=".9" />
      ))}
      <circle cx="0" cy="-4" r="8" fill="none" stroke={p.a1} strokeWidth="2" />
      <circle cx="0" cy="-4" r="3" fill={p.a1} />
    </g>
  )
}

export function Bird({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return <path d="M-16 0 Q-8 -10 0 0 Q8 -10 16 0" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" transform={`translate(${x} ${y}) scale(${s})`} />
}

// a wavering ring (for the ripples page)
function wobble(cx: number, cy: number, r: number, amp: number, k: number, ph = 0) {
  let d = ''
  for (let i = 0; i <= 120; i++) {
    const a = (i / 120) * Math.PI * 2
    const rr = r + Math.sin(a * k + ph) * amp
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`
  }
  return `${d}Z`
}

// ---------- the plates ----------

export const SCENES: Record<string, (c: Ctx) => ReactNode> = {
  cover: (c) => (
    <>
      <Sky {...c} />
      <Rays cx={200} cy={200} n={40} r0={30} color={c.p.glow} op={0.2} />
      <Sun {...c} cx={200} cy={150} r={46} />
      <Lotus x={200} y={360} s={1.7} c={[c.p.a1, c.p.cushion, c.p.a2]} core={false} />
      <Figure {...c} y={318} s={0.62} halo />
      <Twinkles p={c.p} pts={STARS} />
    </>
  ),

  // I · What it is
  dawn: (c) => (
    <>
      <Sky {...c} />
      <Rays cx={200} cy={262} n={36} r0={80} r1={320} color={c.p.glow} op={0.25} />
      <Sun {...c} cx={200} cy={262} r={66} />
      <Ground {...c} y={318} />
      <Figure {...c} y={322} s={0.42} />
      <Bird x={110} y={110} s={0.9} color={c.p.ink} />
      <Bird x={140} y={90} s={0.6} color={c.p.ink} />
    </>
  ),
  'lotus-open': (c) => (
    <>
      <Sky {...c} />
      <Rays cx={200} cy={250} n={28} r0={60} color={c.p.a2} op={0.3} w={4} />
      <circle cx="200" cy="230" r="34" fill={c.p.glow} className="sp-glow" />
      <Lotus x={200} y={330} s={2} c={[c.p.a1, c.p.cushion, c.p.a2]} />
      <path d="M-10 350 Q100 335 200 352 T410 345 V410 H-10Z" fill={c.p.ground} />
      <Twinkles p={c.p} pts={[[80, 120], [320, 110], [60, 230], [340, 240], [200, 90], [130, 60], [270, 60]]} r={3} />
    </>
  ),
  'clouds-part': (c) => (
    <>
      <Sky {...c} />
      <Rays cx={200} cy={170} n={30} r0={50} color={c.p.glow} op={0.28} />
      <Sun {...c} cx={200} cy={170} r={44} />
      <Cloud x={70} y={190} s={1.3} drift="l" op={0.85} />
      <Cloud x={330} y={150} s={1.1} drift="r" op={0.85} />
      <Cloud x={110} y={90} s={0.7} drift="l" op={0.7} dur={34} />
      <Ground {...c} y={330} />
      <Figure {...c} y={338} s={0.5} />
    </>
  ),
  'big-sky-head': (c) => (
    <>
      <Sky {...c} from="#2b1a5e" to={c.p.sky[0]} />
      <Twinkles p={c.p} pts={STARS} />
      <g className="sp-glow">
        {[190, 160, 132, 106, 82].map((r, i) => (
          <circle key={r} cx="200" cy="232" r={r} fill={[c.p.a3, c.p.a1, c.p.a2, c.p.glow, c.p.a1][i]} opacity={0.14 + i * 0.07} />
        ))}
      </g>
      <Figure {...c} y={440} s={1.15} />
      <Cloud x={262} y={160} s={0.32} drift="b" />
    </>
  ),
  'three-seeds': (c) => (
    <>
      <Sky {...c} />
      <Ground {...c} y={336} />
      <Figure {...c} y={334} s={0.62} halo />
      {[[86, 150], [200, 86], [314, 150]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="44" fill={[c.p.a3, c.p.a2, c.p.a1][i]} fillOpacity=".35" className="sp-glow" style={delay(i)} />
          <circle cx={x} cy={y} r="30" fill={c.p.glow} />
        </g>
      ))}
      {/* sight */}
      <path d="M66 150 Q86 134 106 150 Q86 166 66 150Z" fill="none" stroke={c.p.ink} strokeWidth="2.4" />
      <circle cx="86" cy="150" r="6" fill={c.p.ink} />
      {/* sound */}
      <g fill="none" stroke={c.p.ink} strokeWidth="2.4" strokeLinecap="round">
        <circle cx="190" cy="86" r="4" fill={c.p.ink} />
        <path d="M198 76 Q206 86 198 96" />
        <path d="M204 70 Q216 86 204 102" />
      </g>
      {/* touch */}
      <path d="M314 150 m-12 0 a12 12 0 1 1 12 12 a6 6 0 1 1 -6 -6" fill="none" stroke={c.p.ink} strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
  'own-light': (c) => (
    <>
      <Sky {...c} from="#3b1f6b" to={c.p.sky[0]} />
      <Twinkles p={c.p} pts={STARS.slice(0, 9)} />
      <path d="M-10 300 Q100 285 200 300 T410 296 V410 H-10Z" fill={c.p.ground} />
      {[[100, 300, 0.8, c.p.a3], [200, 280, 1.05, c.p.a2], [300, 300, 0.8, c.p.a1]].map(([x, y, s, col], i) => (
        <g key={i}>
          <Rays cx={x as number} cy={(y as number) - 40} n={20} r0={20} r1={110 * (s as number)} color={col as string} op={0.45} spin={false} />
          <circle cx={x as number} cy={(y as number) - 40} r={46 * (s as number)} fill={col as string} fillOpacity=".35" className="sp-glow" style={delay(i * 1.3)} />
          <Lotus x={x as number} y={y as number} s={(s as number) * 0.7} c={[col as string, c.p.cushion, c.p.glow]} />
        </g>
      ))}
    </>
  ),
  'passing-clouds': (c) => (
    <>
      <Sky {...c} />
      <Cloud x={70} y={80} s={0.8} drift="r" dur={30} />
      <Cloud x={300} y={130} s={0.6} drift="l" dur={24} op={0.75} />
      <Cloud x={160} y={190} s={0.5} drift="r" dur={36} op={0.7} />
      <Ground {...c} y={330} />
      <Figure {...c} y={336} s={0.56} halo />
    </>
  ),
  'you-are-sky': (c) => (
    <>
      <defs>
        <radialGradient id={`${c.u}cos`} cx=".5" cy=".35" r=".7">
          <stop offset="0" stopColor={c.p.a3} />
          <stop offset=".5" stopColor="#5a45c9" />
          <stop offset="1" stopColor="#2b1a5e" />
        </radialGradient>
      </defs>
      <Sky {...c} from={c.p.sky[1]} to="#ffe9c9" />
      <Rays cx={200} cy={190} n={36} r0={60} color={c.p.a1} op={0.18} />
      <Figure {...c} y={380} s={1.2} fill={`url(#${c.u}cos)`} legs="#2b1a5e" />
      <Twinkles p={c.p} pts={[[180, 200], [220, 230], [200, 300], [170, 330], [235, 320], [196, 160], [210, 262]]} r={2} />
      <Cloud x={196} y={262} s={0.36} drift="b" dur={18} />
    </>
  ),

  // II · Sitting
  'tall-spine': (c) => (
    <>
      <Sky {...c} />
      <Twinkles p={c.p} pts={STARS} />
      <Rays cx={200} cy={140} n={30} r0={40} color={c.p.glow} op={0.16} />
      <Ground {...c} y={340} />
      <Figure {...c} y={340} s={0.9} halo chakras />
    </>
  ),
  'chair-or-cushion': (c) => (
    <>
      <Sky {...c} />
      <Twinkles p={c.p} pts={STARS.slice(0, 8)} />
      <path d="M-10 320 H410 V410 H-10Z" fill={c.p.ground} />
      <path d="M-10 320 H410" stroke={c.p.a1} strokeWidth="3" opacity=".6" />
      <ChairFigure {...c} x={118} y={248} s={0.56} />
      <Figure {...c} x={290} y={306} s={0.58} />
      <circle cx="200" cy="200" r="5" fill={c.p.glow} className="sp-tw" />
    </>
  ),
  mudra: (c) => (
    <>
      <Sky {...c} />
      <Rays cx={200} cy={200} n={40} r0={70} color={c.p.a2} op={0.2} />
      <g className="sp-glow">
        <circle cx="200" cy="200" r="160" fill={c.p.a1} opacity=".18" />
        <circle cx="200" cy="200" r="120" fill={c.p.a3} opacity=".18" />
      </g>
      <path d="M68 250 C70 300 140 320 200 320 C260 320 330 300 332 250 C300 270 100 270 68 250Z" fill={c.p.fig2} />
      <path d="M80 236 C84 280 140 300 200 300 C260 300 316 280 320 236 C290 256 110 256 80 236Z" fill={c.p.skin} />
      <path d="M96 240 C100 190 150 156 200 156 C250 156 300 190 304 240" fill="none" stroke={c.p.skin} strokeWidth="30" strokeLinecap="round" />
      <ellipse cx="200" cy="214" rx="76" ry="40" fill={c.p.glow} className="sp-glow" />
      <ellipse cx="200" cy="214" rx="40" ry="20" fill={c.p.a2} fillOpacity=".7" className="sp-breathe" style={{ transformOrigin: '200px 214px' }} />
    </>
  ),
  'soft-gaze': (c) => (
    <>
      <Sky {...c} />
      <path d="M-10 300 H410 V410 H-10Z" fill={c.p.ground} />
      <defs>
        <linearGradient id={`${c.u}beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.p.glow} stopOpacity=".6" />
          <stop offset="1" stopColor={c.p.glow} stopOpacity=".05" />
        </linearGradient>
      </defs>
      <path d="M180 158 L220 158 L300 350 L100 350Z" fill={`url(#${c.u}beam)`} />
      <ellipse cx="200" cy="350" rx="100" ry="18" fill={c.p.a2} fillOpacity=".6" className="sp-glow" />
      <ellipse cx="200" cy="350" rx="44" ry="8" fill={c.p.glow} />
      <g>
        <path d="M80 140 Q200 50 320 140 Q200 230 80 140Z" fill="#fff" />
        <circle cx="200" cy="156" r="36" fill={c.p.a3} />
        <circle cx="200" cy="160" r="16" fill="#1e1a52" />
        <path d="M76 140 Q200 50 324 140 Q200 120 76 140Z" fill={c.p.fig} />
        <path d="M80 140 Q200 50 320 140" fill="none" stroke={c.p.fig2} strokeWidth="6" />
        <path d="M84 142 Q200 124 316 142" fill="none" stroke={c.p.ink} strokeWidth="3" opacity=".8" />
      </g>
    </>
  ),
  settling: (c) => (
    <>
      <Sky {...c} />
      <Twinkles p={c.p} pts={STARS.slice(2, 12)} />
      <Rings cx={200} cy={250} r0={70} gap={40} n={4} colors={[c.p.a1, c.p.a2, c.p.a3]} />
      <Ground {...c} y={340} />
      <Figure {...c} y={336} s={0.72} spot="belly" breathe />
    </>
  ),
  stillness: (c) => (
    <>
      <Sky {...c} />
      <Sun {...c} cx={300} cy={110} r={26} />
      <Mountains {...c} y={290} />
      <Figure {...c} y={344} s={0.8} spot="knee" />
      <circle cx={200 + 74 * 0.8} cy={344 - 6 * 0.8} r="26" fill="none" stroke={c.p.glow} strokeWidth="2" className="sp-ring" />
    </>
  ),

  // III · The practice
  'breath-home': (c) => (
    <>
      <Sky {...c} />
      <Rays cx={200} cy={290} n={34} r0={40} color={c.p.glow} op={0.22} />
      <Ground {...c} y={346} />
      <Figure {...c} y={350} s={0.86} spot="belly" breathe halo />
    </>
  ),
  'belly-wave': (c) => (
    <>
      <Sky {...c} />
      <g fill="none" strokeWidth="5" strokeLinecap="round">
        {[c.p.a1, c.p.a2, c.p.a3, c.p.glow].map((col, i) => (
          <path key={i} d={`M-10 ${150 + i * 26} Q 50 ${130 + i * 26} 100 ${150 + i * 26} T 200 ${150 + i * 26} T 300 ${150 + i * 26} T 410 ${150 + i * 26}`} stroke={col} opacity=".5" className="sp-tw" style={delay(i * 0.8)} />
        ))}
      </g>
      <Figure {...c} y={398} s={1.25} spot="belly" breathe />
    </>
  ),
  'breath-fills': (c) => (
    <>
      <Sky {...c} />
      <g className="sp-breathe" style={{ transformOrigin: '200px 310px' }}>
        {[180, 140, 104, 72].map((r, i) => (
          <circle key={r} cx="200" cy="310" r={r} fill={[c.p.a3, c.p.a1, c.p.a2, c.p.glow][i]} opacity={0.22 + i * 0.12} />
        ))}
      </g>
      <Figure {...c} y={350} s={0.6} spot="belly" />
    </>
  ),
  beads: (c) => (
    <>
      <Sky {...c} />
      <Ground {...c} y={348} />
      <Figure {...c} y={350} s={0.62} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = rad(-168 + i * (156 / 9))
        const x = 200 + Math.cos(a) * 150, y = 236 + Math.sin(a) * 150
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="15" fill={c.p.fig2} />
            <circle cx={x} cy={y} r="15" fill={c.p.glow} className="sp-count" style={delay(i * 1.2)} />
          </g>
        )
      })}
      <path d={`M${200 - 150 * Math.cos(rad(12))} ${236 - 150 * Math.sin(rad(12))} A150 150 0 0 1 ${200 + 150 * Math.cos(rad(12))} ${236 - 150 * Math.sin(rad(12))}`} fill="none" stroke={c.p.fig2} strokeWidth="2" opacity=".6" />
    </>
  ),
  return: (c) => (
    <>
      <Sky {...c} />
      <Ground {...c} y={348} />
      <Cloud x={300} y={110} s={0.55} drift="b" dur={14} />
      <path d="M296 140 C 340 220, 280 280, 206 304" fill="none" stroke={c.p.glow} strokeWidth="4" strokeDasharray="1 12" strokeLinecap="round" className="sp-flow" />
      <Figure {...c} y={350} s={0.74} spot="belly" breathe />
    </>
  ),
  waking: (c) => (
    <>
      <Sky {...c} />
      <Rays cx={200} cy={170} n={36} r0={60} color={c.p.glow} op={0.3} />
      <Sun {...c} cx={200} cy={170} r={56} />
      <Cloud x={40} y={250} s={0.9} drift="l" op={0.55} />
      <Cloud x={360} y={230} s={0.8} drift="r" op={0.55} />
      <Ground {...c} y={346} />
      <Figure {...c} y={350} s={0.66} />
    </>
  ),
  label: (c) => (
    <>
      <Sky {...c} />
      <Ground {...c} y={350} />
      <Cloud x={200} y={130} s={1.25} drift="b" dur={20} label="thinking, thinking" labelColor={c.p.ink} />
      <Figure {...c} y={352} s={0.58} halo />
    </>
  ),
  ripples: (c) => (
    <>
      <Sky {...c} />
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <path key={k} d={wobble(200, 200, 52 + k * 26, 5 + k, 7 + k, k)} fill="none" stroke={[c.p.a1, c.p.a2, c.p.a3, c.p.glow, c.p.cushion, c.p.a2][k]} strokeWidth="5" opacity={0.85 - k * 0.1} className={k % 2 ? 'sp-spin' : 'sp-spin-r'} style={{ transformOrigin: '200px 200px', animationDuration: `${90 + k * 20}s` }} />
      ))}
      <Cloud x={196} y={204} s={0.5} />
    </>
  ),
  'feeling-clouds': (c) => (
    <>
      <Sky {...c} />
      <Ground {...c} y={350} />
      <Cloud x={112} y={120} s={0.85} fill="#7fb2ff" drift="l" label="sadness" labelColor="#fff" />
      <Cloud x={290} y={170} s={0.85} fill="#ff7a6b" drift="r" label="anger" labelColor="#fff" />
      <Figure {...c} y={352} s={0.6} halo />
    </>
  ),
  'heart-glow': (c) => (
    <>
      <Sky {...c} />
      <Ground {...c} y={360} />
      <g fill="none" stroke={c.p.a1} strokeWidth="3" strokeLinecap="round">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = rad(i * 45)
          const x = 200 + Math.cos(a) * 70, y = 270 + Math.sin(a) * 70
          return <path key={i} d={`M${x} ${y} q 6 -8 12 0 t 12 0`} transform={`rotate(${i * 45} ${x} ${y})`} className="sp-tw" style={delay(i * 0.5)} />
        })}
      </g>
      <Figure {...c} y={360} s={0.9} spot="heart" />
    </>
  ),
  widening: (c) => (
    <>
      <Sky {...c} />
      <Rings cx={200} cy={250} r0={60} gap={38} n={5} colors={[c.p.a1, c.p.a2, c.p.a3, c.p.glow]} />
      <Bird x={90} y={90} color={c.p.ink} />
      <Bird x={120} y={70} s={0.7} color={c.p.ink} />
      <Leaf x={320} y={110} r={30} fill={c.p.a3} />
      <Ground {...c} y={346} />
      <Figure {...c} y={348} s={0.6} />
    </>
  ),
  choiceless: (c) => (
    <>
      <Sky {...c} />
      <circle cx="200" cy="210" r="140" fill="none" stroke={c.p.glow} strokeWidth="2" strokeDasharray="2 10" opacity=".7" />
      <circle cx="200" cy="210" r="96" fill={c.p.glow} fillOpacity=".25" className="sp-glow" />
      <Figure {...c} y={262} s={0.42} halo />
      {[
        <Cloud key="c" x={0} y={0} s={0.35} />,
        <Bird key="b" x={0} y={0} s={1.2} color={c.p.ink} />,
        <Leaf key="l" x={0} y={0} fill={c.p.a3} r={20} s={0.9} />,
        <polygon key="s" points="0,-14 4,-4 14,-4 6,3 9,14 0,7 -9,14 -6,3 -14,-4 -4,-4" fill={c.p.a2} />,
        <g key="n" fill={c.p.ink}><circle cx="-4" cy="8" r="6" /><rect x="1" y="-14" width="3" height="22" /></g>,
        <path key="d" d="M0 -14 C8 -2 10 4 0 12 C-10 4 -8 -2 0 -14Z" fill={c.p.a2} />,
        <circle key="o" r="10" fill={c.p.a1} />,
        <Leaf key="l2" x={0} y={0} fill={c.p.a1} r={-30} s={0.7} />,
      ].map((el, i) => {
        const a = rad(-90 + i * 45)
        return (
          <g key={i} transform={`translate(${200 + Math.cos(a) * 140} ${210 + Math.sin(a) * 140})`} className="sp-arise" style={delay(i * 1.4)}>
            {el}
          </g>
        )
      })}
    </>
  ),
  enso: (c) => (
    <>
      <Sky {...c} from={c.p.sky[1]} to="#f4fbf6" />
      <path d="M268 112 A112 112 0 1 0 312 196" fill="none" stroke={c.p.ink} strokeWidth="26" strokeLinecap="round" pathLength={100} className="sp-draw" />
      <path d="M268 112 A112 112 0 1 0 312 196" fill="none" stroke={c.p.fig2} strokeWidth="8" strokeLinecap="round" opacity=".6" transform="translate(4 4)" pathLength={100} className="sp-draw" />
      <Figure {...c} y={262} s={0.38} spot="belly" breathe />
    </>
  ),
  'singing-bowl': (c) => (
    <>
      <Sky {...c} />
      <g fill="none" strokeWidth="3">
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx="200" cy="230" rx={80 + i * 34} ry={30 + i * 16} stroke={[c.p.a2, c.p.glow, c.p.a1, c.p.a3][i]} className="sp-ring" style={delay(i * 0.9)} />
        ))}
      </g>
      <path d="M-10 330 H410 V410 H-10Z" fill={c.p.ground} />
      <ellipse cx="200" cy="330" rx="100" ry="14" fill={c.p.cushion} />
      <path d="M110 250 Q118 330 200 330 Q282 330 290 250 Z" fill={c.p.a2} />
      <path d="M110 250 Q118 330 200 330 Q282 330 290 250 Z" fill={c.p.a1} opacity=".25" />
      <ellipse cx="200" cy="250" rx="90" ry="18" fill={c.p.glow} />
      <ellipse cx="200" cy="252" rx="78" ry="12" fill={c.p.a2} opacity=".6" />
      <rect x="282" y="290" width="90" height="10" rx="5" fill={c.p.fig} transform="rotate(-24 282 290)" />
    </>
  ),
  'seven-days': (c) => (
    <>
      <Sky {...c} />
      {Array.from({ length: 7 }, (_, i) => {
        const a = rad(-160 + i * (140 / 6))
        const x = 200 + Math.cos(a) * 150, y = 280 + Math.sin(a) * 150
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="30" fill={[c.p.fig, c.p.fig2, c.p.a3, c.p.a1, c.p.a2, c.p.glow, '#fff'][i]} opacity=".9" />
            <circle cx={x} cy={y} r="38" fill="none" stroke={c.p.glow} strokeWidth="2" className="sp-count" style={delay(i * 1.2)} />
            <Figure {...c} x={x} y={y + 14} s={0.11} />
          </g>
        )
      })}
      <Ground {...c} y={350} />
      <Figure {...c} y={350} s={0.5} halo />
    </>
  ),

  // IV · Through the day
  footprints: (c) => (
    <>
      <Sky {...c} />
      <path d="M-10 160 Q200 120 410 170 V410 H-10Z" fill={c.p.ground} />
      <path d="M150 410 Q190 300 230 170" fill="none" stroke={c.p.a1} strokeWidth="60" opacity=".35" strokeLinecap="round" />
      {[[156, 370, 0.95], [208, 316, 0.82], [172, 268, 0.7], [218, 228, 0.6], [190, 194, 0.5]].map(([x, y, s], i) => (
        <g key={i} className="sp-step" style={delay(i * 1.1)}>
          <Foot p={c.p} x={x} y={y} s={s} r={i % 2 ? 14 : -6} left={i % 2 === 0} />
        </g>
      ))}
      <Sun {...c} cx={300} cy={80} r={26} />
    </>
  ),
  bowl: (c) => (
    <>
      <Sky {...c} />
      <g fill="none" stroke={c.p.glow} strokeWidth="6" strokeLinecap="round" opacity=".8">
        {[160, 200, 240].map((x, i) => (
          <path key={x} d={`M${x} 200 q -16 -26 0 -52 t 0 -52`} className="sp-rise" style={{ ...delay(i * 1.2), animationDuration: '6s' }} />
        ))}
      </g>
      <path d="M-10 320 H410 V410 H-10Z" fill={c.p.ground} />
      <ellipse cx="200" cy="318" rx="110" ry="14" fill="#000" opacity=".12" />
      <path d="M90 220 Q96 316 200 316 Q304 316 310 220 Z" fill={c.p.a2} />
      <path d="M90 220 Q96 316 200 316 Q304 316 310 220" fill="none" stroke={c.p.a1} strokeWidth="10" opacity=".6" strokeDasharray="2 18" strokeLinecap="round" />
      <ellipse cx="200" cy="220" rx="110" ry="22" fill={c.p.glow} />
      <ellipse cx="200" cy="222" rx="96" ry="15" fill={c.p.a3} opacity=".55" />
      <rect x="220" y="150" width="8" height="120" rx="4" fill={c.p.fig} transform="rotate(28 224 210)" />
      <rect x="236" y="150" width="8" height="120" rx="4" fill={c.p.fig2} transform="rotate(34 240 210)" />
    </>
  ),
  doorway: (c) => (
    <>
      <rect x="-10" y="-10" width="420" height="420" fill={c.p.ground} />
      <path d="M110 400 V190 A90 90 0 0 1 290 190 V400 Z" fill={c.p.a1} />
      <defs>
        <clipPath id={`${c.u}door`}>
          <path d="M126 400 V194 A74 74 0 0 1 274 194 V400 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${c.u}door)`}>
        <Sky {...c} />
        <Rays cx={200} cy={210} n={30} r0={20} color={c.p.glow} op={0.4} />
        <Sun {...c} cx={200} cy={210} r={30} />
        <path d="M100 330 Q200 300 300 330 V410 H100Z" fill={c.p.a3} />
      </g>
      <Standing {...c} x={200} y={378} s={0.92} />
      <path d="M-10 380 H410 V410 H-10Z" fill={c.p.fig} opacity=".5" />
    </>
  ),
  'one-foot': (c) => (
    <>
      <Sky {...c} />
      <rect x="200" y="-10" width="210" height="420" fill={c.p.glow} opacity=".35" />
      <Rays cx={330} cy={150} n={24} r0={20} r1={200} color={c.p.glow} op={0.4} />
      <Cloud x={70} y={100} s={0.55} drift="b" dur={12} op={0.85} />
      <Cloud x={110} y={170} s={0.4} drift="b" dur={16} op={0.75} />
      <Cloud x={50} y={230} s={0.35} drift="b" dur={10} op={0.7} />
      <Ground {...c} y={344} />
      <ellipse cx="216" cy="346" rx="44" ry="10" fill={c.p.glow} className="sp-glow" />
      <Standing {...c} x={200} y={344} s={1.05} />
    </>
  ),
  'storm-sun': (c) => (
    <>
      <Sky {...c} />
      <Rays cx={290} cy={190} n={30} r0={40} color={c.p.glow} op={0.4} />
      <Sun {...c} cx={290} cy={190} r={50} />
      <Cloud x={150} y={140} s={1.5} fill="#5b4a72" op={0.95} drift="l" dur={30} />
      <path d="M150 190 L132 236 L152 236 L136 280" fill="none" stroke={c.p.a2} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" className="sp-tw" />
      <Ground {...c} y={350} />
      <Figure {...c} y={352} s={0.46} spot="belly" breathe />
    </>
  ),
  journey: (c) => (
    <>
      <Sky {...c} />
      <Sun {...c} cx={220} cy={110} r={34} />
      <Mountains {...c} y={230} />
      <path d="M130 410 C 180 360, 300 350, 250 310 S 160 270, 210 240" fill="none" stroke={c.p.glow} strokeWidth="26" strokeLinecap="round" opacity=".85" />
      <path d="M130 410 C 180 360, 300 350, 250 310 S 160 270, 210 240" fill="none" stroke={c.p.a2} strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round" />
      <Standing {...c} x={262} y={330} s={0.36} step />
    </>
  ),
  'body-scan': (c) => (
    <>
      <Sky {...c} />
      <Ground {...c} y={354} />
      <Figure {...c} y={354} s={0.9} scan />
    </>
  ),
  stones: (c) => (
    <>
      <Sky {...c} />
      <Ground {...c} y={330} />
      <Figure {...c} y={330} s={0.56} halo />
      {[[66, 340, 22, c.p.a2], [118, 372, 18, c.p.a3], [200, 384, 20, c.p.cushion], [284, 372, 18, c.p.a1], [336, 340, 22, c.p.glow]].map(([x, y, r, col], i) => (
        <g key={i}>
          <ellipse cx={x as number} cy={y as number} rx={(r as number) * 2} ry={(r as number) * 1.1} fill="none" stroke={c.p.glow} strokeWidth="2" className="sp-ring" style={delay(i * 0.9)} />
          <ellipse cx={x as number} cy={y as number} rx={r as number} ry={(r as number) * 0.7} fill={col as string} />
        </g>
      ))}
    </>
  ),
  dishes: (c) => (
    <>
      <Sky {...c} />
      <path d="M-10 300 H410 V410 H-10Z" fill={c.p.ground} />
      <path d="M150 -10 C150 90 190 150 190 220" fill="none" stroke={c.p.a2} strokeWidth="10" strokeLinecap="round" opacity=".7" />
      <path d="M150 -10 C150 90 190 150 190 220" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      <ellipse cx="200" cy="296" rx="130" ry="20" fill={c.p.a2} opacity=".5" />
      <ellipse cx="210" cy="240" rx="88" ry="88" fill={c.p.glow} transform="rotate(-12 210 240) scale(1 .98)" />
      <ellipse cx="210" cy="240" rx="58" ry="58" fill="none" stroke={c.p.a1} strokeWidth="6" strokeDasharray="4 10" strokeLinecap="round" />
      <ellipse cx="210" cy="240" rx="30" ry="30" fill={c.p.a3} opacity=".6" />
      {[[120, 200, 10], [300, 170, 8], [280, 260, 12], [140, 280, 7], [320, 220, 6], [110, 150, 6]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="none" stroke="#fff" strokeWidth="2" className="sp-tw" style={delay(i * 0.6)} />
      ))}
    </>
  ),
  morning: (c) => (
    <>
      <rect x="-10" y="-10" width="420" height="420" fill={c.p.a1} opacity=".55" />
      <rect x="-10" y="-10" width="420" height="420" fill={c.p.ground} opacity=".35" />
      <defs>
        <clipPath id={`${c.u}win`}>
          <path d="M130 250 V120 A70 70 0 0 1 270 120 V250 Z" />
        </clipPath>
      </defs>
      <path d="M118 262 V120 A82 82 0 0 1 282 120 V262 Z" fill={c.p.glow} />
      <g clipPath={`url(#${c.u}win)`}>
        <Sky {...c} from={c.p.a2} to={c.p.sky[1]} />
        <Sun {...c} cx={200} cy={210} r={28} />
        <Mountains {...c} y={240} />
      </g>
      <path d="M200 50 V250 M130 160 H270" stroke={c.p.glow} strokeWidth="5" />
      <path d="M150 262 L60 410 H340 L250 262Z" fill={c.p.glow} fillOpacity=".22" className="sp-glow" />
      <rect x="40" y="300" width="320" height="60" rx="18" fill={c.p.a2} />
      <ellipse cx="96" cy="300" rx="44" ry="18" fill="#fff" />
      <circle cx="104" cy="288" r="22" fill={c.p.fig} />
      <path d="M126 300 C170 270 300 270 344 300 V320 H126Z" fill={c.p.cushion} />
      <rect x="40" y="356" width="320" height="16" rx="6" fill={c.p.fig2} />
    </>
  ),
  circle: (c) => (
    <>
      <Sky {...c} />
      <Ground {...c} y={300} />
      <circle cx="200" cy="290" r="90" fill={c.p.glow} fillOpacity=".3" className="sp-glow" />
      {[[110, 268, 0.3], [290, 268, 0.3], [200, 254, 0.27]].map(([x, y, s], i) => (
        <Figure key={i} {...c} x={x} y={y} s={s} fill={c.p.fig2} legs={c.p.fig} />
      ))}
      <Lotus x={200} y={312} s={0.55} c={[c.p.a1, c.p.cushion, c.p.a2]} />
      <path d="M200 236 C214 252 214 270 200 280 C186 270 186 252 200 236Z" fill={c.p.a2} className="sp-glow" />
      {[[70, 360, 0.38], [330, 360, 0.38]].map(([x, y, s], i) => (
        <Figure key={i} {...c} x={x} y={y} s={s} />
      ))}
    </>
  ),
  release: (c) => (
    <>
      <Sky {...c} />
      <Rays cx={200} cy={240} n={30} r0={60} color={c.p.glow} op={0.25} />
      <Cloud x={200} y={150} s={0.5} drift="up" dur={14} />
      <Bird x={130} y={80} s={1.1} color={c.p.ink} />
      <Bird x={280} y={100} s={0.8} color={c.p.ink} />
      <path d="M60 300 C80 360 150 380 200 380 C250 380 320 360 340 300 C300 330 100 330 60 300Z" fill={c.p.fig2} />
      <path d="M56 290 C70 250 110 240 150 260 C170 270 190 290 200 300 C210 290 230 270 250 260 C290 240 330 250 344 290 C310 316 90 316 56 290Z" fill={c.p.skin} />
      <ellipse cx="200" cy="290" rx="60" ry="14" fill={c.p.glow} fillOpacity=".8" className="sp-glow" />
    </>
  ),
  host: (c) => (
    <>
      <defs>
        <radialGradient id={`${c.u}host`} cx=".5" cy=".4" r=".7">
          <stop offset="0" stopColor={c.p.glow} />
          <stop offset=".45" stopColor={c.p.a2} />
          <stop offset="1" stopColor={c.p.a1} />
        </radialGradient>
      </defs>
      <Sky {...c} />
      <Rays cx={200} cy={200} n={44} r0={80} color={c.p.glow} op={0.22} />
      <Figure {...c} y={392} s={1.25} fill={`url(#${c.u}host)`} legs={c.p.a1} />
      <Cloud x={196} y={258} s={0.34} drift="b" dur={16} op={0.95} fill={c.p.fig} />
    </>
  ),
  moon: (c) => (
    <>
      <Sky {...c} from="#2a1747" to="#7b3f8f" />
      <Twinkles p={c.p} pts={STARS} />
      <g className="sp-glow">
        <circle cx="200" cy="140" r="96" fill={c.p.a1} opacity=".18" />
        <circle cx="200" cy="140" r="74" fill={c.p.a2} opacity=".25" />
      </g>
      <circle cx="200" cy="140" r="54" fill={c.p.glow} />
      <rect x="-10" y="250" width="420" height="160" fill="#2a1747" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={200 - (50 - i * 6)} y={268 + i * 18} width={(50 - i * 6) * 2} height="5" rx="2.5" fill={c.p.glow} opacity={0.8 - i * 0.1} className="sp-tw" style={delay(i * 0.5)} />
      ))}
      <Lotus x={300} y={300} s={0.34} c={[c.p.a1, c.p.cushion, c.p.a2]} />
      <Lotus x={100} y={320} s={0.26} c={[c.p.a3, c.p.a1, c.p.a2]} />
    </>
  ),
  kindness: (c) => (
    <>
      <Sky {...c} />
      <Rays cx={200} cy={250} n={36} r0={30} color={c.p.glow} op={0.28} />
      <Ground {...c} y={340} />
      <circle cx="200" cy="250" r="60" fill={c.p.glow} fillOpacity=".5" className="sp-glow" />
      <path d="M200 286 C160 256 166 214 196 222 Q200 224 200 230 Q200 224 204 222 C234 214 240 256 200 286Z" fill={c.p.a1} className="sp-breathe" style={{ transformOrigin: '200px 250px' }} />
      <Figure {...c} x={92} y={344} s={0.5} spot="heart" />
      <Figure {...c} x={308} y={344} s={0.5} spot="heart" fill={c.p.fig2} legs={c.p.fig} />
    </>
  ),
  bodhi: (c) => {
    const leaves: [number, number, number][] = []
    for (let i = 0; i < 46; i++) {
      const a = rad(-180 + (i * 180) / 45)
      const ring = i % 3
      const r = 120 + ring * 38
      leaves.push([200 + Math.cos(a) * r, 210 + Math.sin(a) * r * 0.85, (a * 180) / Math.PI + 90])
    }
    return (
      <>
        <Sky {...c} />
        <Rays cx={200} cy={190} n={40} r0={40} color={c.p.glow} op={0.28} />
        <path d="M318 360 C 300 280, 330 200, 286 120" stroke={c.p.fig2} strokeWidth="22" strokeLinecap="round" fill="none" />
        <path d="M308 230 C 270 200, 240 190, 200 120 M300 170 C 330 140, 350 120, 360 90" stroke={c.p.fig2} strokeWidth="9" strokeLinecap="round" fill="none" />
        {leaves.map(([x, y, r], i) => (
          <Leaf key={i} x={x} y={y} r={r} s={0.8} fill={[c.p.a3, '#3fae5a', c.p.a2, c.p.a1][i % 4]} />
        ))}
        <Ground {...c} y={350} />
        <Figure {...c} y={352} s={0.62} halo spot="heart" />
      </>
    )
  },
  end: (c) => (
    <>
      <Sky {...c} />
      <Twinkles p={c.p} pts={STARS} />
      <Rays cx={200} cy={200} n={48} r0={50} color={c.p.glow} op={0.22} />
      <g className="sp-glow">
        {[150, 118, 90].map((r, i) => (
          <circle key={r} cx="200" cy="190" r={r} fill={[c.p.a3, c.p.a1, c.p.a2][i]} opacity={0.2 + i * 0.08} />
        ))}
      </g>
      <Lotus x={200} y={350} s={1.4} c={[c.p.a1, c.p.cushion, c.p.a2]} core={false} />
      <Figure {...c} y={318} s={0.58} halo spot="heart" />
    </>
  ),
}

// the round plate: a moon window framed by a slowly turning rainbow aureole.
// Another book can hang its own picture in the same window by passing `draw`.
export function Plate({ scene, p, u, label, draw: own }: { scene?: string; p: Pal; u: string; label: string; draw?: (c: Ctx) => ReactNode }) {
  const draw = own ?? (scene ? SCENES[scene] : undefined)
  const petals = Array.from({ length: 36 }, (_, i) => i)
  return (
    <svg className="plate" viewBox="-72 -72 544 544" role="img" aria-label={label}>
      <defs>
        <clipPath id={`${u}clip`}>
          <circle cx="200" cy="200" r="200" />
        </clipPath>
      </defs>
      <g className="sp-glow">
        <circle cx="200" cy="200" r="250" fill={p.glow} opacity=".22" />
      </g>
      <g className="sp-spin" style={{ transformOrigin: '200px 200px', animationDuration: '240s' }}>
        {petals.map((i) => (
          <path key={i} d="M0 0 C-9 -12 -7 -26 0 -34 C7 -26 9 -12 0 0Z" fill={[p.a1, p.a2, p.a3][i % 3]} opacity=".85" transform={`rotate(${i * 10} 200 200) translate(200 -36)`} />
        ))}
      </g>
      <circle cx="200" cy="200" r="230" fill="none" stroke={p.a2} strokeWidth="2" strokeDasharray="1 9" strokeLinecap="round" opacity=".9" />
      <circle cx="200" cy="200" r="220" fill="none" stroke={p.a3} strokeWidth="4" opacity=".75" />
      <circle cx="200" cy="200" r="211" fill="none" stroke={p.a1} strokeWidth="5" opacity=".85" />
      <circle cx="200" cy="200" r="204" fill="none" stroke={p.a2} strokeWidth="4" />
      <g clipPath={`url(#${u}clip)`}>{draw ? draw({ p, u }) : null}</g>
      <circle cx="200" cy="200" r="200" fill="none" stroke="#fff" strokeWidth="2" opacity=".55" />
    </svg>
  )
}
