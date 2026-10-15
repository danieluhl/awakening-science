import notFoundCss from './notfound.css?url'

// Wherever a path leads nowhere: the same drifting colour and soft glass as the front door, and a quiet way back.
export function NotFound() {
  return (
    <div className="nf">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;1,400&family=Manrope:wght@300;400&display=swap"
        precedence="default"
      />
      <link rel="stylesheet" href={notFoundCss} precedence="default" />
      <div className="nf-bg" />
      <div className="nf-grain" />
      <main className="nf-card">
        <div className="nf-kick">Nothing here</div>
        <h1>This path opens onto empty space</h1>
        <p>Which is not so bad. But there is nothing to see, so you may as well turn back.</p>
        <a className="nf-home" href="/">
          Return to the front door
        </a>
      </main>
    </div>
  )
}
