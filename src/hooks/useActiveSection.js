import { useEffect, useState } from 'react'

// Devuelve el id de la sección que está en el centro de la pantalla.
// Lo comparten el navbar (subrayado) y el raíl de progreso (punto activo):
// los dos leen el mismo dato, así nunca se desincronizan.
export default function useActiveSection(ids) {
  const [active, setActive] = useState('')
  const key = ids.join(',')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    key.split(',').forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [key])
  return active
}
