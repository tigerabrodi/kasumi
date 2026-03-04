import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  Segment,
  TypewriterPhase,
  UseTypewriterOptions,
  UseTypewriterResult,
} from './types'
import { getCharDelay, resolveFeelConfig } from './timing'
import { animateBlurIn, animateBlurOut, resolveBlurOptions } from './blur'

function buildSegments(text: string, visibleCount: number): Array<Segment> {
  return text.split('').map((char, i) => ({
    char,
    status: i < visibleCount ? 'visible' : 'hidden',
  }))
}

export function useTypewriter(
  options: UseTypewriterOptions
): UseTypewriterResult {
  const {
    strings: rawStrings,
    feel,
    blur,
    loop: shouldLoop = false,
    pauseBetween = 2000,
    deleteSpeed = 0.5,
    autoStart: shouldAutoStart = true,
  } = options

  const strings = Array.isArray(rawStrings) ? rawStrings : [rawStrings]
  const feelConfig = resolveFeelConfig(feel)
  const blurOptions = resolveBlurOptions(blur)

  const [visibleCount, setVisibleCount] = useState(0)
  const [stringIndex, setStringIndex] = useState(0)
  const [phase, setPhase] = useState<TypewriterPhase>(
    shouldAutoStart ? 'typing' : 'done'
  )

  const currentText = strings[stringIndex] ?? ''

  const elRefs = useRef<Map<number, HTMLElement>>(new Map())
  const animationsRef = useRef<Map<number, Animation>>(new Map())
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isMultiString = strings.length > 1

  // Cleanup animations on unmount
  useEffect(() => {
    const animations = animationsRef.current
    return () => {
      animations.forEach((anim) => anim.cancel())
      animations.clear()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Typing phase
  useEffect(() => {
    if (phase !== 'typing') return

    if (visibleCount >= currentText.length) {
      if (isMultiString && shouldLoop) {
        setPhase('pausing')
      } else if (isMultiString && stringIndex < strings.length - 1) {
        setPhase('pausing')
      } else {
        setPhase('done')
      }
      return
    }

    const delay = getCharDelay(visibleCount, currentText.length, feelConfig)
    timerRef.current = setTimeout(() => {
      setVisibleCount((c) => c + 1)

      const el = elRefs.current.get(visibleCount)
      if (el && blurOptions) {
        const anim = animateBlurIn(el, blurOptions)
        if (anim) {
          animationsRef.current.set(visibleCount, anim)
        }
      }
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [
    phase,
    visibleCount,
    currentText,
    feelConfig,
    blurOptions,
    isMultiString,
    shouldLoop,
    stringIndex,
    strings.length,
  ])

  // Pause phase
  useEffect(() => {
    if (phase !== 'pausing') return

    timerRef.current = setTimeout(() => {
      setPhase('deleting')
    }, pauseBetween)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [phase, pauseBetween])

  // Deleting phase
  useEffect(() => {
    if (phase !== 'deleting') return

    if (visibleCount <= 0) {
      const nextIndex = stringIndex + 1 >= strings.length ? 0 : stringIndex + 1
      setStringIndex(nextIndex)
      setPhase('typing')
      return
    }

    const baseDeleteDelay = feelConfig.baseDelay * deleteSpeed
    const jitter = 0.85 + Math.random() * 0.3
    const delay = Math.round(baseDeleteDelay * jitter)

    timerRef.current = setTimeout(() => {
      const deletingIndex = visibleCount - 1

      const el = elRefs.current.get(deletingIndex)
      if (el && blurOptions) {
        animationsRef.current.get(deletingIndex)?.cancel()
        const anim = animateBlurOut(el, blurOptions)
        if (anim) {
          animationsRef.current.set(deletingIndex, anim)
        }
      }

      setVisibleCount((c) => c - 1)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [
    phase,
    visibleCount,
    feelConfig,
    deleteSpeed,
    blurOptions,
    stringIndex,
    strings.length,
  ])

  const refCallback = useCallback(
    (index: number) => (el: HTMLElement | null) => {
      if (el) {
        elRefs.current.set(index, el)
      } else {
        elRefs.current.delete(index)
        animationsRef.current.get(index)?.cancel()
        animationsRef.current.delete(index)
      }
    },
    []
  )

  const restart = useCallback(() => {
    animationsRef.current.forEach((anim) => anim.cancel())
    animationsRef.current.clear()
    if (timerRef.current) clearTimeout(timerRef.current)

    setStringIndex(0)
    setVisibleCount(0)
    setPhase('typing')
  }, [])

  const segments = buildSegments(currentText, visibleCount)

  return {
    segments,
    refCallback,
    phase,
    currentStringIndex: stringIndex,
    restart,
  }
}
