// "But is this real?" — plain-language research notes per experience.
// Studies verified against their published abstracts; quotes kept short and exact.

export interface RealNote {
  head: string
  body: string[]
  guess: string
  /** [title, url or null, one-line description] */
  sources: [string, string | null, string][]
}

export const REAL: Record<string, RealNote> = {
 "no-one-home": {
  "head": "Catching a thought in the act changes what your brain is doing.",
  "body": [
   "Left to itself, the mind drifts. When Harvard researchers pinged 2,250 people through an iPhone app at random moments, their minds were somewhere else 46.9% of the time, and they were measurably less happy while it happened. In the authors’ words: “A human mind is a wandering mind, and a wandering mind is an unhappy mind.”",
   "That drifting runs on the default mode network, the brain’s in-house storyteller, anchored in the posterior cingulate and medial prefrontal cortex. A Yale team led by Judson Brewer scanned experienced meditators and found those storytelling hubs quieter than in beginners, and more tightly wired to the regions that notice and steer attention."
  ],
  "guess": "Waiting for the next thought switches on the brain’s monitoring circuits, and they catch the story before it gathers momentum. The narrator becomes the audience. With practice, the brain learns the move.",
  "sources": [
   [
    "Killingsworth & Gilbert (2010), Science",
    "https://www.science.org/doi/10.1126/science.1192439",
    "Experience sampling: 250,000 moments from 2,250 people."
   ],
   [
    "Brewer et al. (2011), PNAS",
    "https://doi.org/10.1073/pnas.1112029108",
    "fMRI: default mode network quieter in experienced meditators."
   ]
  ]
 },
 "the-wall-comes-down": {
  "head": "Listening without labels lets two rival brain systems stop taking turns.",
  "body": [
   "Your brain runs an outward-facing network for the world and an inward-facing one for the self, and normally they work like a see-saw: when one rises, the other falls. At NYU, Zoran Josipovic scanned long-practising meditators and found that during non-dual awareness the see-saw markedly softened. Inside and outside stayed active together instead of competing.",
   "A Toronto study adds a twist anyone can relate to. After eight weeks of mindfulness training, people who simply attended to present sensation shifted activity away from the brain’s “story of me” hub toward body-sensing areas like the insula, and the two stopped automatically moving in lockstep."
  ],
  "guess": "Giving sound your full attention loads up the sensory, experiential mode and starves the narrative one. The wall between the hearer and the heard is held up by that constant toggling. When the toggling eases, the wall comes down.",
  "sources": [
   [
    "Josipovic et al. (2012), Frontiers in Human Neuroscience",
    "https://doi.org/10.3389/fnhum.2011.00183",
    "Non-dual awareness weakens the inward/outward network see-saw."
   ],
   [
    "Farb et al. (2007), Social Cognitive & Affective Neuroscience",
    "https://doi.org/10.1093/scan/nsm030",
    "Mindfulness training separates “narrative” and “experiential” self."
   ]
  ]
 },
 "no-edges": {
  "head": "Your sense of where “you” are is assembled moment by moment, and it can move.",
  "body": [
   "In 2002, surgeons mapping a patient’s brain before epilepsy treatment gently stimulated a spot called the right angular gyrus, near the temporoparietal junction. Each time, she felt herself float up and look down at her own body. The finding, published in Nature, showed that the feeling of being located inside your body is a running calculation built from touch, balance and vision.",
   "Meditation research points the same way. In deep practice, activity drops in the parietal areas that map the body in space, and in one expert meditator, rhythms over the temporoparietal junction tracked exactly how far his sense of boundary had dissolved."
  ],
  "guess": "The border at your skin is drawn by the brain from moment to moment, not given. When attention stops feeding that map with “here I am”, the line softens into the edgeless space that meditators describe.",
  "sources": [
   [
    "Blanke et al. (2002), Nature",
    "https://pubmed.ncbi.nlm.nih.gov/12239558/",
    "Electrical stimulation of the angular gyrus triggers out-of-body experiences."
   ],
   [
    "Dor-Ziderman et al. (2016)",
    null,
    "MEG: beta rhythms over the TPJ track self-boundary dissolution."
   ]
  ]
 },
 "the-eternal-now": {
  "head": "Time is something your body tells your brain, and attention changes the telling.",
  "body": [
   "In a 2013 experiment, people who did a short mindfulness exercise then judged how long pictures stayed on a screen. They consistently overestimated: for them, the present had literally stretched. The more mindfulness experience they had, the slower time felt.",
   "Psychologist Marc Wittmann has spent years tracing why. His work points to the insula, a strip of cortex that gathers heartbeat, breath and gut signals and turns them into the felt passage of time. Tune in to the body and each moment gets thicker and roomier. Experienced meditators feel time change while their ability to keep a beat stays perfectly accurate: the clock is fine, the experience is different."
  ],
  "guess": "“Past” and “future” are simulations the brain’s narrative network runs constantly. When attention rests in raw sensation, those simulations go quiet, and what is left is a wide, vivid now.",
  "sources": [
   [
    "Kramer, Weger & Sharma (2013), Consciousness and Cognition",
    "https://www.researchgate.net/publication/239947008_The_effect_of_mindfulness_meditation_on_time_perception",
    "Mindfulness makes time intervals feel longer."
   ],
   [
    "Linares Gutiérrez et al. (2022), Biology",
    null,
    "Meditation shifts felt time while beat-keeping stays intact."
   ]
  ]
 },
 "more-real-than-real": {
  "head": "Drop the labels and more of the world gets through.",
  "body": [
   "Your brain doesn’t passively record the world. It predicts it, then checks the prediction against your senses. Labels like “cup, white, mine” are predictions, and they are cheap to make, so the brain leans on them and stops looking closely.",
   "In a striking 2007 study, people flashed two images in quick succession usually missed the second one, a gap called the attentional blink. After three months of intensive Vipassana meditation, practitioners caught the second image far more often, because their brains spent fewer resources clinging to the first. Their mental shutter reset faster. Expert meditators also keep a sensory “gate” more open, leaning less on expectation and more on what actually arrives."
  ],
  "guess": "When you stop pasting labels on things, the brain turns down its predictions and turns up the incoming signal. The world doesn’t get brighter. You start receiving more of it.",
  "sources": [
   [
    "Slagter et al. (2007), PLoS Biology",
    "https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.0050138",
    "Three months of Vipassana shrinks the attentional blink."
   ],
   [
    "Carhart-Harris & Friston (2019), Pharmacological Reviews",
    "https://doi.org/10.1124/pr.118.017160",
    "REBUS: relaxing high-level predictions frees bottom-up perception."
   ]
  ]
 },
 "effortless-being": {
  "head": "Effort has a signature in the brain, and so does letting go of it.",
  "body": [
   "At Yale, meditators watched a live graph of their own posterior cingulate cortex while they practised. When the graph dropped, they described their experience as “not efforting” and “contentment”. When it climbed, the words were “controlling” and “efforting”. Letting go isn’t just a feeling. It shows up in the brain.",
   "The body follows. In a randomized trial, just five days of 20-minute integrative body-mind training lowered the stress hormone cortisol and lifted mood more than ordinary relaxation training did. Therapists build on the same shift: mindfulness-based cognitive therapy teaches people to move from “doing mode” to “being mode”, and across nine trials with 1,329 patients it cut the risk of depression returning."
  ],
  "guess": "Much of the background strain of being someone is the brain constantly evaluating and correcting. Stopping, even for a breath, pauses that control loop, and the nervous system reads it as safety.",
  "sources": [
   [
    "Garrison et al. (2013), Frontiers in Human Neuroscience",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3734786/",
    "Real-time fMRI: PCC drops with “effortless awareness”."
   ],
   [
    "Tang et al. (2007), PNAS",
    "https://doi.org/10.1073/pnas.0707678104",
    "Five days of training lowers cortisol and improves attention."
   ],
   [
    "Kuyken et al. (2016), JAMA Psychiatry",
    "https://jamanetwork.com/journals/jamapsychiatry/fullarticle/2517515",
    "MBCT reduces depressive relapse across 9 trials."
   ]
  ]
 },
 "the-ground-of-being": {
  "head": "Resting as awareness isn’t blank. To an EEG, it looks like the brain humming in unison.",
  "body": [
   "In 2004, Richard Davidson’s lab recorded long-term Tibetan practitioners during an “objectless” meditation with no particular thing to focus on. Their brains produced high-amplitude gamma waves, fast rhythms synchronized across distant regions, far beyond what the novices in the study could generate. The difference was there even before they started meditating.",
   "Large consciousness studies point the same way. The 2025 COGITATE collaboration found that sustained integration in the back of the cortex, not a frontal spotlight, tracks what experience is like from the inside."
  ],
  "guess": "Awareness of awareness is the brain’s integrating machinery running without a single object to lock onto: coordination without content, alive, unified and edgeless.",
  "sources": [
   [
    "Lutz et al. (2004), PNAS",
    "https://doi.org/10.1073/pnas.0407401101",
    "Long-term meditators self-induce high-amplitude gamma synchrony."
   ],
   [
    "COGITATE Consortium (2025), Nature",
    null,
    "Posterior cortical integration tracks conscious experience."
   ]
  ]
 },
 "the-click": {
  "head": "The “aha” has a signature, and it arrives before you know the answer.",
  "body": [
   "When people solve a puzzle in a sudden flash, their brains do something distinctive. Mark Jung-Beeman and John Kounios found a burst of fast gamma activity over the right temporal lobe about a third of a second before the answer reaches awareness. Just before that comes a brief burst of alpha over the visual cortex, as the brain closes its eyes for a moment to hear a faint idea forming.",
   "Contemplative insight is a deeper relative of the aha: the brain suddenly pruning its own model of the world, felt as a click of clarity."
  ],
  "guess": "“Like the tumblers are falling” is exactly right. Pieces rearrange quietly, out of sight, until one moment they fit.",
  "sources": [
   [
    "Jung-Beeman et al. (2004), PLoS Biology",
    "https://doi.org/10.1371/journal.pbio.0020097",
    "Neural activity when people solve problems with insight."
   ],
   [
    "Kounios & Beeman (2014), Annual Review of Psychology",
    "https://psychology.northwestern.edu/people/faculty/core/profiles/ann_rvw_psy_2014.pdf",
    "Review: the cognitive neuroscience of insight."
   ],
   [
    "Laukkonen & Slagter (2021), Neurosci. Biobehav. Rev.",
    null,
    "Meditative insight as the brain pruning its model."
   ]
  ]
 }
}
