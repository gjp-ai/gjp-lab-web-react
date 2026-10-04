import { Link } from 'react-router'
import { CategoryIcon } from '@/app/navigation/CategoryIcon'
import { findCategoryOfRoute, findTopic, navigationMenu } from '@/app/navigation/NavigationMenu'

const linkFocus = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
const card = 'rounded-[18px] bg-surface p-[18px] shadow-[0_2px_7px_rgba(0,0,0,0.08)]'

/** The address a reader can bookmark or share, including the deployment path ("/lab/react/httpClient/fetch"). */
function shareablePath(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/**
 * The home page at `/`: what the lab is, quick links to good first topics, and every category with its
 * available topics. All topics and categories come from navigation.json.
 */
export function HomeScreen() {
  const topics = navigationMenu.categories.flatMap((category) => category.topics)
  const available = topics.filter((topic) => topic.route !== undefined).length

  return (
    // A container, so the grids follow the pane's width rather than the window's.
    <div className="@container flex flex-col gap-6 px-5 pb-8">
      <section aria-labelledby="home-title" className={card + ' flex flex-col gap-4'}>
        <h2 id="home-title" className="text-3xl font-bold tracking-tight">
          Learn the web platform by running it
        </h2>
        <p className="text-on-surface-variant">
          GJP Lab is a hands-on lab for TypeScript, React, HTTP clients, and browser APIs. Every topic is a small, live demo with the
          code that runs it, so you can try an idea, read how it works, and change it. Its topics and structure mirror the GJP iOS and
          Android labs.
        </p>
        <dl className="grid grid-cols-3 gap-3">
          <Stat label="topics to try" value={available} />
          <Stat label="planned" value={topics.length - available} />
          <Stat label="categories" value={navigationMenu.categories.length} />
        </dl>
      </section>

      <section aria-labelledby="home-start" className="flex flex-col gap-3">
        <h2 id="home-start" className="text-lg font-semibold">
          Start here
        </h2>
        <ul className="grid gap-3 @lg:grid-cols-2 @4xl:grid-cols-3">
          {navigationMenu.featured.map((route) => {
            const category = findCategoryOfRoute(route)!
            const topic = findTopic(route)!
            const path = `/${category.id}/${route}`
            return (
              <li key={route}>
                <Link
                  to={path}
                  className={card + ' flex h-full flex-col gap-1.5 border border-transparent hover:border-outline-variant ' + linkFocus}
                >
                  <span className="text-xs font-semibold tracking-wide text-on-surface-variant uppercase">{category.title}</span>
                  <span className="font-semibold">{topic.title}</span>
                  <span className="flex-1 text-sm text-on-surface-variant">{topic.description}</span>
                  <code className="mt-1 truncate text-xs text-on-surface-variant">{shareablePath(path)}</code>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="home-all" className="flex flex-col gap-3">
        <h2 id="home-all" className="text-lg font-semibold">
          All topics
        </h2>
        <ul className="grid gap-3 @2xl:grid-cols-2">
          {navigationMenu.categories.map((category) => {
            const ready = category.topics.filter((topic) => topic.route !== undefined)
            const planned = category.topics.length - ready.length
            return (
              <li key={category.id} className={card + ' flex flex-col gap-3'}>
                <Link
                  to={`/${category.id}`}
                  aria-label={`${category.title}: ${category.summary}. Opens the ${category.title} catalogue`}
                  className={'flex items-center gap-3 rounded-xl ' + linkFocus}
                >
                  <CategoryIcon name={category.icon} />
                  <span className="flex flex-col">
                    <span className="font-semibold">{category.title}</span>
                    <span className="text-sm text-on-surface-variant">{category.summary}</span>
                  </span>
                </Link>
                {ready.length > 0 && (
                  <ul aria-label={`${category.title} topics`} className="flex flex-wrap gap-1.5">
                    {ready.map((topic) => (
                      <li key={topic.route}>
                        <Link
                          to={`/${category.id}/${topic.route}`}
                          className={'block rounded-full border border-outline-variant px-3 py-1.5 text-sm hover:bg-surface-container ' + linkFocus}
                        >
                          {topic.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                {planned > 0 && (
                  <p className="text-sm text-on-surface-variant">
                    {ready.length === 0 ? 'Coming soon: ' : 'Also planned: '}
                    {category.topics
                      .filter((topic) => topic.route === undefined)
                      .map((topic) => topic.title)
                      .join(', ')}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="home-tips" className={card + ' flex flex-col gap-2'}>
        <h2 id="home-tips" className="font-semibold">
          Tips
        </h2>
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-on-surface-variant">
          <li>Every page has its own address: bookmark a topic or share its link.</li>
          <li>Each topic shows the code it runs, next to the result.</li>
          <li>Use the sun or moon button for light or dark mode.</li>
          <li>On a desktop, press [ to hide or show the sidebar.</li>
        </ul>
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col rounded-xl bg-surface-container px-3 py-2.5 text-on-surface">
      <dt className="order-2 text-xs text-on-surface-variant">{label}</dt>
      <dd className="order-1 text-2xl font-bold tabular-nums">{value}</dd>
    </div>
  )
}
