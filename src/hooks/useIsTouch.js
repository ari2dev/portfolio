import { useEffect, useState } from 'react'

// true en móviles/tablets. Lo usamos para simplificar el 3D y quitar el cursor custom.
export default function useIsTouch() {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse), (max-width: 768px)')
    const update = () => setTouch(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return touch
}