import { useEffect } from 'react'
import { mountAlive } from './alive'
import { mountStop } from './engine'

// The static shell of concept #5 "Stop". The stage, the research card and the
// river are filled and animated by mountStop(); the living background by mountAlive().
export function StopPage() {
  useEffect(() => {
    const stopEngine = mountStop()
    const stopAlive = mountAlive()
    return () => {
      stopAlive()
      stopEngine()
    }
  }, [])

  return (
    <>
      <div className="bg" id="bg" />
      <div className="grain" />
      <div className="chatter" id="chatter" aria-hidden="true" />

      <div className="top">
        <span className="brand chrome">Unbound</span>
        <span className="chrome" id="where" />
      </div>

      <div className="intro" id="intro">
        <div>
          <h1>Just this.</h1>
          <p>Nothing to fix. Nowhere to get to. Come in whenever you’re ready.</p>
          <button type="button" className="hold" id="hold" aria-label="Press and hold to begin">
            <svg viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="46" opacity=".2" />
              <circle className="prog" id="prog" cx="50" cy="50" r="46" />
            </svg>
            <span className="breath" />
            <span style={{ position: 'relative' }}>Hold</span>
          </button>
        </div>
        <div className="small-print">
          Eight experiences · first-person accounts, an 800-year-old echo, and the neuroscience
        </div>
      </div>

      <main className="stage" id="stage" aria-live="polite" />
      <button type="button" className="edge prev" id="edgePrev" aria-label="Previous">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 4.5 7.5 12 15 19.5" />
        </svg>
      </button>
      <button type="button" className="edge next" id="edgeNext" aria-label="Next">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 4.5 16.5 12 9 19.5" />
        </svg>
      </button>

      <section className="real" id="real" aria-hidden="true">
        <div className="veil" data-close />
        <div className="card" role="dialog" aria-modal="true" aria-labelledby="realTitle" id="realCard" />
      </section>

      <div
        className="river"
        id="river"
        role="slider"
        tabIndex={0}
        aria-label="Where the mind is: Me-ing to Being"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
      >
        <svg id="riverSvg" aria-hidden="true">
          <defs>
            <linearGradient id="rg" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#4b4458" />
              <stop offset=".35" stopColor="#8d7aa6" />
              <stop offset=".62" stopColor="#e3a7b8" />
              <stop offset=".82" stopColor="#f6c66e" />
              <stop offset="1" stopColor="#fff3cf" />
            </linearGradient>
            <linearGradient id="tide" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#4b4458" stopOpacity=".22" />
              <stop offset=".5" stopColor="#e3a7b8" stopOpacity=".22" />
              <stop offset="1" stopColor="#f6c66e" stopOpacity=".32" />
            </linearGradient>
            <linearGradient id="beam" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fff7e0" stopOpacity="0" />
              <stop offset=".5" stopColor="#fff7e0" stopOpacity=".75" />
              <stop offset="1" stopColor="#fff7e0" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="orbg">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".5" stopColor="#fff6dc" />
              <stop offset="1" stopColor="#f6c66e" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="fadeV" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset=".45" stopColor="#fff" stopOpacity="1" />
              <stop offset="1" stopColor="#fff" stopOpacity=".6" />
            </linearGradient>
            <mask id="fadeMask">
              <rect x="0" y="0" width="100%" height="100%" fill="url(#fadeV)" />
            </mask>
            <filter id="soft" x="-20%" y="-200%" width="140%" height="500%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
          </defs>
          <rect id="bandRect" x="0" y="0" width="100%" height="100%" fill="url(#rg)" opacity=".42" mask="url(#fadeMask)" />
          <path id="glow" fill="none" stroke="url(#rg)" strokeWidth="22" opacity=".55" filter="url(#soft)" />
          <path id="wave" fill="none" stroke="url(#rg)" strokeWidth="2.4" />
          <ellipse id="orbHalo" rx="70" ry="34" fill="url(#orbg)" opacity=".55" />
        </svg>

        <div className="me" aria-hidden="true">
          <div className="me-noise" id="meNoise" />
          <div className="me-label">ME-ING</div>
        </div>
        <div className="be" aria-hidden="true">
          <div className="be-air">here &nbsp; &nbsp; this &nbsp; &nbsp; ·</div>
          <div className="be-label">being</div>
        </div>
      </div>
    </>
  )
}
