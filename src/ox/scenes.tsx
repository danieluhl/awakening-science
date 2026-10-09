// The ox-herding plates, drawn in code in the same moon window as "How to sit".
// They borrow that book's sky, suns, rays, clouds and seated figure, and add the herder, the ox,
// the hut, the trees and the river. The ox starts dark and pales as it is tamed, as in the old paintings.
// Movement is slow and lives in CSS classes (sp-* in plates.css, ox-* in ox.css); Reduce Motion keeps every fade.
import type { ReactNode } from 'react'
import { Cloud, Figure, Mountains, Rays, Sky, STARS, Sun, Twinkles, delay, rad } from '../sit/scenes'
import type { Ctx } from '../sit/scenes'

export interface OxCoat {
  fill: string
  shade: string
  light: string
  horn: string
}

export const COATS = {
  dark: { fill: '#2c2036', shade: '#1a1222', light: '#5d4c6b', horn: '#f6e6c6' },
  dappled: { fill: '#6e5866', shade: '#4d3c48', light: '#b29fab', horn: '#fbefd6' },
  white: { fill: '#f6eee8', shade: '#d9c9c6', light: '#fffaf6', horn: '#ffe2a6' },
} satisfies Record<string, OxCoat>

// a point in a figure's own drawing, carried out into the plate (for ropes and the like)
function place(x: number, y: number, s: number, flip: boolean, lean: number, lx: number, ly: number): [number, number] {
  const sx = (flip ? -s : s) * lx
  const sy = s * ly
  const b = rad(lean)
  return [x + sx * Math.cos(b) - sy * Math.sin(b), y + sx * Math.sin(b) + sy * Math.cos(b)]
}

// where the ox's nose ring is, once its head has been tilted
function oxNose(x: number, y: number, s: number, flip: boolean, tilt: number, lean = 0): [number, number] {
  const a = rad(tilt)
  const dx = 150 - 82
  const dy = -62 + 100
  return place(x, y, s, flip, lean, 82 + dx * Math.cos(a) - dy * Math.sin(a), -100 + dx * Math.sin(a) + dy * Math.cos(a))
}

// ---------- the ox ----------

