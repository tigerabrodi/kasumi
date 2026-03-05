import { useEffect, useState } from 'react'
import type { ThemedToken } from 'shiki'
import { highlightCode } from './highlight'
import { Playground } from './playground'
import {
  applyTheme,
  persistTheme,
  resolveInitialTheme,
  type Theme,
} from './theme'

function CodeBlock({ code }: { code: string }) {
  const [tokens, setTokens] = useState<Array<Array<ThemedToken>> | null>(null)

  useEffect(() => {
    void highlightCode(code).then(setTokens)
  }, [code])

  return (
    <div className="bg-code-bg rounded-[14px] px-9 py-8">
      <pre className="font-mono text-sm leading-[26px] whitespace-pre">
        {tokens ? (
          tokens.map((line, i) => (
            <span key={i}>
              {i > 0 && '\n'}
              {line.map((token, j) => (
                <span key={j} style={{ color: token.color }}>
                  {token.content}
                </span>
              ))}
            </span>
          ))
        ) : (
          <span className="text-code-text">{code}</span>
        )}
      </pre>
    </div>
  )
}

export function App() {
  const [theme, setTheme] = useState<Theme>(() => resolveInitialTheme())

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    persistTheme(nextTheme)
  }

  return (
    <div className="max-w-[1200px] mx-auto px-8 md:px-[120px] pb-24">
      <div className="flex justify-end pt-8">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-light bg-cream-dark text-[13px] font-medium text-warm-brown hover:text-warm-black transition-colors cursor-pointer"
          aria-pressed={theme === 'dark'}
          aria-label={`Enable ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Enable ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="font-mono text-xs">
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </span>
          <span className="text-[14px]" aria-hidden>
            {theme === 'light' ? '◐' : '◑'}
          </span>
        </button>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center pt-16 pb-16 gap-5">
        <div className="flex items-baseline gap-4">
          <h1 className="font-display text-7xl font-light text-warm-black tracking-tight">
            kasumi
          </h1>
          <span className="font-display text-7xl font-extralight text-stone">
            霞
          </span>
        </div>
        <p className="text-lg text-warm-brown text-center max-w-[480px]">
          A typewriter library for React. Characters materialize through haze.
          Zero CSS required.
        </p>
      </div>

      {/* Playground + Live code */}
      <Playground />

      {/* Install */}
      <section className="flex flex-col gap-5 mt-16">
        <h2 className="font-display text-[28px] font-normal text-warm-black tracking-tight px-2">
          Install
        </h2>
        <div className="flex flex-col gap-2">
          <div className="bg-code-bg rounded-[10px] px-6 py-3.5">
            <pre className="font-mono text-sm text-code-text">
              npm install @tigerabrodioss/kasumi
            </pre>
          </div>
          <div className="bg-code-bg rounded-[10px] px-6 py-3.5">
            <pre className="font-mono text-sm text-code-text">
              bun add @tigerabrodioss/kasumi
            </pre>
          </div>
        </div>
      </section>

      {/* Quick start */}
      <section className="flex flex-col gap-5 mt-16">
        <div className="flex items-baseline gap-3 px-2">
          <h2 className="font-display text-[28px] font-normal text-warm-black tracking-tight">
            Quick start
          </h2>
          <span className="text-sm text-stone">that is all you need</span>
        </div>
        <CodeBlock
          code={`import { Typewriter } from "@tigerabrodioss/kasumi"

<Typewriter text="Hello world" />`}
        />
      </section>

      {/* The hook */}
      <section className="flex flex-col gap-5 mt-16">
        <div className="flex items-baseline gap-3 px-2">
          <h2 className="font-display text-[28px] font-normal text-warm-black tracking-tight">
            The hook
          </h2>
          <span className="text-sm text-stone">for full control</span>
        </div>
        <p className="text-[15px] text-warm-brown leading-relaxed px-2 max-w-[600px]">
          Each segment carries its own ref. Attach it to whatever element you
          want. You own the markup entirely.
        </p>
        <CodeBlock
          code={`const { segments, isDone } = useTypewriter({
  text: "Hello world",
})

return (
  <h1>
    {segments.map((seg) => (
      <span key={seg.index} ref={seg.ref}>
        {seg.char}
      </span>
    ))}
  </h1>
)`}
        />
      </section>

      {/* Footer */}
      <footer className="flex flex-col items-center pt-20 pb-8 gap-3">
        <span className="font-display text-5xl font-extralight text-stone-lighter">
          霞
        </span>
        <p className="text-sm text-stone text-center max-w-[360px] leading-relaxed">
          Haze, mist. Characters appear as if materializing from mist. That is
          the feeling this library is built around.
        </p>
      </footer>
    </div>
  )
}
