import type { BlurOptions } from './types'

const DEFAULT_BLUR: Required<BlurOptions> = {
  enabled: true,
  maxBlur: 8,
  duration: 600,
}

export function resolveBlurOptions(
  blur: BlurOptions | false | undefined
): Required<BlurOptions> | null {
  if (blur === false) return null
  if (!blur) return DEFAULT_BLUR
  return {
    enabled: blur.enabled ?? DEFAULT_BLUR.enabled,
    maxBlur: blur.maxBlur ?? DEFAULT_BLUR.maxBlur,
    duration: blur.duration ?? DEFAULT_BLUR.duration,
  }
}

/**
 * Animate an element from blurred to clear using WAAPI.
 * Returns the Animation object so it can be cancelled if needed.
 */
export function animateBlurIn(
  el: HTMLElement,
  options: Required<BlurOptions>
): Animation | null {
  if (!options.enabled) return null

  const keyframes: Array<Keyframe> = [
    { filter: `blur(${options.maxBlur}px)`, opacity: 0.4 },
    { filter: 'blur(0px)', opacity: 1 },
  ]

  return el.animate(keyframes, {
    duration: options.duration,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards',
  })
}

/**
 * Animate an element from clear to blurred (for delete animation).
 */
export function animateBlurOut(
  el: HTMLElement,
  options: Required<BlurOptions>
): Animation | null {
  if (!options.enabled) return null

  const keyframes: Array<Keyframe> = [
    { filter: 'blur(0px)', opacity: 1 },
    { filter: `blur(${options.maxBlur * 0.5}px)`, opacity: 0 },
  ]

  return el.animate(keyframes, {
    duration: options.duration * 0.4,
    easing: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
    fill: 'forwards',
  })
}
