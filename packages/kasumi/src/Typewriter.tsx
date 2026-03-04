import { createElement } from 'react'
import type { TypewriterProps } from './types'
import { useTypewriter } from './useTypewriter'

export function Typewriter({
  text,
  feel,
  blur,
  loop,
  initialDelay,
  pauseAfter,
  onStart,
  onDone,
  onCharTyped,
  onDelete,
  as = 'span',
  className,
}: TypewriterProps) {
  const result = useTypewriter({
    text,
    feel,
    blur,
    loop,
    initialDelay,
    pauseAfter,
    onStart,
    onDone,
    onCharTyped,
    onDelete,
  })

  const fullText = Array.isArray(text) ? text.join(' ') : text

  return createElement(
    as,
    {
      className,
      style: { display: 'inline' },
      'aria-label': fullText,
    },
    result.segments.map((seg) => (
      <span
        key={`${seg.index}`}
        ref={seg.ref}
        style={{
          visibility: seg.state === 'hidden' ? 'hidden' : 'visible',
        }}
        aria-hidden="true"
      >
        {seg.char}
      </span>
    ))
  )
}
