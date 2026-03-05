import * as Slider from '@radix-ui/react-slider'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import {
  useTypewriter,
  type BlurOptions,
  type FeelConfig,
} from '@tigerabrodioss/kasumi'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import type { ThemedToken } from 'shiki'
import { highlightCode } from './highlight'

const FEEL_PRESETS = ['cinematic', 'snappy', 'playful'] as const

const COLLAPSE_TRANSITION = {
  duration: 0.3,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
}

const INPUT_TRANSITION = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1] as const,
  filter: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
}

function AnimatedSection({
  isVisible,
  children,
}: {
  isVisible: boolean
  children: React.ReactNode
}) {
  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <motion.div
          initial={{
            height: 0,
            marginTop: -40,
            opacity: 0,
            filter: 'blur(8px)',
          }}
          animate={{
            height: 'auto',
            marginTop: 0,
            opacity: 1,
            filter: 'blur(0px)',
          }}
          exit={{ height: 0, marginTop: -40, opacity: 0, filter: 'blur(8px)' }}
          transition={COLLAPSE_TRANSITION}
          style={{ overflow: 'hidden' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function CodeBlock({
  config,
}: {
  config: {
    texts: Array<string>
    feel: string
    blur: BlurOptions | false
    loop: boolean
    initialDelay: number
    pauseAfter: number
  }
}) {
  const lines: Array<string> = [`const { segments, isDone } = useTypewriter({`]

  if (config.loop && config.texts.length > 1) {
    lines.push(`  text: [`)
    for (const t of config.texts) {
      lines.push(`    "${t}",`)
    }
    lines.push(`  ],`)
  } else {
    lines.push(`  text: "${config.texts[0]}",`)
  }

  lines.push(`  feel: "${config.feel}",`)

  if (config.blur !== false) {
    lines.push(`  blur: {`)
    lines.push(`    amount: ${config.blur.amount},`)
    lines.push(`    duration: ${config.blur.duration},`)
    lines.push(`    trailLength: ${config.blur.trailLength},`)
    lines.push(`  },`)
  } else {
    lines.push(`  blur: false,`)
  }

  if (config.loop) {
    lines.push(`  loop: true,`)
    lines.push(`  pauseAfter: ${config.pauseAfter},`)
  }

  if (config.initialDelay > 0) {
    lines.push(`  initialDelay: ${config.initialDelay},`)
  }

  lines.push(`})`)

  const code = lines.join('\n')
  const [tokens, setTokens] = useState<Array<Array<ThemedToken>> | null>(null)

  useEffect(() => {
    void highlightCode(code).then(setTokens)
  }, [code])

  return (
    <pre className="font-mono text-sm leading-[26px]">
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
  )
}

function Preview({
  texts,
  feel,
  blur,
  loop: shouldLoop,
  initialDelay,
  pauseAfter,
}: {
  texts: Array<string>
  feel: FeelConfig
  blur: BlurOptions | false
  loop: boolean
  initialDelay: number
  pauseAfter: number
}) {
  const options = shouldLoop
    ? { text: texts, feel, blur, loop: true as const, initialDelay, pauseAfter }
    : { text: texts[0], feel, blur, initialDelay }
  const { segments, isDone, isTyping, isDeleting } = useTypewriter(options)

  return (
    <div className="flex flex-col gap-3">
      <p className="font-display text-[28px] font-light tracking-tight text-warm-black min-h-[40px]">
        {segments.map((seg) => (
          <span
            key={seg.index}
            ref={seg.ref}
            style={{
              visibility: seg.state === 'hidden' ? 'hidden' : 'visible',
            }}
          >
            {seg.char}
          </span>
        ))}
      </p>
      <p className="text-xs font-medium text-stone">
        {isTyping && 'typing...'}
        {isDeleting && 'deleting...'}
        {isDone && 'done'}
        {!isTyping && !isDeleting && !isDone && 'waiting...'}
      </p>
    </div>
  )
}

export function Playground() {
  const [texts, setTexts] = useState(['Characters materialize through haze'])
  const [feel, setFeel] = useState<'cinematic' | 'snappy' | 'playful'>(
    'cinematic'
  )
  const [isBlurEnabled, setIsBlurEnabled] = useState(true)
  const [blurAmount, setBlurAmount] = useState(8)
  const [blurDuration, setBlurDuration] = useState(300)
  const [blurTrail, setBlurTrail] = useState(4)
  const [initialDelay, setInitialDelay] = useState(0)
  const [isLoopEnabled, setIsLoopEnabled] = useState(false)
  const [pauseAfter, setPauseAfter] = useState(1200)
  const [runKey, setRunKey] = useState(0)

  const handleRestart = useCallback(() => {
    setRunKey((k) => k + 1)
  }, [])

  const blurConfig: BlurOptions | false = isBlurEnabled
    ? { amount: blurAmount, duration: blurDuration, trailLength: blurTrail }
    : false

  return (
    <div className="flex flex-col gap-10">
      {/* Playground card */}
      <div className="bg-cream-dark rounded-2xl p-12 flex flex-col gap-10">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-stone uppercase tracking-widest">
            Playground
          </span>
          <span className="text-sm text-warm-brown">
            Tweak every parameter. See it live.
          </span>
        </div>

        {/* Preview */}
        <div className="bg-cream rounded-xl p-10">
          <Preview
            key={runKey}
            texts={texts}
            feel={feel}
            blur={blurConfig}
            loop={isLoopEnabled}
            initialDelay={initialDelay}
            pauseAfter={pauseAfter}
          />
        </div>

        {/* Text inputs */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-semibold text-stone uppercase tracking-widest">
            {isLoopEnabled && texts.length > 1 ? 'Texts' : 'Text'}
          </label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={texts[0]}
                onChange={(e) => {
                  const next = [...texts]
                  next[0] = e.target.value
                  setTexts(next)
                }}
                placeholder="String 1"
                className="flex-1 px-4 py-2.5 text-sm bg-cream border border-stone-light rounded-lg text-warm-black font-body placeholder:text-stone focus:border-warm-brown transition-colors"
              />
            </div>
            <AnimatePresence initial={false}>
              {texts.slice(1).map((t, i) => (
                <motion.div
                  key={i + 1}
                  initial={{
                    height: 0,
                    marginTop: -8,
                    opacity: 0,
                    filter: 'blur(8px)',
                  }}
                  animate={{
                    height: 'auto',
                    marginTop: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                  }}
                  exit={{
                    height: 0,
                    marginTop: -8,
                    opacity: 0,
                    filter: 'blur(8px)',
                  }}
                  transition={INPUT_TRANSITION}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={t}
                      onChange={(e) => {
                        const next = [...texts]
                        next[i + 1] = e.target.value
                        setTexts(next)
                      }}
                      placeholder={`String ${i + 2}`}
                      className="flex-1 px-4 py-2.5 text-sm bg-cream border border-stone-light rounded-lg text-warm-black font-body placeholder:text-stone focus:border-warm-brown transition-colors"
                    />
                    {texts.length > 2 && (
                      <button
                        onClick={() =>
                          setTexts(texts.filter((_, j) => j !== i + 1))
                        }
                        className="px-3 py-2.5 text-sm text-stone hover:text-warm-brown transition-colors cursor-pointer"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <AnimatePresence initial={false}>
            {isLoopEnabled && (
              <motion.button
                initial={{ height: 0, marginTop: -8, opacity: 0 }}
                animate={{ height: 'auto', marginTop: 0, opacity: 1 }}
                exit={{ height: 0, marginTop: -8, opacity: 0 }}
                transition={COLLAPSE_TRANSITION}
                onClick={() => setTexts([...texts, ''])}
                className="self-start text-sm text-warm-brown hover:text-warm-black transition-colors cursor-pointer mt-1"
              >
                + Add text
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Toggle controls */}
        <div className="flex items-start gap-10">
          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-semibold text-stone uppercase tracking-widest">
              Feel
            </span>
            <ToggleGroup.Root
              type="single"
              value={feel}
              onValueChange={(v) => {
                if (v) setFeel(v as typeof feel)
              }}
              className="flex gap-1.5"
            >
              {FEEL_PRESETS.map((preset) => (
                <ToggleGroup.Item
                  key={preset}
                  value={preset}
                  className="px-4 py-1.5 text-[13px] rounded-lg border transition-colors data-[state=on]:bg-ink data-[state=on]:text-cream data-[state=on]:border-ink data-[state=on]:font-medium data-[state=off]:border-stone-light data-[state=off]:text-warm-brown data-[state=off]:bg-transparent"
                >
                  {preset}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-semibold text-stone uppercase tracking-widest">
              Blur
            </span>
            <ToggleGroup.Root
              type="single"
              value={isBlurEnabled ? 'on' : 'off'}
              onValueChange={(v) => {
                if (v) setIsBlurEnabled(v === 'on')
              }}
              className="flex gap-1.5"
            >
              <ToggleGroup.Item
                value="on"
                className="px-4 py-1.5 text-[13px] rounded-lg border transition-colors data-[state=on]:bg-ink data-[state=on]:text-cream data-[state=on]:border-ink data-[state=on]:font-medium data-[state=off]:border-stone-light data-[state=off]:text-warm-brown data-[state=off]:bg-transparent"
              >
                on
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="off"
                className="px-4 py-1.5 text-[13px] rounded-lg border transition-colors data-[state=on]:bg-ink data-[state=on]:text-cream data-[state=on]:border-ink data-[state=on]:font-medium data-[state=off]:border-stone-light data-[state=off]:text-warm-brown data-[state=off]:bg-transparent"
              >
                off
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>

          <div className="flex flex-col gap-2.5">
            <span className="text-[11px] font-semibold text-stone uppercase tracking-widest">
              Loop
            </span>
            <ToggleGroup.Root
              type="single"
              value={isLoopEnabled ? 'on' : 'off'}
              onValueChange={(v) => {
                if (!v) return
                const isOn = v === 'on'
                setIsLoopEnabled(isOn)
                if (isOn && texts.length < 2) {
                  setTexts([...texts, ''])
                } else if (!isOn) {
                  setTexts([texts[0]])
                }
              }}
              className="flex gap-1.5"
            >
              <ToggleGroup.Item
                value="on"
                className="px-4 py-1.5 text-[13px] rounded-lg border transition-colors data-[state=on]:bg-ink data-[state=on]:text-cream data-[state=on]:border-ink data-[state=on]:font-medium data-[state=off]:border-stone-light data-[state=off]:text-warm-brown data-[state=off]:bg-transparent"
              >
                on
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="off"
                className="px-4 py-1.5 text-[13px] rounded-lg border transition-colors data-[state=on]:bg-ink data-[state=on]:text-cream data-[state=on]:border-ink data-[state=on]:font-medium data-[state=off]:border-stone-light data-[state=off]:text-warm-brown data-[state=off]:bg-transparent"
              >
                off
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
        </div>

        {/* Blur sliders */}
        <AnimatedSection isVisible={isBlurEnabled}>
          <div className="flex items-start gap-8">
            <SliderControl
              label="Amount"
              value={blurAmount}
              min={1}
              max={20}
              unit="px"
              onChange={setBlurAmount}
            />
            <SliderControl
              label="Duration"
              value={blurDuration}
              min={50}
              max={1000}
              step={50}
              unit="ms"
              onChange={setBlurDuration}
            />
            <SliderControl
              label="Trail"
              value={blurTrail}
              min={1}
              max={10}
              onChange={setBlurTrail}
            />
          </div>
        </AnimatedSection>

        {/* Loop sliders */}
        <AnimatedSection isVisible={isLoopEnabled}>
          <div className="flex items-start gap-8">
            <SliderControl
              label="Pause after"
              value={pauseAfter}
              min={200}
              max={4000}
              step={100}
              unit="ms"
              onChange={setPauseAfter}
            />
            <SliderControl
              label="Initial delay"
              value={initialDelay}
              min={0}
              max={1000}
              step={50}
              unit="ms"
              onChange={setInitialDelay}
            />
          </div>
        </AnimatedSection>

        {/* Restart */}
        <button
          onClick={handleRestart}
          className="self-start px-7 py-2.5 bg-ink text-cream text-sm font-medium rounded-[10px] hover:opacity-90 transition-opacity cursor-pointer"
        >
          Restart
        </button>
      </div>

      {/* Live code */}
      <div className="flex flex-col gap-5">
        <div className="flex items-baseline gap-3 px-2">
          <h2 className="font-display text-[28px] font-normal text-warm-black tracking-tight">
            Live code
          </h2>
          <span className="text-sm text-stone">updates as you tweak</span>
        </div>
        <div className="bg-code-bg rounded-[14px] p-8">
          <CodeBlock
            config={{
              texts,
              feel,
              blur: blurConfig,
              loop: isLoopEnabled,
              initialDelay,
              pauseAfter,
            }}
          />
        </div>
      </div>
    </div>
  )
}

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-2 flex-1">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-semibold text-stone uppercase tracking-widest">
          {label}
        </span>
        <span className="font-mono text-xs text-warm-brown">
          {value}
          {unit}
        </span>
      </div>
      <Slider.Root
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onChange(v)}
        className="relative flex items-center h-5 select-none touch-none"
      >
        <Slider.Track className="relative h-1 grow rounded-full bg-stone-lighter">
          <Slider.Range className="absolute h-full rounded-full bg-warm-brown" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 rounded-full bg-ink shadow-sm hover:bg-warm-brown transition-colors" />
      </Slider.Root>
    </div>
  )
}
