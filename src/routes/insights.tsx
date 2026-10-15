import { createFileRoute } from '@tanstack/react-router'
import { InsightsBook } from '../insights/InsightsBook'
import insightsCss from '../insights/insights.css?url'
import platesCss from '../sit/plates.css?url'
import sitCss from '../sit/sit.css?url'

export const Route = createFileRoute('/insights')({
  head: () => ({
    meta: [{ title: 'Unbound · Personal learnings' }],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@300;400;600&display=swap',
      },
      { rel: 'stylesheet', href: sitCss },
      { rel: 'stylesheet', href: platesCss },
      { rel: 'stylesheet', href: insightsCss },
    ],
  }),
  component: InsightsBook,
})
