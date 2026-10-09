// The picture book's words, one complete thought per page.
// It follows the order and teaching of Ken Walkama's "Mindfulness Meditation" booklet:
// what meditation is, how to sit, the practice itself, and carrying it through the day.
// Each page names the illustration (scene) drawn for it in scenes.tsx.

export type ChapterId = 'what' | 'sit' | 'practice' | 'day'

export interface Chapter {
  id: ChapterId
  numeral: string
  title: string
  // the page background, in the same three-colour form the Stop page uses
  bg: [string, string, string]
}

export interface Page {
  chapter: ChapterId
  scene: string
  text: string
  // a chapter's opening page shows its numeral and title above the words
  opens?: boolean
}

export const CHAPTERS: Chapter[] = [
  { id: 'what', numeral: 'I', title: 'What it is', bg: ['#ffd3b6', '#f7b9d7', '#fbf1ea'] },
  { id: 'sit', numeral: 'II', title: 'Sitting', bg: ['#d9c8ff', '#f6c1e6', '#f3eefb'] },
  { id: 'practice', numeral: 'III', title: 'The practice', bg: ['#b8eedf', '#c9d8ff', '#eef7f4'] },
  { id: 'day', numeral: 'IV', title: 'Through the day', bg: ['#ffe2a6', '#ffc9b5', '#fbf5e8'] },
]

