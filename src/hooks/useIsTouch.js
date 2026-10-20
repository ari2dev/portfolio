import { useState } from 'react'

// true en móviles/tablets. Estado inicial síncrono para no montar la UI de
// escritorio (blur del texto, tilt 3D…) un frame en pantallas táctiles.
export default function useIsTouch() {
  const [touch] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia('(pointer: coarse), (max-width: 768px)').matches,
  )
  return touch
}
