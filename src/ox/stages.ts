// The Ten Ox-Herding Pictures, after the verses of the Chan master Kuo-an Shih-yuan (廓庵師遠, twelfth century).
// The verses are rendered freshly from the Chinese for this book, staying close to each line's images.
// Each stage carries its own palette, so the colours of the page travel from dusk to the bright market.
import type { Pal } from '../sit/scenes'

export interface Stage {
  numeral: string
  title: string
  han: string
  scene: string
  verse: [string, string, string, string]
  // the page background, in the same three-colour form the Stop page uses
  bg: [string, string, string]
  p: Pal
}

const skin = '#ffd9c0'

export const STAGES: Stage[] = [
  {
    numeral: 'I',
    title: 'Searching for the ox',
    han: '尋牛',
    scene: 'search',
    verse: [
      'Pushing through the tall grass, I search and search.',
      'The rivers are wide, the mountains far, the path goes deeper still.',
      'Worn out in body and spirit, I find no trace of it,',
      'only the cicadas singing in the maples at dusk.',
    ],
    bg: ['#ffc9a8', '#e6b6f0', '#f8eee8'],
    p: { sky: ['#5b2f8f', '#ff9a6b'], ground: '#3d1f5e', sun: '#ffe7b0', fig: '#e85d75', fig2: '#a13a5c', skin, cushion: '#e2577e', a1: '#ff5e6c', a2: '#ffb347', a3: '#7fd6e0', ink: '#2a1440', glow: '#fff0d0' },
  },
  {
    numeral: 'II',
    title: 'Seeing the traces',
    han: '見跡',
    scene: 'traces',
    verse: [
      'By the water and under the trees, its tracks are everywhere.',
      'Here in the trampled sweet grass, do you see them?',
      'Even in the deepest heart of the deepest mountains,',
      'how could a nose that points at the sky stay hidden?',
    ],
    bg: ['#bfeed6', '#d6e6ff', '#eff8f1'],
    p: { sky: ['#1f7a6a', '#c6f0b0'], ground: '#155446', sun: '#fff6c0', fig: '#f27a55', fig2: '#b8473a', skin, cushion: '#ff7a59', a1: '#ff8fa3', a2: '#ffd166', a3: '#5cc9a7', ink: '#0e2a36', glow: '#fffbe0' },
  },
  {
    numeral: 'III',
    title: 'Seeing the ox',
    han: '見牛',
    scene: 'glimpse',
    verse: [
      'An oriole on the branch sings, and sings again.',
      'The sun is warm, the wind is mild, the willows green along the bank.',
      'There is nowhere left for it to hide,',
      'yet that great head and those horns, no brush could paint.',
    ],
    bg: ['#cfeaff', '#fff0b8', '#f5f8ee'],
    p: { sky: ['#4fb3e8', '#fff1b0'], ground: '#3f8f4a', sun: '#fffbe0', fig: '#2b3f6b', fig2: '#3b558a', skin, cushion: '#ff6f91', a1: '#ff7eb6', a2: '#ffc93f', a3: '#7be0a0', ink: '#1d2a48', glow: '#fffdf0' },
  },
  {
    numeral: 'IV',
    title: 'Catching the ox',
    han: '得牛',
    scene: 'catch',
    verse: [
      'With every ounce of strength I have taken hold of it.',
      'Its will is fierce, its power hard to break.',
      'One moment it climbs to the high plateau,',
      'the next it vanishes, deep into the mist and cloud.',
    ],
    bg: ['#c8c4f4', '#f0c2e4', '#f1eef9'],
    p: { sky: ['#3a3f8f', '#c9a8e8'], ground: '#2a2a66', sun: '#ffe7b0', fig: '#ffb48a', fig2: '#f08f6a', skin: '#ffe6d2', cushion: '#e04f7a', a1: '#ff7ac2', a2: '#ffd166', a3: '#62e3d6', ink: '#fff0e0', glow: '#fff1c9' },
  },
  {
    numeral: 'V',
    title: 'Taming the ox',
    han: '牧牛',
    scene: 'tame',
    verse: [
      'Whip and rope never leave my side,',
      'for fear it will wander off into the dust.',
      'Tended well, it grows gentle and calm,',
      'and with no tether at all, it follows me.',
    ],
    bg: ['#b8eedf', '#ffe6b0', '#f2f7ef'],
    p: { sky: ['#33a7a0', '#fde6a0'], ground: '#2e7d5b', sun: '#fffbe6', fig: '#5a2e1a', fig2: '#7a3e22', skin, cushion: '#ff7a59', a1: '#ff8a65', a2: '#ffd84d', a3: '#c39bff', ink: '#123a3a', glow: '#fffbe0' },
  },
  {
    numeral: 'VI',
    title: 'Riding the ox home',
    han: '騎牛歸家',
    scene: 'ride',
    verse: [
      'Riding the ox, I wind my slow way home.',
      'Note after note of my flute goes out to the evening clouds.',
      'Each beat, each song, holds more than can be said.',
      'Whoever knows this music has no need of words.',
    ],
    bg: ['#ffc2b0', '#f6b6d8', '#fbefe9'],
    p: { sky: ['#c8457e', '#ffc36b'], ground: '#6b2a5a', sun: '#fff2d6', fig: '#3a1a4a', fig2: '#55285f', skin, cushion: '#e2577e', a1: '#ff5fa2', a2: '#ffd166', a3: '#7ad8ff', ink: '#3a1030', glow: '#fff2d6' },
  },
  {
    numeral: 'VII',
    title: 'The ox forgotten, the self alone',
    han: '忘牛存人',
    scene: 'rest',
    verse: [
      'Riding the ox, I have come home to my mountain.',
      'The ox is gone, and I sit at ease.',
      'The red sun stands high, and still I am dreaming.',
      'Under the thatch, the whip and rope lie idle.',
    ],
    bg: ['#ffd0c0', '#ffe6b8', '#fbf3ea'],
    p: { sky: ['#ff9a8a', '#fff1d6'], ground: '#8a3a2a', sun: '#ff6a55', fig: '#4a2a3a', fig2: '#6a3a4a', skin, cushion: '#e2577e', a1: '#ff6f61', a2: '#ffc94d', a3: '#8fd3c7', ink: '#4a1a1a', glow: '#fff4e0' },
  },
  {
    numeral: 'VIII',
    title: 'Ox and self both forgotten',
    han: '人牛俱忘',
    scene: 'enso',
    verse: [
      'Whip, rope, ox and self: all of it is empty.',
      'The blue sky is so vast no message can cross it.',
      'How could snow last above a red-hot stove?',
      'Only here does one meet the ancient teachers.',
    ],
    bg: ['#efe6ff', '#ffeef4', '#f8f5f2'],
    p: { sky: ['#efe4ff', '#fff3e6'], ground: '#c9b8e8', sun: '#fffaf0', fig: '#2b2730', fig2: '#6a4a8a', skin, cushion: '#ff9ec7', a1: '#ff9ec7', a2: '#ffd98a', a3: '#a8e6ff', ink: '#2b2236', glow: '#fffaf2' },
  },
  {
    numeral: 'IX',
    title: 'Returning to the source',
    han: '返本還源',
    scene: 'source',
    verse: [
      'Coming back to the root, back to the source, took such effort.',
      'Better to have been, from the start, as if blind and deaf.',
      'Inside the hut, I do not look for what is outside.',
      'The river flows by itself; the flowers are red by themselves.',
    ],
    bg: ['#c4e8ff', '#ffd2e0', '#f1f7fa'],
    p: { sky: ['#5fbcf2', '#e8f7ff'], ground: '#2f6f8f', sun: '#fffdf0', fig: '#1d3550', fig2: '#5a2f1f', skin, cushion: '#ff4f7b', a1: '#ff4f7b', a2: '#ffd166', a3: '#6fe0c8', ink: '#123048', glow: '#fffdf0' },
  },
  {
    numeral: 'X',
    title: 'Into the market with open hands',
    han: '入鄽垂手',
    scene: 'market',
    verse: [
      'Bare-chested and barefoot, I come into the market,',
      'smeared with dust and ash, smiling ear to ear.',
      'No secret powers of the immortals are needed:',
      'I simply make the withered trees burst into bloom.',
    ],
    bg: ['#ffe2a6', '#ffc9b5', '#fbf5e8'],
    p: { sky: ['#ff8a3f', '#ffe7a3'], ground: '#b8410f', sun: '#fffbe6', fig: '#6e2a12', fig2: '#86361a', skin: '#ffd9b8', cushion: '#d6336c', a1: '#ff4f7b', a2: '#ffc83a', a3: '#6fcf45', ink: '#5a1f0b', glow: '#fffbe6' },
  },
]

// the cover and the close: a moonlit night
export const NIGHT: Pick<Stage, 'bg' | 'p'> = {
  bg: ['#d9c8ff', '#f6c1e6', '#f3eefb'],
  p: { sky: ['#241e66', '#9a5cc9'], ground: '#1a1650', sun: '#fff6d8', fig: '#ffb48a', fig2: '#f4946f', skin: '#ffe6d2', cushion: '#e04f7a', a1: '#ff7ac2', a2: '#ffd166', a3: '#62e3d6', ink: '#fff0e0', glow: '#fff1c9' },
}