export const PAGES: Page[] = [
  // I · What it is
  { chapter: 'what', scene: 'dawn', opens: true, text: 'Meditation is learning to be fully here, awake to what is.' },
  { chapter: 'what', scene: 'lotus-open', text: 'It is simply paying attention. And attention is what opens us to the fullness of each moment.' },
  { chapter: 'what', scene: 'clouds-part', text: 'Nothing new or special gets made. We wake up from our thoughts into life as it already is.' },
  { chapter: 'what', scene: 'big-sky-head', text: 'Two guidelines hold all of it. The first: awareness is larger than thought.' },
  { chapter: 'what', scene: 'three-seeds', text: 'The second: let sights, sounds and sensations be as they are, without adding thought to them.' },
  { chapter: 'what', scene: 'own-light', text: 'When nothing is laid over them, things shine with their own light.' },
  { chapter: 'what', scene: 'passing-clouds', text: 'Thoughts will come. The practice is not stopping thoughts, but not stopping at them.' },
  { chapter: 'what', scene: 'you-are-sky', text: 'Let a thought drift by like a cloud. You are the sky, not the cloud.' },

  // II · Sitting
  { chapter: 'sit', scene: 'tall-spine', opens: true, text: 'Find a seat where your back can rise tall and easy.' },
  { chapter: 'sit', scene: 'chair-or-cushion', text: 'A chair works. So does a firm cushion on the floor, four to six inches high.' },
  { chapter: 'sit', scene: 'mudra', text: 'Rest your hands in your lap, palms up, the left in the right, thumbs lightly touching.' },
  { chapter: 'sit', scene: 'soft-gaze', text: 'Close your eyes, or let them rest half open on the floor about three feet ahead.' },
  { chapter: 'sit', scene: 'settling', text: 'Take a couple of deep breaths and let the body settle.' },
  { chapter: 'sit', scene: 'stillness', text: 'Then stay still. When an itch or an ache calls, turn your attention toward it instead of moving.' },

  // III · The practice
  { chapter: 'practice', scene: 'breath-home', opens: true, text: 'Begin with the breath. It is always with you, always now, and it asks nothing of thought.' },
  { chapter: 'practice', scene: 'belly-wave', text: 'Feel the belly rise and fall as you breathe normally.' },
  { chapter: 'practice', scene: 'breath-fills', text: 'Get close to it. Let the breath fill more and more of your awareness, without comment.' },
  { chapter: 'practice', scene: 'beads', text: 'To steady the mind, count each out-breath from one to ten. Lose count, and start again at one.' },
  { chapter: 'practice', scene: 'return', text: 'Thoughts will arise. Notice each one, and gently bring your attention back to the breath.' },
  { chapter: 'practice', scene: 'waking', text: 'Wandered off for a while? The moment you notice, you are awake again. Come back.' },
  { chapter: 'practice', scene: 'label', text: 'Label it softly: “thinking, thinking.” You meet the thought without pushing it away.' },
  { chapter: 'practice', scene: 'ripples', text: 'Whatever you resist, you feed. Wanting to get rid of a thought is just another thought.' },
  { chapter: 'practice', scene: 'feeling-clouds', text: 'Name feelings the same way: “sadness,” “anger,” rather than “I am sad.”' },
  { chapter: 'practice', scene: 'heart-glow', text: 'When a feeling comes, let the story go and feel it where it lives in the body.' },
  { chapter: 'practice', scene: 'widening', text: 'As the breath steadies, drop the counting. Let sounds and sensations in as well.' },
  { chapter: 'practice', scene: 'choiceless', text: 'Whatever arises is welcomed, and allowed to go. This is choiceless awareness.' },
  { chapter: 'practice', scene: 'enso', text: 'Waking up from thought and coming back, again and again: this is the practice, and every return makes it stronger.' },
  { chapter: 'practice', scene: 'singing-bowl', text: 'Start with five or ten minutes a day and grow toward twenty or thirty. Set a timer and let it keep time.' },
  { chapter: 'practice', scene: 'seven-days', text: 'Sit every day, even for a few minutes. The daily sitting is what changes things.' },

  // IV · Through the day
  { chapter: 'day', scene: 'footprints', opens: true, text: 'Walking is practice too. Feel each foot lift, and each foot land.' },
  { chapter: 'day', scene: 'bowl', text: 'Cooking, eating, cleaning: give your whole attention to whatever you are doing.' },
  { chapter: 'day', scene: 'doorway', text: 'Now and then, wake yourself up. Step out of your thoughts and your role, look around, and breathe.' },
  { chapter: 'day', scene: 'one-foot', text: 'Keep some attention on the breath even while you think. One foot stays in the present.' },
  { chapter: 'day', scene: 'storm-sun', text: 'When you feel rushed or stressed, you are caught in a story. Drop it, and come back to the breath.' },
  { chapter: 'day', scene: 'journey', text: 'You will still get where you are going. You will just be awake for the whole journey.' },
  { chapter: 'day', scene: 'body-scan', text: 'Once a day, settle into the body and move through it, noticing each sensation without judging it.' },
  { chapter: 'day', scene: 'stones', text: 'Once a day, sit with the worries you have been carrying. Give each one room, without fixing it.' },
  { chapter: 'day', scene: 'dishes', text: 'Choose one daily task, like washing dishes or brushing your teeth, and make it your practice.' },
  { chapter: 'day', scene: 'morning', text: 'When you wake, don’t rush to pick up yesterday. Feel your body, your breath, the room around you.' },
  { chapter: 'day', scene: 'circle', text: 'Sitting with others helps. Find a group to practice with.' },
  { chapter: 'day', scene: 'release', text: 'A thought loosens its grip on you when you loosen your grip on it.' },
  { chapter: 'day', scene: 'host', text: 'The thought is in you. You are not in the thought.' },
  { chapter: 'day', scene: 'moon', text: 'This moment is already complete. Lack lives in the thought, not in the present.' },
  { chapter: 'day', scene: 'kindness', text: 'As the stories loosen, the kindness that was there all along comes through.' },
  { chapter: 'day', scene: 'bodhi', text: 'Turn to the present, not to your thoughts, to find your way.' },
]

export const BOOKLET_URL =
  'https://static1.squarespace.com/static/68f3aa038bd4c01410bb0de4/t/693de03cd45a250fa8cab22c/1765662780154/Meditation+Booklet+by+Ken+Walkama.pdf'
