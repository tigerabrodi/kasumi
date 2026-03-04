import type { BlurOptions } from './types'

export type ResolvedBlur = {
  trailLength: number
  duration: number
  amount: number
  easing: string
}

const DEFAULTS: ResolvedBlur = {
  trailLength: 4,
  duration: 300,
  amount: 8,
  easing: 'ease-out',
}

export function resolveBlur(
  blur: BlurOptions | false | undefined
): ResolvedBlur | null {
  if (blur === false) return null
  if (!blur) return DEFAULTS
  return {
    trailLength: blur.trailLength ?? DEFAULTS.trailLength,
    duration: blur.duration ?? DEFAULTS.duration,
    amount: blur.amount ?? DEFAULTS.amount,
    easing: blur.easing ?? DEFAULTS.easing,
  }
}

/**
 * Animate an element from blurred to clear using WAAPI.
 */
export function animateBlurIn(
  el: HTMLElement,
  options: ResolvedBlur
): Animation {
  return el.animate(
    [
      { filter: `blur(${options.amount}px)`, opacity: 0.4 },
      { filter: 'blur(0px)', opacity: 1 },
    ],
    {
      duration: options.duration,
      easing: options.easing,
      fill: 'forwards',
    }
  )
}

/**
 * Animate an element from clear to blurred (for delete animation).
 */
export function animateBlurOut(
  el: HTMLElement,
  options: ResolvedBlur
): Animation {
  return el.animate(
    [
      { filter: 'blur(0px)', opacity: 1 },
      { filter: `blur(${options.amount * 0.5}px)`, opacity: 0 },
    ],
    {
      duration: options.duration * 0.6,
      easing: options.easing,
      fill: 'forwards',
    }
  )
}
