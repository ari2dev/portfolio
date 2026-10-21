import { PATHS } from '../data/tech'

export default function TechIcon({ name, size = 20, className = '' }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg role="img" aria-hidden="true" viewBox="0 0 24 24" width={size} height={size}
      className={className} fill="currentColor" focusable="false">
      <path d={d} />
    </svg>
  )
}