// standing side-on, facing right; origin is the ground beneath its middle
function Ox({ p, x, y, s = 1, flip = false, coat, tilt = 0, lean = 0, cloth = false, lying = false }: Ctx & { x: number; y: number; s?: number; flip?: boolean; coat: OxCoat; tilt?: number; lean?: number; cloth?: boolean; lying?: boolean }) {
  const { fill, shade, light, horn } = coat
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean}) scale(${flip ? -s : s} ${s})`}>
      <g transform={lying ? 'translate(0 40)' : undefined}>
        {!lying && (
          <g fill={shade}>
            <rect x="-66" y="-62" width="14" height="60" rx="7" />
            <rect x="50" y="-62" width="14" height="60" rx="7" />
          </g>
        )}
        <g className="ox-swish" style={{ transformOrigin: '-94px -94px' }}>
          <path d={lying ? 'M-94 -94 C-118 -86 -126 -60 -140 -48' : 'M-94 -94 C-114 -84 -114 -54 -110 -26'} fill="none" stroke={fill} strokeWidth="5" strokeLinecap="round" />
          <path d={lying ? 'M-136 -56 C-150 -54 -156 -42 -150 -36 C-142 -38 -136 -46 -136 -56Z' : 'M-110 -34 C-118 -26 -116 -10 -108 -6 C-102 -12 -102 -26 -110 -34Z'} fill={shade} />
        </g>
        <ellipse cx="-68" cy="-74" rx="30" ry="36" fill={fill} />
        <ellipse cx="64" cy="-88" rx="30" ry="38" fill={fill} />
        <path d="M-96 -66 C-100 -104 -64 -122 -14 -120 C30 -122 62 -130 82 -114 C98 -100 100 -74 90 -58 C70 -44 -50 -42 -84 -48 C-94 -52 -96 -58 -96 -66 Z" fill={fill} />
        <ellipse cx="-4" cy="-56" rx="66" ry="9" fill={light} opacity=".45" />
        <path d="M-82 -106 C-40 -122 30 -120 72 -126" fill="none" stroke={light} strokeWidth="3" strokeLinecap="round" opacity=".45" />
        {cloth && (
          <g>
            <path d="M-42 -117 C-20 -123 20 -124 38 -121 L42 -80 C14 -76 -20 -76 -46 -80 Z" fill={p.a1} />
            <path d="M-34 -112 C-14 -117 16 -118 30 -115 L33 -88 C10 -85 -16 -85 -37 -88 Z" fill={p.a2} />
            <path d="M-24 -106 C-8 -110 10 -110 20 -108 L22 -94 C6 -92 -10 -92 -26 -94 Z" fill={p.a3} />
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx={-42 + i * 10.5} cy={-76} r="2.6" fill={p.glow} />
            ))}
          </g>
        )}
        {lying ? (
          <g fill={fill}>
            <ellipse cx="-52" cy="-42" rx="40" ry="11" />
            <ellipse cx="66" cy="-42" rx="40" ry="11" />
            <ellipse cx="102" cy="-38" rx="8" ry="6" fill={shade} />
          </g>
        ) : (
          <g>
            <rect x="-88" y="-66" width="16" height="64" rx="7" fill={fill} />
            <rect x="62" y="-66" width="15" height="64" rx="7" fill={fill} />
            <g fill={shade}>
              <rect x="-88" y="-9" width="16" height="9" rx="3" />
              <rect x="62" y="-9" width="15" height="9" rx="3" />
              <rect x="-66" y="-9" width="14" height="9" rx="3" />
              <rect x="50" y="-9" width="14" height="9" rx="3" />
            </g>
          </g>
        )}
        <g transform={`rotate(${tilt} 82 -100)`}>
          <path d="M96 -116 C88 -136 98 -150 114 -152 C104 -144 102 -130 106 -114 Z" fill={horn} opacity=".75" />
          <path d="M78 -112 C100 -128 126 -114 136 -96 L152 -70 C156 -60 148 -52 138 -55 L112 -64 C96 -70 84 -84 76 -96 Z" fill={fill} />
          <ellipse cx="100" cy="-106" rx="13" ry="6" transform="rotate(-24 100 -106)" fill={shade} />
          <path d="M112 -114 C106 -136 120 -152 140 -148 C126 -142 120 -130 122 -112 Z" fill={horn} />
          <ellipse cx="143" cy="-63" rx="11" ry="9" fill={light} />
          <circle cx="148" cy="-64" r="1.8" fill={shade} />
          <circle cx="121" cy="-94" r="3.2" fill="#1d1428" />
          <circle cx="122" cy="-95" r="1" fill="#fff" opacity=".85" />
        </g>
      </g>
    </g>
  )
}

// ---------- the herder ----------

type Pose = 'search' | 'bend' | 'pull' | 'lead' | 'point'

const ARMS: Record<Pose, { back: string; front: string; hands: [number, number][] }> = {
  search: { back: 'M-12 -116 Q-28 -98 -30 -84', front: 'M12 -118 Q36 -124 24 -142', hands: [[-30, -84], [23, -143]] },
  bend: { back: 'M-8 -116 Q6 -96 16 -82', front: 'M12 -116 Q24 -96 30 -80', hands: [[16, -82], [30, -80]] },
  pull: { back: 'M-10 -114 L36 -98', front: 'M12 -116 L46 -104', hands: [[37, -98], [47, -104]] },
  lead: { back: 'M-12 -116 Q-30 -100 -46 -92', front: 'M12 -116 Q22 -96 22 -78', hands: [[-46, -92], [22, -78]] },
  point: { back: 'M-12 -116 Q-22 -96 -18 -76', front: 'M12 -118 L38 -132 L52 -138', hands: [[-18, -76], [53, -138]] },
}

// standing in a wide straw hat; origin is between the feet, facing right
function Herder({ p, x, y, s = 1, flip = false, pose, lean = 0, staff = false, whip = false }: Ctx & { x: number; y: number; s?: number; flip?: boolean; pose: Pose; lean?: number; staff?: boolean; whip?: boolean }) {
  const arms = ARMS[pose]
  const stride = pose === 'search' || pose === 'lead'
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean}) scale(${flip ? -s : s} ${s})`}>
      {staff && <line x1="-33" y1="-160" x2="-26" y2="0" stroke={p.fig2} strokeWidth="5" strokeLinecap="round" />}
      {stride ? (
        <g fill={p.fig2}>
          <rect x="-17" y="-50" width="14" height="52" rx="7" transform="rotate(14 -10 -50)" />
          <rect x="3" y="-50" width="14" height="52" rx="7" transform="rotate(-12 10 -50)" />
        </g>
      ) : (
        <g fill={p.fig2}>
          <rect x="-17" y="-50" width="14" height="52" rx="7" />
          <rect x="3" y="-50" width="14" height="52" rx="7" />
        </g>
      )}
      <g transform={pose === 'bend' ? 'rotate(26 0 -46)' : undefined}>
        <path d={arms.back} fill="none" stroke={p.fig2} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M-18 -124 Q0 -131 18 -124 L28 -42 Q0 -34 -28 -42 Z" fill={p.fig} />
        <rect x="-24" y="-80" width="48" height="8" rx="4" fill={p.a1} />
        <circle cx="0" cy="-138" r="14" fill={p.skin} />
        <path d="M-27 -151 Q0 -180 27 -151 Z" fill={p.a2} />
        <ellipse cx="0" cy="-150" rx="36" ry="6" fill={p.a2} />
        <path d="M-14 -158 Q0 -163 14 -158" fill="none" stroke={p.a1} strokeWidth="3" strokeLinecap="round" />
        <path d={arms.front} fill="none" stroke={p.fig2} strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        {arms.hands.map(([hx, hy], i) => (
          <circle key={i} cx={hx} cy={hy} r="5" fill={p.skin} />
        ))}
        {whip && <path d="M22 -78 Q40 -110 30 -142" fill="none" stroke={p.fig2} strokeWidth="3" strokeLinecap="round" />}
      </g>
    </g>
  )
}

