import { createFileRoute } from '@tanstack/react-router'
import { SitBook } from '../sit/SitBook'
import platesCss from '../sit/plates.css?url'
import sitCss from '../sit/sit.css?url'

export const Route = createFileRoute('/sit')({
  head: () => ({
    meta: [{ title: 'Unbound · How to sit' }],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@300;400;600&display=swap',
      },
      { rel: 'stylesheet', href: sitCss },
      { rel: 'stylesheet', href: platesCss },
    ],
  }),
  component: SitBook,
})
