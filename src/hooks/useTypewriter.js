import { useEffect, useState } from 'react'

// Escribe una palabra, la mantiene, la borra y pasa a la siguiente.
export default function useTypewriter(words, speed = 70, pause = 1600) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    const complete = !deleting && text === word

    const timer = setTimeout(() => {
      if (complete) return setDeleting(true)
      if (deleting && text === '') {
        setDeleting(false)
        return setIndex(index + 1)
      }
      setText(word.slice(0, text.length + (deleting ? -1 : 1)))
    }, complete ? pause : deleting ? speed / 2 : speed)

    return () => clearTimeout(timer)
  }, [text, deleting, index, words, speed, pause])

  return text
}