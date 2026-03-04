# kasumi 霞

A typewriter library for React. Characters materialize through haze. Feels natural. Looks premium. Zero CSS required.

---

## Install

```bash
npm install @tigerabrodioss/kasumi
```

---

## Quick start

```tsx
import { Typewriter } from "@tigerabrodioss/kasumi"

<Typewriter text="What emails can I help you" />
```

That is all you need. It types, it blurs, it decelerates at the end.

---

## Loop through multiple strings

```tsx
<Typewriter
  text={["Design faster.", "Ship sooner.", "Sleep better."]}
  loop
/>
```

---

## The hook. For full control.

When you need custom markup. Two lines on mobile, one on desktop. An animation fading in at the end. Anything the component cannot express.

```tsx
import { useTypewriter } from "@tigerabrodioss/kasumi"

const { segments, isDone, isTyping } = useTypewriter({
  text: "What emails can I help you",
})

return (
  <h1>
    {segments.map((seg) => (
      <span key={seg.index} ref={seg.ref}>
        {seg.char}
      </span>
    ))}
  </h1>
)
```

`seg.ref` is what wires the blur animation via the Web Animations API. You attach it to whatever element you want. You own the markup entirely.

---

## Segments

Each segment has this shape.

```ts
type Segment = {
  char: string
  state: "stable" | "blurring" | "hidden"
  ref: (el: HTMLElement | null) => void
  index: number
}
```

`stable` — fully visible. no animation.
`blurring` — currently animating in via WAAPI.
`hidden` — not visible yet. rendered invisibly so layout does not shift.

---

## Feel presets

```tsx
<Typewriter text="Hello" feel="cinematic" />  // default. slow start, decelerates at end
<Typewriter text="Hello" feel="snappy" />     // faster, tighter curve
<Typewriter text="Hello" feel="playful" />    // slight randomness per character
```

Or bring your own curve. The function receives `progress` (0 to 1) and returns the delay in ms for that character.

```tsx
<Typewriter
  text="Hello"
  feel={{
    curve: ({ progress, index, total }) => {
      return 80 - progress * 60
    }
  }}
/>
```

---

## Blur config

```tsx
<Typewriter
  text="Hello"
  blur={{
    trailLength: 4,    // how many chars blur in at once. default 4
    duration: 300,     // ms per char animation. default 300
    amount: 8,         // blur intensity in px. default 8
    easing: "ease-out" // css easing string. default "ease-out"
  }}
/>
```

Disable blur entirely.

```tsx
<Typewriter text="Hello" blur={false} />
```

---

## Render as any element

```tsx
<Typewriter text="Hello" as="h1" className="text-4xl font-medium" />
<Typewriter text="Hello" as="p" className="text-base" />
```

Default is `span`.

---

## Timing

```tsx
<Typewriter
  text="Hello"
  initialDelay={100}   // ms before typing starts. default 0
  pauseAfter={1200}    // ms to wait at end before deleting. loop only. default 1200
/>
```

---

## Callbacks

```tsx
<Typewriter
  text="Hello"
  onStart={() => {}}
  onDone={() => {}}
  onCharTyped={({ char, index }) => {}}
  onDelete={({ char, index }) => {}}   // loop only
/>
```

---

## useTypewriter full reference

```ts
const {
  segments,
  isDone,
  isTyping,
  isDeleting,
  restart,
  pause,
  resume,
} = useTypewriter({
  text: "Hello",                        // string or string[]
  feel: "cinematic",                    // preset or { curve: fn }
  blur: {
    trailLength: 4,
    duration: 300,
    amount: 8,
    easing: "ease-out",
  },
  loop: false,
  initialDelay: 0,
  pauseAfter: 1200,
  onStart: () => {},
  onDone: () => {},
  onCharTyped: ({ char, index }) => {},
  onDelete: ({ char, index }) => {},
})
```

### Result

| Field | Type | Description |
|---|---|---|
| `segments` | `Segment[]` | Current characters with their state and blur ref |
| `isDone` | `boolean` | True when all characters are typed and animation is complete |
| `isTyping` | `boolean` | True while characters are actively being typed |
| `isDeleting` | `boolean` | True while characters are being deleted (loop mode) |
| `restart` | `() => void` | Reset and replay the animation from the beginning |
| `pause` | `() => void` | Pause mid-animation |
| `resume` | `() => void` | Resume from where it paused |

---

## Full TypeScript types

```ts
type Segment = {
  char: string
  state: "stable" | "blurring" | "hidden"
  ref: (el: HTMLElement | null) => void
  index: number
}

type BlurOptions = {
  trailLength?: number
  duration?: number
  amount?: number
  easing?: string
}

type FeelCurve = (params: {
  progress: number
  index: number
  total: number
}) => number

type FeelConfig =
  | "cinematic"
  | "snappy"
  | "playful"
  | { curve: FeelCurve }

type UseTypewriterOptions = {
  text: string | string[]
  feel?: FeelConfig
  blur?: BlurOptions | false
  loop?: boolean
  initialDelay?: number
  pauseAfter?: number
  onStart?: () => void
  onDone?: () => void
  onCharTyped?: (params: { char: string; index: number }) => void
  onDelete?: (params: { char: string; index: number }) => void
}

type UseTypewriterResult = {
  segments: Segment[]
  isDone: boolean
  isTyping: boolean
  isDeleting: boolean
  restart: () => void
  pause: () => void
  resume: () => void
}

type TypewriterProps = UseTypewriterOptions & {
  as?: keyof HTMLElementTagNameMap
  className?: string
}
```

---

## Why kasumi

霞 means haze or mist in Japanese. Characters appear as if materializing from mist. That is the feeling this library is built around.
