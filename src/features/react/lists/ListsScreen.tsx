import { useState } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { labInputClassName } from '@/common/theme/labInput'
import { type Language, languages, type LanguageSort, visibleLanguages } from './languages'

export function ListsScreen() {
  return (
    <LabDemoPage intro="React renders a list by mapping an array to elements. Each element needs a key that is unique among its siblings and stays the same for the same item, so React can match items between renders.">
      <MapDemo />
      <KeysDemo />
      <DerivedListDemo />
    </LabDemoPage>
  )
}

function MapDemo() {
  return (
    <LabDemoSection
      title="Rendering an array with map"
      caption="languages.map(...) returns one <li> per item. The key comes from the data (the language's id), not from its position."
    >
      <ul className="flex flex-col divide-y divide-outline-variant/50">
        {languages.slice(0, 4).map((language) => (
          <li key={language.id} className="flex justify-between py-2">
            <span className="font-medium">{language.name}</span>
            <span className="text-on-surface-variant">{language.year}</span>
          </li>
        ))}
      </ul>
    </LabDemoSection>
  )
}

interface Task {
  id: number
  title: string
}

const initialTasks: Task[] = [
  { id: 1, title: 'Write tests' },
  { id: 2, title: 'Fix the build' },
]

function KeysDemo() {
  const [tasks, setTasks] = useState(initialTasks)
  const [nextId, setNextId] = useState(3)

  const addToTop = () => {
    setTasks((list) => [{ id: nextId, title: `New task ${nextId}` }, ...list])
    setNextId((id) => id + 1)
  }

  return (
    <LabDemoSection
      title="Keys keep each item's identity"
      caption="Type a note next to “Write tests” in both lists, then add a task to the top. With index keys, React reuses the first row for the new task, so the note moves to the wrong task. With id keys, the note stays with its task."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TaskList title="key={index}" tasks={tasks} keyOf={(_task, index) => index} />
        <TaskList title="key={task.id}" tasks={tasks} keyOf={(task) => task.id} />
      </div>
      <div className="flex flex-wrap gap-2">
        <LabButton onClick={addToTop}>Add to top</LabButton>
        <LabButton
          variant="secondary"
          onClick={() => {
            setTasks(initialTasks)
            setNextId(3)
          }}
        >
          Reset
        </LabButton>
      </div>
    </LabDemoSection>
  )
}

function TaskList({ title, tasks, keyOf }: { title: string; tasks: Task[]; keyOf: (task: Task, index: number) => number }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-mono text-sm font-semibold">{title}</h3>
      <ul aria-label={title} className="flex flex-col gap-2">
        {tasks.map((task, index) => (
          <li key={keyOf(task, index)} className="flex flex-col gap-1 text-sm">
            {/* Uncontrolled: the typed note lives in the DOM element, which React keeps or reuses by key. */}
            <label className="flex flex-col gap-1">
              <span>{task.title}</span>
              <input placeholder="Note" aria-label={`Note for ${task.title}`} className={labInputClassName} />
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DerivedListDemo() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<LanguageSort>('year')
  // Filtered and sorted while rendering; the original array in `languages` is never changed.
  const shown: Language[] = visibleLanguages(languages, query, sort)

  return (
    <LabDemoSection
      title="Filter and sort while rendering"
      caption="Keep the full list once, and calculate what to show from it and the controls. Copy before sorting: Array.prototype.sort changes the array it is called on, so use toSorted."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Filter</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} className={labInputClassName} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-on-surface-variant">Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value as LanguageSort)} className={labInputClassName}>
            <option value="year">Year</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>
      {shown.length === 0 ? (
        <p className="text-on-surface-variant">No languages match “{query}”.</p>
      ) : (
        <ol aria-label="Languages" className="flex flex-col divide-y divide-outline-variant/50">
          {shown.map((language) => (
            <li key={language.id} className="flex justify-between py-2">
              <span className="font-medium">{language.name}</span>
              <span className="text-on-surface-variant">{language.year}</span>
            </li>
          ))}
        </ol>
      )}
    </LabDemoSection>
  )
}
