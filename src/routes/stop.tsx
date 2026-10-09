import { createFileRoute } from '@tanstack/react-router'
import { StopPage } from '../stop/StopPage'
import stopCss from '../stop/stop.css?url'

export const Route = createFileRoute('/stop')({
  head: () => ({
    meta: [{ title: 'Unbound · Be still' }],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@300;400;600&display=swap',
      },
      { rel: 'stylesheet', href: stopCss },
    ],
  }),
  component: StopPage,
})
