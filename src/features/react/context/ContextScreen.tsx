import { createContext, use, useState, type ReactNode } from 'react'
import { LabButton } from '@/common/theme/LabButton'
import { LabDemoPage, LabDemoSection } from '@/common/theme/LabDemoSection'
import { formatDistance, type Units } from './units'

// The default value is used only by components with no provider above them.
const UnitsContext = createContext<Units>('metric')

interface Cart {
  count: number
  add: () => void
  clear: () => void
}

const CartContext = createContext<Cart | null>(null)

/** Reads the cart, and fails loudly if a component is used outside its provider. */
function useCart(): Cart {
  const cart = use(CartContext)
  if (cart === null) throw new Error('useCart must be used inside <CartProvider>')
  return cart
}

export function ContextScreen() {
  return (
    <LabDemoPage intro="Context passes a value to every component below a provider, however deep, without threading it through props at each level. Use it for values many components need, such as units, the signed-in user, or a theme.">
      <ProviderDemo />
      <NestedProviderDemo />
      <CartDemo />
    </LabDemoPage>
  )
}

function ProviderDemo() {
  const [units, setUnits] = useState<Units>('metric')
  return (
    <LabDemoSection
      title="Providing and reading a value"
      caption="The section wraps its content in <UnitsContext value={units}>. RunCard is two levels down and reads the units with use(UnitsContext); nothing in between passes them."
    >
      <div>
        <LabButton onClick={() => setUnits(units === 'metric' ? 'imperial' : 'metric')}>
          {units === 'metric' ? 'Use miles' : 'Use kilometres'}
        </LabButton>
      </div>
      <UnitsContext value={units}>
        <RunList />
      </UnitsContext>
    </LabDemoSection>
  )
}

/** This middle layer knows nothing about units. */
function RunList() {
  return (
    <ul className="grid gap-2 sm:grid-cols-3">
      <RunCard name="Morning run" kilometres={5} />
      <RunCard name="Long run" kilometres={21.1} />
      <RunCard name="Marathon" kilometres={42.195} />
    </ul>
  )
}

function RunCard({ name, kilometres }: { name: string; kilometres: number }) {
  const units = use(UnitsContext)
  return (
    <li className="flex flex-col rounded-xl bg-surface-container px-4 py-3 text-on-surface">
      <span className="text-sm text-on-surface-variant">{name}</span>
      <span className="text-lg font-semibold">{formatDistance(kilometres, units)}</span>
    </li>
  )
}

function NestedProviderDemo() {
  return (
    <LabDemoSection
      title="The nearest provider wins"
      caption="A provider inside another one overrides the value for its own subtree only. Components outside any provider get the default from createContext."
    >
      <div className="flex flex-col gap-2">
        <DistanceLine label="No provider (default)" />
        <UnitsContext value="imperial">
          <DistanceLine label="Inside an imperial provider" />
          <UnitsContext value="metric">
            <DistanceLine label="Inside a metric provider, inside the imperial one" />
          </UnitsContext>
        </UnitsContext>
      </div>
    </LabDemoSection>
  )
}

function DistanceLine({ label }: { label: string }) {
  const units = use(UnitsContext)
  return (
    <p className="flex justify-between gap-3 text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <strong>{formatDistance(10, units)}</strong>
    </p>
  )
}

function CartDemo() {
  return (
    <LabDemoSection
      title="Sharing state and updates"
      caption="CartProvider keeps the count in useState and provides it with add and clear functions. The badge and each product row are far apart but share the same cart."
    >
      <CartProvider>
        <CartHeader />
        <ul className="flex flex-col divide-y divide-outline-variant/50">
          <ProductRow name="Notebook" />
          <ProductRow name="Pencil" />
          <ProductRow name="Eraser" />
        </ul>
      </CartProvider>
    </LabDemoSection>
  )
}

function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)
  const cart: Cart = { count, add: () => setCount((value) => value + 1), clear: () => setCount(0) }
  return <CartContext value={cart}>{children}</CartContext>
}

function CartHeader() {
  const { count, clear } = useCart()
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="font-semibold" aria-live="polite">
        Cart: {count} {count === 1 ? 'item' : 'items'}
      </p>
      <LabButton variant="secondary" onClick={clear} disabled={count === 0}>
        Empty cart
      </LabButton>
    </div>
  )
}

function ProductRow({ name }: { name: string }) {
  const { add } = useCart()
  return (
    <li className="flex items-center justify-between gap-3 py-2">
      <span>{name}</span>
      <LabButton onClick={add} aria-label={`Add ${name} to cart`}>
        Add
      </LabButton>
    </li>
  )
}