// a herder's hand, carried out into the plate
function hand(pose: Pose, i: number, x: number, y: number, s: number, flip = false, lean = 0) {
  const [hx, hy] = ARMS[pose].hands[i]
  return place(x, y, s, flip, lean, hx, hy)
}

// sitting on the ox's back, playing a flute; origin is the seat
function Rider({ p, x, y, s = 1 }: Ctx & { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-8 -44 Q8 -36 16 -58" fill="none" stroke={p.fig2} strokeWidth="9" strokeLinecap="round" />
      <path d="M-16 -50 Q0 -56 16 -50 L22 -2 Q0 4 -22 -2 Z" fill={p.fig} />
      <rect x="-20" y="-24" width="41" height="7" rx="3.5" fill={p.a1} />
      <path d="M4 -6 Q16 14 12 34" fill="none" stroke={p.fig2} strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="16" cy="37" rx="8" ry="4.5" fill={p.skin} />
      <circle cx="0" cy="-64" r="13" fill={p.skin} />
      <path d="M-24 -75 Q0 -100 24 -75 Z" fill={p.a2} />
      <ellipse cx="0" cy="-74" rx="31" ry="5" fill={p.a2} />
      <line x1="6" y1="-60" x2="48" y2="-50" stroke={p.glow} strokeWidth="4" strokeLinecap="round" />
      {[30, 37, 44].map((hx) => (
        <circle key={hx} cx={hx} cy={-55 + (hx - 30) * 0.24} r="1.2" fill={p.fig2} />
      ))}
      <path d="M10 -44 Q22 -48 30 -55" fill="none" stroke={p.fig2} strokeWidth="9" strokeLinecap="round" />
      <circle cx="31" cy="-55" r="4" fill={p.skin} />
      <circle cx="16" cy="-58" r="4" fill={p.skin} />
    </g>
  )
}

// the laughing wanderer of the last picture: big belly, bare feet, a sack on his staff
function Wanderer({ p, x, y, s = 1 }: Ctx & { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1="34" y1="-70" x2="-62" y2="-150" stroke={p.fig2} strokeWidth="5" strokeLinecap="round" />
      <circle cx="-60" cy="-120" r="32" fill={p.a2} />
      <path d="M-60 -152 L-66 -140 L-54 -140 Z" fill={p.a2} />
      <path d="M-82 -130 Q-60 -110 -38 -130" fill="none" stroke={p.glow} strokeWidth="2.5" opacity=".6" />
      <g fill={p.fig2}>
        <rect x="-22" y="-30" width="15" height="30" rx="7" />
        <rect x="7" y="-30" width="15" height="30" rx="7" />
      </g>
      <ellipse cx="-16" cy="0" rx="11" ry="4.5" fill={p.skin} />
      <ellipse cx="16" cy="0" rx="11" ry="4.5" fill={p.skin} />
      <ellipse cx="0" cy="-64" rx="46" ry="42" fill={p.fig} />
      <ellipse cx="4" cy="-60" rx="26" ry="31" fill={p.skin} />
      <path d="M-22 -96 Q-30 -60 -14 -28 M30 -96 Q40 -60 22 -28" fill="none" stroke={p.a1} strokeWidth="4" strokeLinecap="round" />
      <path d="M2 -52 q3 3 6 0" fill="none" stroke={p.fig2} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M-34 -84 Q-52 -70 -60 -52" fill="none" stroke={p.fig} strokeWidth="11" strokeLinecap="round" />
      <circle cx="-61" cy="-50" r="6" fill={p.skin} />
      <path d="M30 -88 Q44 -80 36 -70" fill="none" stroke={p.fig} strokeWidth="11" strokeLinecap="round" />
      <circle cx="34" cy="-70" r="6" fill={p.skin} />
      <circle cx="0" cy="-122" r="21" fill={p.skin} />
      <ellipse cx="-20" cy="-118" rx="4" ry="7" fill={p.skin} />
      <ellipse cx="20" cy="-118" rx="4" ry="7" fill={p.skin} />
      <g fill="none" stroke={p.fig2} strokeWidth="1.8" strokeLinecap="round">
        <path d="M-10 -126 q4 -3 8 0" />
        <path d="M2 -126 q4 -3 8 0" />
        <path d="M-9 -114 Q0 -104 9 -114" strokeWidth="2.2" />
      </g>
      <circle cx="-12" cy="-116" r="3.5" fill={p.a1} opacity=".35" />
      <circle cx="12" cy="-116" r="3.5" fill={p.a1} opacity=".35" />
    </g>
  )
}

