import { createElement } from 'react'
import type { TypewriterProps } from './types'
import { useTypewriter } from './useTypewriter'

export function Typewriter({
  strings,
  feel,
  blur,
  loop,
  pauseBetween,
  deleteSpeed,
  autoStart,
  as = 'span',
  className,
  style,
  charClassName,
  children,
}: TypewriterProps) {
  const result = useTypewriter({
    strings,
    feel,
    blur,
    loop,
    pauseBetween,
    deleteSpeed,
    autoStart,
  })

  if (children) {
    return <>{children(result)}</>
  }

  return createElement(
    as,
    {
      className,
      style: { display: 'inline', ...style },
      'aria-label':
        typeof strings === 'string'
          ? strings
          : strings[result.currentStringIndex],
    },
    result.segments.map((segment, i) => (
      <span
        key={`${result.currentStringIndex}-${i}`}
        ref={result.refCallback(i)}
        className={charClassName}
        style={{
          visibility: segment.status === 'hidden' ? 'hidden' : 'visible',
        }}
        aria-hidden="true"
      >
        {segment.char}
      </span>
    ))
  )
}
