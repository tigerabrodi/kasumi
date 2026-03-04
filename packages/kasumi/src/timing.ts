import type { FeelConfig, FeelCurve } from './types'

type ResolvedFeel = {
  baseDelay: number
  curve: FeelCurve
}

const PRESETS: Record<string, ResolvedFeel> = {
  cinematic: {
    baseDelay: 80,
    curve: ({ progress }) => 80 + progress * 140,
  },
  snappy: {
    baseDelay: 40,
    curve: ({ progress }) => 40 + progress * 24,
  },
  playful: {
    baseDelay: 60,
    curve: ({ progress }) => 60 + Math.sin(progress * Math.PI) * 48,
  },
}

export function resolveFeel(feel: FeelConfig | undefined): ResolvedFeel {
  if (!feel) return PRESETS.cinematic
  if (typeof feel === 'string') return PRESETS[feel]
  return { baseDelay: 80, curve: feel.curve }
}

/**
 * Returns the delay in ms for a character at a given index.
 * Applies the feel curve and adds slight natural jitter (±15%).
 */
export function getCharDelay(
  index: number,
  total: number,
  resolved: ResolvedFeel
): number {
  const progress = total <= 1 ? 0 : index / (total - 1)
  const base = resolved.curve({ progress, index, total })
  const jitter = 0.85 + Math.random() * 0.3
  return Math.round(base * jitter)
}