// ---------- the world around them ----------

const BARK = '#5a3426'

function Hut({ p, x, y, s = 1 }: Ctx & { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-50" y="-62" width="100" height="62" fill="#c98a5a" />
      <rect x="-50" y="-62" width="100" height="62" fill={p.a1} opacity=".18" />
      <rect x="-30" y="-44" width="22" height="44" rx="2" fill={p.fig2} opacity=".85" />
      <circle cx="24" cy="-32" r="11" fill={p.glow} className="sp-glow" />
      <circle cx="24" cy="-32" r="11" fill="none" stroke="#8a5534" strokeWidth="2.5" />
      <path d="M-72 -56 L0 -116 L72 -56 Z" fill="#e8b866" />
      <g stroke="#b9853c" strokeWidth="2" opacity=".7">
        {[-48, -24, 0, 24, 48].map((dx) => (
          <line key={dx} x1={dx * 0.4} y1={-104 + Math.abs(dx) * 0.16} x2={dx * 1.3} y2={-58} />
        ))}
      </g>
      <path d="M-74 -56 H74" stroke="#b9853c" strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

function star(cx: number, cy: number, r: number, n = 5, k = 0.48, rot = -90) {
  let d = ''
  for (let i = 0; i < n * 2; i++) {
    const a = rad(rot + (i * 180) / n)
    const rr = i % 2 ? r * k : r
    d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`
  }
  return `${d}Z`
}

function Maple({ p, x, y, s = 1 }: Ctx & { x: number; y: number; s?: number }) {
  const leaves: [number, number, number][] = []
  for (let i = 0; i < 34; i++) {
    const a = rad(-180 + ((i * 137.5) % 180))
    const r = 26 + ((i * 29) % 58)
    leaves.push([Math.cos(a) * r * 1.2, -150 + Math.sin(a) * r * 0.8, i])
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-8 0 C-6 -50 -12 -90 -4 -130 L6 -130 C10 -90 8 -50 10 0 Z" fill={BARK} />
      <path d="M0 -100 Q-30 -120 -50 -150 M2 -116 Q34 -130 54 -160" fill="none" stroke={BARK} strokeWidth="6" strokeLinecap="round" />
      {leaves.map(([lx, ly, i]) => (
        <path key={i} d={star(lx, ly, 13 + (i % 3) * 3)} fill={[p.a1, p.a2, '#ff7a3d', p.cushion][i % 4]} opacity=".92" />
      ))}
    </g>
  )
}

function Willow({ p, x, y, s = 1 }: Ctx & { x: number; y: number; s?: number }) {
  const strands = Array.from({ length: 19 }, (_, i) => -130 + i * 14.5)
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-9 0 C-4 -50 -18 -110 -2 -196 L7 -196 C2 -110 14 -50 12 0 Z" fill={BARK} />
      <path d="M0 -150 Q-40 -170 -80 -190 M2 -120 Q30 -150 70 -170" fill="none" stroke={BARK} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="-10" cy="-204" rx="130" ry="40" fill={p.a3} opacity=".6" />
      <ellipse cx="-30" cy="-214" rx="70" ry="22" fill={p.glow} opacity=".18" />
      <g fill="none" strokeWidth="5" strokeLinecap="round">
        {strands.map((dx, i) => (
          <path key={dx} d={`M${dx * 0.6} -206 Q${dx} -160 ${dx * 1.05} ${-50 - (i % 5) * 20}`} stroke={i % 3 ? p.a3 : '#3fae5a'} opacity={i % 2 ? 0.95 : 0.75} />
        ))}
      </g>
      <g fill="#3fae5a" opacity=".75">
        {strands.map((dx, i) => (
          <ellipse key={dx} cx={dx * 1.05} cy={-54 - (i % 5) * 20} rx="4" ry="9" />
        ))}
      </g>
    </g>
  )
}

function Oriole({ p, x, y, s = 1 }: Ctx & { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-10 0 L-26 8 L-22 -2 Z" fill={p.fig2} />
      <ellipse cx="0" cy="0" rx="13" ry="9" fill="#ffd23f" />
      <circle cx="11" cy="-6" r="7.5" fill="#ffd23f" />
      <path d="M17 -7 L25 -5 L17 -3 Z" fill="#ff8a3d" />
      <path d="M6 -8 L16 -6" stroke="#2b1a20" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M-6 -2 Q0 4 8 0" fill="none" stroke="#2b1a20" strokeWidth="2" opacity=".5" />
    </g>
  )
}

function Grass({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <path d="M0 0 Q-4 -20 -12 -34 M0 0 Q1 -24 2 -42 M0 0 Q6 -18 14 -30" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" transform={`translate(${x} ${y}) scale(${s})`} />
  )
}

function Hoof({ x, y, s = 1, color }: { x: number; y: number; s?: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
      <path d="M-1.5 -9 C-9 -9 -9 6 -3 9 C-1 6 -1.5 -2 -1.5 -9Z" />
      <path d="M1.5 -9 C9 -9 9 6 3 9 C1 6 1.5 -2 1.5 -9Z" />
    </g>
  )
}

function Blossom({ x, y, r = 8, color, core, cls, d }: { x: number; y: number; r?: number; color: string; core: string; cls?: string; d?: number }) {
  return (
    <g className={cls} style={d !== undefined ? delay(d) : undefined}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={x + Math.cos(rad(a - 90)) * r * 0.62} cy={y + Math.sin(rad(a - 90)) * r * 0.62} r={r * 0.58} fill={color} />
      ))}
      <circle cx={x} cy={y} r={r * 0.32} fill={core} />
    </g>
  )
}

function River({ p, y, color }: Ctx & { y: number; color?: string }) {
  return (
    <g>
      <path d={`M-10 ${y} Q100 ${y - 14} 200 ${y} T410 ${y - 4} V410 H-10Z`} fill={color ?? p.a3} opacity=".85" />
      <g fill="none" stroke={p.glow} strokeWidth="2.6" strokeLinecap="round" strokeDasharray="14 12" opacity=".7">
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M-10 ${y + 14 + i * 16} Q100 ${y + 4 + i * 16} 200 ${y + 14 + i * 16} T410 ${y + 10 + i * 16}`} className="sp-flow" style={{ animationDuration: `${4 + i}s` }} />
        ))}
      </g>
    </g>
  )
}

