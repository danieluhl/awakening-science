import { createFileRoute } from '@tanstack/react-router'
import { OxBook } from '../ox/OxBook'
import oxCss from '../ox/ox.css?url'
import platesCss from '../sit/plates.css?url'
import sitCss from '../sit/sit.css?url'

export const Route = createFileRoute('/ox')({
  head: () => ({
    meta: [{ title: 'Unbound · The ox and the herder' }],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@300;400;600&display=swap',
      },
      { rel: 'stylesheet', href: sitCss },
      { rel: 'stylesheet', href: platesCss },
      { rel: 'stylesheet', href: oxCss },
    ],
  }),
  component: OxBook,
})
