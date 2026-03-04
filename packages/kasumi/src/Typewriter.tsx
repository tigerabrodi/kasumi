import { createElement } from 'react'
import type { TypewriterProps } from './types'
import { useTypewriter } from './useTypewriter'

export function Typewriter({
  as = 'span',
  className,
  ...options
}: TypewriterProps) {
  const result = useTypewriter(options)

  const fullText = Array.isArray(options.text)
    ? options.text.join(' ')
    : options.text

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