// a song drifting up and away
function Notes({ p, x, y }: Ctx & { x: number; y: number }) {
  return (
    <g fill={p.glow}>
      {[0, 1, 2, 3].map((i) => (
        <g key={i} className="sp-rise" style={delay(i * 3.4)}>
          <g transform={`translate(${x + i * 16 - (i % 2) * 22} ${y - i * 8})`}>
            <ellipse cx="0" cy="0" rx="5" ry="3.8" transform="rotate(-20)" />
            <rect x="3.4" y="-18" width="1.8" height="18" />
            {i % 2 === 0 && <path d="M5 -18 Q12 -14 10 -6" fill="none" stroke={p.glow} strokeWidth="1.8" />}
          </g>
        </g>
      ))}
    </g>
  )
}

function Rope({ from, to, sag = 0, color, taut = false }: { from: [number, number]; to: [number, number]; sag?: number; color: string; taut?: boolean }) {
  const mx = (from[0] + to[0]) / 2
  const my = (from[1] + to[1]) / 2 + sag
  return <path d={`M${from[0]} ${from[1]} Q${mx} ${my} ${to[0]} ${to[1]}`} fill="none" stroke={color} strokeWidth={taut ? 3.4 : 3} strokeLinecap="round" />
}

// ---------- the plates ----------

