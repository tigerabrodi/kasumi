import {
  Typewriter,
  useTypewriter,
  type BlurOptions,
  type FeelConfig,
} from '@tigerabrodioss/kasumi'
import { useCallback, useState } from 'react'

// --- Shared styles ---

const labelStyle = {
  fontSize: 11,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  color: '#999',
  marginBottom: 4,
  display: 'block',
}

const sectionLabel = {
  fontSize: 14,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.1em',
  color: '#888',
  marginBottom: 12,
}

const inputStyle = {
  width: '100%',
  padding: '6px 10px',
  fontSize: 14,
  border: '1px solid #ddd',
  borderRadius: 6,
  outline: 'none',
  fontFamily: 'inherit',
  color: '#333',
}

const buttonStyle = {
  padding: '8px 20px',
  fontSize: 13,
  background: 'none',
  border: '1px solid #ccc',
  borderRadius: 6,
  cursor: 'pointer',
  color: '#555',
}

const activeButtonStyle = {
  ...buttonStyle,
  background: '#1a1a1a',
  color: '#fff',
  borderColor: '#1a1a1a',
}

const sliderRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  marginBottom: 10,
}

// --- Playground ---

function Playground() {
  const [text, setText] = useState('Characters materialize through haze')
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

  // Key to force remount when restart is pressed
  const [runKey, setRunKey] = useState(0)

  const handleRestart = useCallback(() => {
    setRunKey((k) => k + 1)
  }, [])

  const blurConfig: BlurOptions | false = isBlurEnabled
    ? { amount: blurAmount, duration: blurDuration, trailLength: blurTrail }
    : false

  return (
    <div style={{ marginBottom: 64 }}>
      <h2 style={sectionLabel}>Playground</h2>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          marginBottom: 32,
          padding: 20,
          border: '1px solid #eee',
          borderRadius: 10,
        }}
      >
        {/* Text input */}
        <div>
          <label style={labelStyle}>Text</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Feel preset */}
        <div>
          <label style={labelStyle}>Feel</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['cinematic', 'snappy', 'playful'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setFeel(preset)}
                style={feel === preset ? activeButtonStyle : buttonStyle}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Blur toggle + settings */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>Blur</label>
            <button
              onClick={() => setIsBlurEnabled((b) => !b)}
              style={{
                ...buttonStyle,
                padding: '4px 12px',
                fontSize: 11,
              }}
            >
              {isBlurEnabled ? 'on' : 'off'}
            </button>
          </div>
          {isBlurEnabled && (
            <div style={{ marginTop: 10 }}>
              <div style={sliderRow}>
                <span style={{ ...labelStyle, width: 80, marginBottom: 0 }}>
                  amount
                </span>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={blurAmount}
                  onChange={(e) => setBlurAmount(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 13, color: '#666', width: 36 }}>
                  {blurAmount}px
                </span>
              </div>
              <div style={sliderRow}>
                <span style={{ ...labelStyle, width: 80, marginBottom: 0 }}>
                  duration
                </span>
                <input
                  type="range"
                  min={50}
                  max={1000}
                  step={50}
                  value={blurDuration}
                  onChange={(e) => setBlurDuration(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 13, color: '#666', width: 46 }}>
                  {blurDuration}ms
                </span>
              </div>
              <div style={sliderRow}>
                <span style={{ ...labelStyle, width: 80, marginBottom: 0 }}>
                  trail
                </span>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={blurTrail}
                  onChange={(e) => setBlurTrail(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
                <span style={{ fontSize: 13, color: '#666', width: 36 }}>
                  {blurTrail}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Timing */}
        <div style={sliderRow}>
          <span style={{ ...labelStyle, width: 80, marginBottom: 0 }}>
            init delay
          </span>
          <input
            type="range"
            min={0}
            max={1000}
            step={50}
            value={initialDelay}
            onChange={(e) => setInitialDelay(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: 13, color: '#666', width: 46 }}>
            {initialDelay}ms
          </span>
        </div>

        {/* Loop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Loop</label>
          <button
            onClick={() => setIsLoopEnabled((l) => !l)}
            style={{
              ...buttonStyle,
              padding: '4px 12px',
              fontSize: 11,
            }}
          >
            {isLoopEnabled ? 'on' : 'off'}
          </button>
        </div>
        {isLoopEnabled && (
          <div style={sliderRow}>
            <span style={{ ...labelStyle, width: 80, marginBottom: 0 }}>
              pause after
            </span>
            <input
              type="range"
              min={200}
              max={4000}
              step={100}
              value={pauseAfter}
              onChange={(e) => setPauseAfter(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 13, color: '#666', width: 46 }}>
              {pauseAfter}ms
            </span>
          </div>
        )}
      </div>

      {/* Preview */}
      <div
        style={{
          padding: 24,
          background: '#fafafa',
          borderRadius: 10,
          minHeight: 80,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <PlaygroundPreview
          key={runKey}
          text={text}
          feel={feel}
          blur={blurConfig}
          loop={isLoopEnabled}
          initialDelay={initialDelay}
          pauseAfter={pauseAfter}
        />
        <div>
          <button onClick={handleRestart} style={buttonStyle}>
            Restart
          </button>
        </div>
      </div>
    </div>
  )
}

function PlaygroundPreview({
  text,
  feel,
  blur,
  loop: shouldLoop,
  initialDelay,
  pauseAfter,
}: {
  text: string
  feel: FeelConfig
  blur: BlurOptions | false
  loop: boolean
  initialDelay: number
  pauseAfter: number
}) {
  const { segments, isDone, isTyping, isDeleting } = useTypewriter({
    text,
    feel,
    blur,
    loop: shouldLoop,
    initialDelay,
    pauseAfter,
  })

  return (
    <div>
      <p style={{ fontSize: 32, fontWeight: 300, minHeight: 44 }}>
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
        <span
          style={{
            opacity: isDone ? 0 : 1,
            transition: 'opacity 0.3s',
          }}
        >
          |
        </span>
      </p>
      <p style={{ fontSize: 12, color: '#aaa', marginTop: 8 }}>
        {isTyping && 'typing...'}
        {isDeleting && 'deleting...'}
        {isDone && 'done'}
        {!isTyping && !isDeleting && !isDone && 'waiting...'}
      </p>
    </div>
  )
}

// --- Static demos ---

function HookDemo() {
  const { segments, isDone, restart } = useTypewriter({
    text: [
      'Build something beautiful.',
      'Ship with confidence.',
      'Dream in code.',
    ],
    feel: 'cinematic',
    loop: true,
    pauseAfter: 2500,
  })

  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={sectionLabel}>Hook — Loop Mode (Cinematic)</h2>
      <p style={{ fontSize: 36, fontWeight: 300, minHeight: 50 }}>
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
        <span
          style={{
            opacity: isDone ? 0 : 1,
            transition: 'opacity 0.3s',
          }}
        >
          |
        </span>
      </p>
      <button onClick={restart} style={{ ...buttonStyle, marginTop: 12 }}>
        Restart
      </button>
    </div>
  )
}

function ComponentSnappy() {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={sectionLabel}>Component — Snappy</h2>
      <div style={{ fontSize: 28, fontWeight: 400 }}>
        <Typewriter
          text="The quick brown fox jumps over the lazy dog."
          feel="snappy"
        />
      </div>
    </div>
  )
}

function ComponentPlayful() {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={sectionLabel}>Component — Playful, No Blur</h2>
      <div style={{ fontSize: 28, fontWeight: 400 }}>
        <Typewriter
          text="No blur, just pure typing energy!"
          feel="playful"
          blur={false}
        />
      </div>
    </div>
  )
}

function ComponentLoop() {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2 style={sectionLabel}>Component — Loop with Delete</h2>
      <div style={{ fontSize: 28, fontWeight: 400 }}>
        <Typewriter
          text={['designers', 'engineers', 'dreamers', 'makers']}
          feel="cinematic"
          loop
          pauseAfter={1800}
        />
      </div>
    </div>
  )
}

// --- App ---

export function App() {
  return (
    <div
      style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '80px 32px',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: '#1a1a1a',
      }}
    >
      <h1 style={{ fontSize: 48, fontWeight: 200, marginBottom: 8 }}>
        霞 kasumi
      </h1>
      <p style={{ fontSize: 16, color: '#888', marginBottom: 64 }}>
        Typewriter effect with blur trail and deceleration
      </p>

      <Playground />

      <hr
        style={{
          border: 'none',
          borderTop: '1px solid #eee',
          margin: '48px 0',
        }}
      />

      <HookDemo />
      <ComponentSnappy />
      <ComponentPlayful />
      <ComponentLoop />
    </div>
  )
}
