# BUILD.md — Non-Dual Awareness: An Explorative Site

## The concept (one paragraph)

An interactive, explorative website that lets visitors click through **first-person experiences of non-dual awareness** — described in two voices 800 years apart: modern teacher Angelo DiLullo (Simply Always Awake) and Zen ancestor Dōgen Zenji — and, for each experience, flip to the **neuroscience going on behind the scenes**: which brain networks quiet, which integrate, and which models explain it. The core interaction is a two-sided card: *Inside* (what it feels like, then and now) ↔ *Behind the scenes* (what the science says). The site is educational and experiential, not a sales page and not a medical claim.

## Audience

Curious meditators and spiritually interested skeptics — people like the site's author: meditation practitioners (e.g. IMS/Vipassana background) who want the first-person teachings *and* the peer-reviewed science side by side, without either side being watered down.

## Suggested title

"Unbound: First-Person Awakening Meets Neuroscience" (working title — "Unbound consciousness" is Angelo DiLullo's signature term).

## Site structure

### 1. Hero / entry
- Short framing: "For millennia, contemplatives described a state where the self, time, and space fall away and only vivid, effortless awareness remains. Neuroscience is now finding the fingerprints. Explore both sides."
- Entry button: "Begin the exploration" → drops into the experience cards.
- A persistent global toggle or per-card flip: **Inside** (first-person) / **Behind the scenes** (science).

### 2. The experiences (core section — 8 cards)
Each card = one facet of non-dual awareness. Card front shows the first-person side with **two voice tabs**: "The modern teacher" (Angelo's description, verbatim quotes, a "try it" pointer) and "The ancestor" (Dōgen's parallel passages, always with translator credit). Flipping (or tapping "the science") reveals: plain-language explanation, the key studies, and an honesty note where evidence is thin.

The 8 cards (full copy in `content/experiences.md`):
1. **No one home** — selflessness, the end of the narrator
2. **The wall comes down** — inner/outer non-duality, intimacy with everything
3. **No edges** — spacelessness, boundlessness
4. **The eternal now** — timelessness
5. **More real than real** — vividness, clarity, "suchness"
6. **Effortless being** — non-doing, the end of strain
7. **The ground of being** — undifferentiated aliveness, what remains
8. **The click** — the moment of recognition itself

Navigation: a horizontal journey or a clickable constellation/map. Each card links to 1–2 related cards ("If this resonates, explore…").

### 3. Angelo's map (context section)
- Who Angelo DiLullo is (physician, Simply Always Awake, *Awake: It's Your Turn*).
- His 5-stage map: Awakening → Honeymoon → Contraction → Non-dual perception → Liberation — as an interactive timeline. Each stage: Angelo's description, what practitioners report, pitfalls he names.
- Glossary of his key terms (unbound consciousness, subjectification, me-ing/being, pristine undivided nature, perceptual distortion, transmission). Full copy in `content/angelos-map.md`.

### 4. Practices (experiential section)
Guided pointers visitors can try immediately (3–5 minutes each): the **Stop** pointer, **sound as gateway**, **self-inquiry** ("What is aware before, during, and after a thought?"). Each practice shows "what to notice" (first-person) and "what may be happening neurally" (science). Full copy in `content/practices.md`. Include Angelo's caveat: inquiry is driven by yearning, not technique; "don't try to recreate your awakening."

### 5. The science, straight (reference section)
The seven neuroscience themes in plain language, each with key studies linked: predictive processing & REBUS; brain networks (DMN, central precuneus, salience); EEG/MEG signatures; time perception; space & bodily self; the psychedelic overlap (where the analogy holds and breaks); 2023–2026 findings. Full copy in `content/science.md`.

### 6. Honest limits (trust section)
A short, prominent page: correlation ≠ causation, the hard problem is untouched, small samples of rare practitioners, demand characteristics in neurofeedback studies, the reportability paradox of studying "contentless" states. Full copy in `content/limits.md`. This section is a feature, not a footnote — it's what makes the site credible.

### 7. Sources
Every claim links out. Full bibliography in `SOURCES.md`.

## Interaction & design notes

- **The flip is the product.** The single most important interaction: every experience card toggles between "Inside" and "Behind the scenes" with a satisfying transition. Consider a two-tone design language (e.g. warm/quiet for first-person, cool/precise for science).
- **Progressive depth.** Three reading levels per card: the quote (10 sec), the explanation (2 min), the studies (deep dive). Don't front-load the science.
- **A visual "map."** A simple SVG/canvas diagram: a head silhouette or network diagram where hovering "posterior cingulate," "parietal lobe," "insula," "TPJ" highlights which experiences each region relates to — and vice versa. The `data/site-data.json` file encodes these links.
- **No dark patterns, no guru worship.** No email capture walls, no "achieve enlightenment" promises. Angelo's own warnings (don't compare your experience, beware teachers who want something from you) belong on the site.
- **Accessibility:** full keyboard navigation for card flips; audio versions of quotes would be a strong v2 (the project author already uses TTS).
- **Mobile-first.** Cards stack; the flip becomes a vertical toggle.

## Data model

`data/site-data.json` contains structured content: the 8 experiences (id, title, first_person {description, quotes[]}, science {summary, findings[]}, practice, related[], sources[]), Angelo's stages, glossary terms, and the experience↔brain-region link map. A site builder can render the entire experiences section from this file alone.

## Tech (agnostic — builder's choice)

Static site is fine (Astro/Next.js/11ty or even hand-rolled). No backend needed. All content is in markdown + one JSON file. Fonts: a calm serif for first-person, a clean grotesk for science — the typography should *perform* the two-sides concept.

## Content inventory (this folder)

- `BUILD.md` — this file
- `content/experiences.md` — the 8 experience cards, full copy
- `content/angelos-map.md` — bio, 5 stages, glossary, key quotes
- `content/dogen.md` — Dōgen bio, translator credits, key fascicles, quote bank by card, design suggestion (two voice tabs)
- `content/science.md` — the 7 neuroscience themes, plain language
- `content/practices.md` — try-it pointers with first-person + science notes
- `content/limits.md` — honest limits of the science
- `SOURCES.md` — full bibliography with URLs and reliability notes
- `data/site-data.json` — structured content for the builder

## Guardrails (do not ship without these)

1. Never present Angelo as a neuroscience teacher — he teaches from direct experience; the science is a parallel lens. (He only gestures at compatibility: DMN, quantum field theory, the photon pointer.)
2. Quote marks mean verbatim. Paraphrases are labeled as such. Secondhand transcriptions are flagged.
3. Every "the brain does X" claim carries its study link and, where relevant, its caveat (sample size, correlational, abstract-level read).
4. The limits page is linked from every science panel, not buried.
5. Every Dōgen quote carries its translator — wording varies enormously between translations, and unattributed Dōgen quotes are a known internet swamp.
6. Do not smooth over the Dōgen/Angelo tension on Card 8: Dōgen dissolves the "click" into practice-realization; Angelo describes tumblers falling. The contrast is a feature.
