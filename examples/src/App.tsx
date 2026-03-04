import { Typewriter, useTypewriter } from '@tigerabrodioss/kasumi'

function HookDemo() {
  const { segments, refCallback, phase, restart } = useTypewriter({
    strings: [
      'Build something beautiful.',
      'Ship with confidence.',
      'Dream in code.',
    ],
    feel: 'cinematic',
    loop: true,
    pauseBetween: 2500,
  })

  return (
    <div style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontSize: 14,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#888',
          marginBottom: 12,
        }}
      >
        Hook — Loop Mode (Cinematic)
      </h2>
      <p style={{ fontSize: 36, fontWeight: 300, minHeight: 50 }}>
        {segments.map((seg, i) => (
          <span
            key={i}
            ref={refCallback(i)}
            style={{
              visibility: seg.status === 'hidden' ? 'hidden' : 'visible',
            }}
          >
            {seg.char}
          </span>
        ))}
        <span
          style={{
            opacity: phase === 'done' ? 0 : 1,
            transition: 'opacity 0.3s',
          }}
        >
          |
        </span>
      </p>
      <button
        onClick={restart}
        style={{
          marginTop: 12,
          padding: '8px 20px',
          fontSize: 13,
          background: 'none',
          border: '1px solid #ccc',
          borderRadius: 6,
          cursor: 'pointer',
          color: '#555',
        }}
      >
        Restart
      </button>
    </div>
  )
}

function ComponentSnappy() {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontSize: 14,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#888',
          marginBottom: 12,
        }}
      >
        Component — Snappy
      </h2>
      <div style={{ fontSize: 28, fontWeight: 400 }}>
        <Typewriter
          strings="The quick brown fox jumps over the lazy dog."
          feel="snappy"
        />
      </div>
    </div>
  )
}

function ComponentPlayful() {
  return (
    <div style={{ marginBottom: 48 }}>
      <h2
        style={{
          fontSize: 14,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#888',
          marginBottom: 12,
        }}
      >
        Component — Playful, No Blur
      </h2>
      <div style={{ fontSize: 28, fontWeight: 400 }}>
        <Typewriter
          strings="No blur, just pure typing energy!"
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
      <h2
        style={{
          fontSize: 14,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: '#888',
          marginBottom: 12,
        }}
      >
        Component — Loop with Delete
      </h2>
      <div style={{ fontSize: 28, fontWeight: 400 }}>
        <Typewriter
          strings={['designers', 'engineers', 'dreamers', 'makers']}
          feel="cinematic"
          loop
          pauseBetween={1800}
        />
      </div>
    </div>
  )
}

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

      <HookDemo />
      <ComponentSnappy />
      <ComponentPlayful />
      <ComponentLoop />
    </div>
  )
}
