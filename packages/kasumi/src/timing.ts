import type { FeelConfig, FeelCurve } from './types'

export type ResolvedFeel = {
  baseDelay: number
  curve: FeelCurve
}

const EASE_OUT_AT = 0.75

const PRESETS: Record<string, ResolvedFeel> = {
  // Accelerates then decelerates — matches Brew hero pacing
  cinematic: {
    baseDelay: 34,
    curve: ({ progress }) => {
      if (progress <= EASE_OUT_AT) {
        const t = progress / EASE_OUT_AT
        return 34 + (10 - 34) * t * t // 34ms → 10ms (speed up)
      }
      const t = (progress - EASE_OUT_AT) / (1 - EASE_OUT_AT)
      return 10 + (28 - 10) * t * t // 10ms → 28ms (slow down)
    },
  },
  snappy: {
    baseDelay: 20,
    curve: ({ progress }) => {
      if (progress <= EASE_OUT_AT) {
        const t = progress / EASE_OUT_AT
        return 20 + (8 - 20) * t * t
      }
      const t = (progress - EASE_OUT_AT) / (1 - EASE_OUT_AT)
      return 8 + (16 - 8) * t * t
    },
  },
  playful: {
    baseDelay: 28,
    curve: ({ progress }) => {
      const base = 28 + Math.sin(progress * Math.PI * 2) * 12
      return Math.max(8, base)
    },
  },
}

export function resolveFeel(feel: FeelConfig | undefined): ResolvedFeel {
  if (!feel) return PRESETS.cinematic
  if (typeof feel === 'string') return PRESETS[feel]
  return { baseDelay: 34, curve: feel.curve }
}

/**
 * Returns the delay in ms for a character at a given index.
 * Applies the feel curve and adds slight natural jitter (±10%).
 */
export function getCharDelay(
  index: number,
  total: number,
  resolved: ResolvedFeel
): number {
  const progress = total <= 1 ? 0 : index / (total - 1)
  const base = resolved.curve({ progress, index, total })
  const jitter = 0.9 + Math.random() * 0.2
  return Math.round(base * jitter)
}
