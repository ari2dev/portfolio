import { lazy, Suspense } from 'react'

// Three.js pesa bastante: se carga aparte para que el texto aparezca antes.
const Topo = lazy(() => import('./Topo'))

// Fondo: un plano de cota vivo (curvas de nivel de un terreno fbm). El cursor
// levanta una cima bajo el puntero y el scroll sobrevuela el relieve; la
// opacidad cae al bajar para que el texto mande.
export default function Backdrop() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <Suspense fallback={null}><Topo /></Suspense>
    </div>
  )
}