export const OX_SCENES: Record<string, (c: Ctx) => ReactNode> = {
  // the herder rides home under a full moon
  cover: (c) => {
    const ox = { x: 196, y: 330, s: 0.82 }
    return (
      <>
        <Sky {...c} />
        <Twinkles p={c.p} pts={STARS} />
        <Rays cx={200} cy={160} n={40} r0={60} color={c.p.glow} op={0.16} />
        <Sun {...c} cx={200} cy={160} r={78} />
        <Mountains {...c} y={300} />
        <Ox {...c} {...ox} coat={COATS.white} tilt={-6} cloth />
        <Rider {...c} x={ox.x - 8 * ox.s} y={ox.y - 118 * ox.s} s={ox.s} />
        <Notes {...c} x={252} y={196} />
      </>
    )
  },

  // 1 · searching: tall grass, far mountains, a maple at dusk
  search: (c) => (
    <>
      <Sky {...c} />
      <Sun {...c} cx={290} cy={240} r={34} />
      <Mountains {...c} y={286} />
      <River {...c} y={330} />
      <Maple {...c} x={92} y={318} s={0.95} />
      <path d="M-10 312 Q120 296 240 314 T410 306 V336 Q300 324 200 336 T-10 330Z" fill={c.p.ground} />
      <Herder {...c} x={236} y={318} s={0.7} pose="search" staff />
      {[[24, 330], [60, 322], [150, 326], [184, 320], [282, 322], [330, 316], [372, 322]].map(([x, y], i) => (
        <Grass key={i} x={x} y={y} s={0.9 + (i % 3) * 0.2} color={[c.p.a2, c.p.a1, c.p.a3][i % 3]} />
      ))}
      <Twinkles p={c.p} pts={[[70, 120], [120, 96], [40, 170], [150, 150]]} r={2} />
    </>
  ),

  // 2 · traces: hoofprints by the water, under the trees
  traces: (c) => {
    const prints: [number, number, number][] = [[300, 380, 2.2], [250, 352, 1.9], [212, 328, 1.65], [180, 308, 1.45], [154, 292, 1.25], [132, 280, 1.1]]
    return (
      <>
        <Sky {...c} />
        <Rays cx={200} cy={110} n={30} r0={40} color={c.p.glow} op={0.2} />
        <Sun {...c} cx={200} cy={110} r={30} />
        {[[40, 230, 70], [120, 210, 56], [330, 220, 72], [390, 250, 50]].map(([x, y, r], i) => (
          <g key={i}>
            <rect x={x - 6} y={y} width="12" height="90" rx="5" fill={BARK} />
            <circle cx={x} cy={y} r={r} fill={[c.p.a3, '#3fae5a', c.p.a3, '#3fae5a'][i]} opacity=".75" />
            <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.45} fill={c.p.glow} opacity=".18" />
          </g>
        ))}
        <path d="M-10 270 Q140 252 260 270 T410 262 V410 H-10Z" fill={c.p.ground} />
        <path d="M-10 320 Q60 300 120 318 Q160 330 120 360 Q80 390 -10 380Z" fill={c.p.a3} opacity=".7" />
        <path d="M10 334 Q60 318 100 334" fill="none" stroke={c.p.glow} strokeWidth="2.4" strokeDasharray="12 10" className="sp-flow" opacity=".7" />
        {prints.map(([x, y, s], i) => (
          <g key={i} className="sp-step" style={delay(i * 1.1)}>
            <Hoof x={x} y={y} s={s} color={c.p.a2} />
          </g>
        ))}
        <Herder {...c} x={300} y={300} s={0.66} flip pose="bend" staff />
        {[[150, 300], [356, 330], [210, 380]].map(([x, y], i) => (
          <Grass key={i} x={x} y={y} color={[c.p.a1, c.p.a2, c.p.a3][i]} />
        ))}
      </>
    )
  },

  // 3 · seeing the ox: an oriole sings; the ox's hindquarters show past the willow
  glimpse: (c) => (
    <>
      <Sky {...c} />
      <Rays cx={110} cy={110} n={30} r0={30} color={c.p.glow} op={0.24} />
      <Sun {...c} cx={110} cy={110} r={30} />
      <path d="M-10 300 Q120 284 240 302 T410 296 V410 H-10Z" fill={c.p.ground} />
      <Ox {...c} x={290} y={322} s={0.66} coat={COATS.dark} tilt={18} />
      <Willow {...c} x={366} y={330} s={1.05} />
      <Oriole {...c} x={262} y={124} s={1.1} />
      <g fill="none" stroke={c.p.glow} strokeWidth="2.4" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${242 - i * 9} ${110 - i * 6} q-6 -8 -2 -16`} className="sp-ring" style={delay(i * 0.9)} />
        ))}
      </g>
      <Herder {...c} x={112} y={334} s={0.7} pose="point" />
      {[[40, 340], [180, 320], [230, 360], [70, 380]].map(([x, y], i) => (
        <Grass key={i} x={x} y={y} color={[c.p.a1, c.p.a2, c.p.a3][i % 3]} />
      ))}
    </>
  ),

  // 4 · catching the ox: the rope goes taut, the mist rolls in
  catch: (c) => {
    const ox = { x: 270, y: 314, s: 0.66, flip: true, tilt: -24, lean: 6 }
    const h = { x: 92, y: 320, s: 0.7, lean: -16 }
    return (
      <>
        <Sky {...c} />
        <Twinkles p={c.p} pts={STARS.slice(0, 8)} />
        <Cloud x={70} y={110} s={1.1} drift="r" dur={30} op={0.55} />
        <Cloud x={330} y={80} s={0.9} drift="l" dur={34} op={0.5} />
        <path d="M-10 300 L120 250 L250 268 L410 236 V410 H-10Z" fill={c.p.a1} opacity=".35" />
        <path d="M-10 314 Q120 300 220 316 T410 306 V410 H-10Z" fill={c.p.ground} />
        <Ox {...c} {...ox} coat={COATS.dark} />
        <Rope from={hand('pull', 1, h.x, h.y, h.s, false, h.lean)} to={oxNose(ox.x, ox.y, ox.s, ox.flip, ox.tilt, ox.lean)} sag={4} color={c.p.a2} taut />
        <Herder {...c} {...h} pose="pull" />
        <Cloud x={340} y={300} s={1.2} drift="l" dur={26} op={0.6} />
        <Cloud x={40} y={330} s={1} drift="r" dur={30} op={0.55} />
      </>
    )
  },

  // 5 · taming: the herder walks ahead, the rope hangs slack
  tame: (c) => {
    const ox = { x: 128, y: 324, s: 0.6, tilt: 14 }
    const h = { x: 322, y: 326, s: 0.66 }
    return (
      <>
        <Sky {...c} />
        <Rays cx={200} cy={130} n={32} r0={40} color={c.p.glow} op={0.22} />
        <Sun {...c} cx={200} cy={130} r={36} />
        <path d="M-10 290 Q100 270 200 284 T410 280 V410 H-10Z" fill={c.p.a3} opacity=".4" />
        <path d="M-10 312 Q120 298 230 314 T410 306 V410 H-10Z" fill={c.p.ground} />
        <path d="M-10 360 Q150 330 410 350" fill="none" stroke={c.p.a2} strokeWidth="26" opacity=".25" strokeLinecap="round" />
        <Ox {...c} {...ox} coat={COATS.dappled} />
        <Rope from={oxNose(ox.x, ox.y, ox.s, false, ox.tilt)} to={hand('lead', 0, h.x, h.y, h.s)} sag={42} color={c.p.a1} />
        <Herder {...c} {...h} pose="lead" whip />
        {[[30, 340], [210, 330], [380, 340], [260, 380]].map(([x, y], i) => (
          <g key={i}>
            <Grass x={x} y={y} color={[c.p.a1, c.p.a2][i % 2]} />
            <circle cx={x + 6} cy={y - 34} r="5" fill={[c.p.a1, c.p.a2][i % 2]} />
          </g>
        ))}
      </>
    )
  },

  // 6 · riding home, playing the flute into the evening clouds
  ride: (c) => {
    const ox = { x: 186, y: 330, s: 0.78 }
    return (
      <>
        <Sky {...c} />
        <Rays cx={300} cy={250} n={36} r0={50} color={c.p.glow} op={0.24} />
        <Sun {...c} cx={300} cy={250} r={44} />
        <Cloud x={90} y={120} s={0.9} drift="r" dur={32} fill={c.p.glow} op={0.6} />
        <Cloud x={310} y={90} s={0.7} drift="l" dur={28} fill={c.p.a2} op={0.55} />
        <path d="M-10 296 Q90 276 180 290 T410 270 V410 H-10Z" fill={c.p.a1} opacity=".4" />
        <Hut {...c} x={352} y={290} s={0.36} />
        <path d="M-10 322 Q120 306 230 322 T410 314 V410 H-10Z" fill={c.p.ground} />
        <Ox {...c} {...ox} coat={COATS.white} tilt={6} cloth />
        <Rider {...c} x={ox.x - 8 * ox.s} y={ox.y - 118 * ox.s} s={ox.s} />
        <Notes {...c} x={238} y={186} />
      </>
    )
  },

  // 7 · the ox forgotten: home on the mountain, the red sun high, the rope lying idle
  rest: (c) => (
    <>
      <Sky {...c} />
      <Rays cx={300} cy={92} n={36} r0={36} color={c.p.a2} op={0.26} />
      <Sun {...c} cx={300} cy={92} r={34} />
      <Mountains {...c} y={290} />
      <path d="M-10 324 Q120 306 240 322 T410 316 V410 H-10Z" fill={c.p.ground} />
      <Hut {...c} x={262} y={326} s={0.92} />
      <Figure {...c} x={110} y={330} s={0.4} halo />
      <g fill="none" stroke={c.p.a2} strokeWidth="3">
        <ellipse cx="340" cy="340" rx="20" ry="7" />
        <ellipse cx="340" cy="336" rx="15" ry="5" />
      </g>
      <line x1="316" y1="340" x2="330" y2="282" stroke={c.p.fig2} strokeWidth="3.4" strokeLinecap="round" />
      <Twinkles p={c.p} pts={[[60, 120], [100, 80], [150, 130], [40, 200]]} r={2.2} />
    </>
  ),

  // 8 · ox and self both forgotten: only the circle
  enso: (c) => (
    <>
      <defs>
        <filter id={`${c.u}brush`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".022 .06" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="5" />
        </filter>
        <radialGradient id={`${c.u}wash`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor={c.p.a2} stopOpacity=".5" />
          <stop offset=".6" stopColor={c.p.a1} stopOpacity=".18" />
          <stop offset="1" stopColor={c.p.a3} stopOpacity="0" />
        </radialGradient>
      </defs>
      <Sky {...c} />
      <circle cx="200" cy="200" r="150" fill={`url(#${c.u}wash)`} className="sp-glow" />
      <g filter={`url(#${c.u}brush)`}>
        <path d="M264 98 A120 120 0 1 0 316 171" fill="none" stroke={c.p.ink} strokeWidth="28" strokeLinecap="round" pathLength={100} className="sp-draw" />
        <path d="M264 98 A120 120 0 1 0 316 171" fill="none" stroke={c.p.fig2} strokeWidth="9" strokeLinecap="round" opacity=".55" transform="translate(5 4)" pathLength={100} className="sp-draw" />
      </g>
    </>
  ),

  // 9 · back to the source: the river goes its way, the flowers are red
  source: (c) => {
    const twigs: [number, number, number][] = [[64, 96, 11], [94, 128, 9], [122, 92, 12], [150, 132, 8], [176, 104, 10], [46, 150, 9], [206, 140, 7], [104, 64, 8]]
    return (
      <>
        <Sky {...c} />
        <Rays cx={300} cy={130} n={30} r0={30} color={c.p.glow} op={0.24} />
        <Sun {...c} cx={300} cy={130} r={30} />
        <Mountains {...c} y={268} />
        <Hut {...c} x={330} y={276} s={0.4} />
        <River {...c} y={282} color={c.p.ground} />
        <path d="M-20 60 Q60 80 110 110 Q160 140 220 140 M60 78 Q90 60 110 50 M110 110 Q140 90 170 96 M30 70 Q40 110 40 150" fill="none" stroke={c.p.fig2} strokeWidth="6" strokeLinecap="round" />
        {twigs.map(([x, y, r], i) => (
          <Blossom key={i} x={x} y={y} r={r} color={c.p.a1} core={c.p.a2} />
        ))}
        {[[140, 220], [240, 250], [80, 250]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill={c.p.a1} className="sp-rise" style={{ ...delay(i * 4), animationDuration: '16s' }} />
        ))}
      </>
    )
  },

  // 10 · into the market with open hands: the dead tree blooms
  market: (c) => (
    <>
      <Sky {...c} />
      <Rays cx={200} cy={180} n={40} r0={50} color={c.p.glow} op={0.24} />
      <path d="M-10 70 Q100 110 200 86 T410 80" fill="none" stroke={c.p.fig2} strokeWidth="2" opacity=".6" />
      {[30, 80, 130, 180, 230, 280, 330, 380].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={84 + Math.sin(i * 1.3) * 12 + 14} rx="10" ry="13" fill={[c.p.a1, c.p.a2, c.p.cushion, c.p.a3][i % 4]} className="sp-tw" style={{ ...delay(i * 0.6), animationDuration: '6s' }} />
        </g>
      ))}
      {[[-10, 160, c.p.a1], [130, 150, c.p.a2], [270, 160, c.p.a3]].map(([x, w, col], i) => (
        <g key={i} opacity=".55">
          <rect x={(x as number) + 12} y="236" width={(w as number) - 24} height="80" fill={c.p.fig2} opacity=".4" />
          <path d={`M${x} 236 L${(x as number) + 20} 206 H${(x as number) + (w as number) - 20} L${(x as number) + (w as number)} 236 Z`} fill={col as string} />
          {Array.from({ length: 6 }, (_, k) => (
            <circle key={k} cx={(x as number) + 12 + k * (((w as number) - 24) / 5)} cy="238" r="9" fill={col as string} />
          ))}
        </g>
      ))}
      <path d="M-10 312 Q120 298 230 314 T410 306 V410 H-10Z" fill={c.p.ground} />
      <g>
        <path d="M316 318 C314 270 322 230 306 190 M312 240 C340 220 352 200 360 172 M308 214 C284 196 268 178 262 150 M318 268 C338 260 356 250 372 236" fill="none" stroke="#5a2f1f" strokeWidth="8" strokeLinecap="round" />
        {[[306, 186], [360, 168], [262, 146], [372, 232], [338, 210], [280, 176], [352, 192], [296, 206], [326, 248]].map(([x, y], i) => (
          <Blossom key={i} x={x} y={y} r={11} color={['#ffc2d9', c.p.glow, '#ff9ec7'][i % 3]} core={c.p.a1} cls="ox-bloom" d={1.2 + i * 0.45} />
        ))}
      </g>
      <circle cx="150" cy="226" r="96" fill={c.p.glow} fillOpacity=".22" className="sp-glow" />
      <Wanderer {...c} x={150} y={330} s={0.92} />
    </>
  ),

  // the close: the ox lies down, the herder sits, the moon is full
  end: (c) => (
    <>
      <Sky {...c} />
      <Twinkles p={c.p} pts={STARS} />
      <g className="sp-glow">
        {[120, 94, 70].map((r, i) => (
          <circle key={r} cx="200" cy="150" r={r} fill={[c.p.a3, c.p.a1, c.p.a2][i]} opacity={0.18 + i * 0.08} />
        ))}
      </g>
      <circle cx="200" cy="150" r="52" fill={c.p.sun} />
      <path d="M-10 316 Q120 300 230 316 T410 308 V410 H-10Z" fill={c.p.ground} />
      <Ox {...c} x={248} y={330} s={0.6} coat={COATS.white} tilt={8} lying />
      <Figure {...c} x={110} y={334} s={0.38} halo spot="heart" />
    </>
  ),
}
