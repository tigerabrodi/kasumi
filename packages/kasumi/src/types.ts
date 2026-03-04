export type Segment = {
  char: string
  state: 'stable' | 'blurring' | 'hidden'
  ref: (el: HTMLElement | null) => void
  index: number
}

export type BlurOptions = {
  /** How many chars blur in at once. Default: 4 */
  trailLength?: number
  /** Ms per char animation. Default: 300 */
  duration?: number
  /** Blur intensity in px. Default: 8 */
  amount?: number
  /** CSS easing string. Default: "ease-out" */
  easing?: string
}

export type FeelCurve = (params: {
  progress: number
  index: number
  total: number
}) => number

export type FeelConfig =
  | 'cinematic'
  | 'snappy'
  | 'playful'
  | { curve: FeelCurve }

export type UseTypewriterOptions = {
  text: string | Array<string>
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

export type UseTypewriterResult = {
  segments: Array<Segment>
  isDone: boolean
  isTyping: boolean
  isDeleting: boolean
  restart: () => void
  pause: () => void
  resume: () => void
}

export type TypewriterProps = UseTypewriterOptions & {
  as?: keyof HTMLElementTagNameMap
  className?: string
}
