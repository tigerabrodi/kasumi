import { useCallback, useEffect, useRef, useState } from 'react'
import { animateBlurIn, animateBlurOut, resolveBlur } from './blur'
import { getCharDelay, resolveFeel } from './timing'
import type {
  Segment,
  UseTypewriterOptions,
  UseTypewriterResult,
} from './types'

type Phase = 'idle' | 'typing' | 'pausing' | 'deleting' | 'done'

export function useTypewriter(
  options: UseTypewriterOptions
): UseTypewriterResult {
  const {
    feel,
    blur,
    initialDelay = 0,
    onStart,
    onDone,
    onCharTyped,
    onDelete,
  } = options

  const shouldLoop = options.loop === true
  const pauseAfter = shouldLoop ? (options.pauseAfter ?? 1200) : 1200
  const strings = Array.isArray(options.text) ? options.text : [options.text]
  const resolved = resolveFeel(feel)
  const blurConfig = resolveBlur(blur)

  const [visibleCount, setVisibleCount] = useState(0)
  const [stringIndex, setStringIndex] = useState(0)
  const [phase, setPhase] = useState<Phase>(
    initialDelay > 0 ? 'idle' : 'typing'
  )
  const [isPaused, setIsPaused] = useState(false)

  const currentText = strings[stringIndex] ?? ''
  const isMultiString = strings.length > 1

  const elRefs = useRef<Map<number, HTMLElement>>(new Map())
  const animationsRef = useRef<Map<number, Animation>>(new Map())
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hasStartedRef = useRef(false)

  // Stable callback refs
  const onStartRef = useRef(onStart)
  const onDoneRef = useRef(onDone)
  const onCharTypedRef = useRef(onCharTyped)
  const onDeleteRef = useRef(onDelete)
  onStartRef.current = onStart
  onDoneRef.current = onDone
  onCharTypedRef.current = onCharTyped
  onDeleteRef.current = onDelete

  // Cleanup on unmount
  useEffect(() => {
    const animations = animationsRef.current
    return () => {
      animations.forEach((anim) => anim.cancel())
      animations.clear()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Initial delay
  useEffect(() => {
    if (phase !== 'idle') return
    timerRef.current = setTimeout(() => {
      setPhase('typing')
    }, initialDelay)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [phase, initialDelay])

  // Typing phase
  useEffect(() => {
    if (phase !== 'typing' || isPaused) return

    if (!hasStartedRef.current) {
      hasStartedRef.current = true
      onStartRef.current?.()
    }

    if (visibleCount >= currentText.length) {
      if (isMultiString && (shouldLoop || stringIndex < strings.length - 1)) {
        setPhase('pausing')
      } else {
        setPhase('done')
        onDoneRef.current?.()
      }
      return
    }

    const delay = getCharDelay(visibleCount, currentText.length, resolved)
    timerRef.current = setTimeout(() => {
      const charIndex = visibleCount
      setVisibleCount((c) => c + 1)

      const el = elRefs.current.get(charIndex)
      if (el && blurConfig) {
        const anim = animateBlurIn(el, blurConfig)
        animationsRef.current.set(charIndex, anim)
      }

      onCharTypedRef.current?.({
        char: currentText[charIndex],
        index: charIndex,
      })
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [
    phase,
    isPaused,
    visibleCount,
    currentText,
    resolved,
    blurConfig,
    isMultiString,
    shouldLoop,
    stringIndex,
    strings.length,
  ])

  // Pause phase
  useEffect(() => {
    if (phase !== 'pausing' || isPaused) return

    timerRef.current = setTimeout(() => {
      setPhase('deleting')
    }, pauseAfter)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [phase, isPaused, pauseAfter])

  // Deleting phase
  useEffect(() => {
    if (phase !== 'deleting' || isPaused) return

    if (visibleCount <= 0) {
      const nextIndex = stringIndex + 1 >= strings.length ? 0 : stringIndex + 1
      setStringIndex(nextIndex)
      hasStartedRef.current = false
      setPhase('typing')
      return
    }

    const deleteDelay = resolved.baseDelay * 0.5
    const jitter = 0.85 + Math.random() * 0.3
    const delay = Math.round(deleteDelay * jitter)

    timerRef.current = setTimeout(() => {
      const deletingIndex = visibleCount - 1

      const el = elRefs.current.get(deletingIndex)
      if (el && blurConfig) {
        animationsRef.current.get(deletingIndex)?.cancel()
        const anim = animateBlurOut(el, blurConfig)
        animationsRef.current.set(deletingIndex, anim)
      }

      onDeleteRef.current?.({
        char: currentText[deletingIndex],
        index: deletingIndex,
      })

      setVisibleCount((c) => c - 1)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [
    phase,
    isPaused,
    visibleCount,
    resolved,
    blurConfig,
    stringIndex,
    strings.length,
    currentText,
  ])

  // Cache ref callbacks per index so React sees stable refs across renders.
  // Without this, React calls old ref(null) on every re-render, which would
  // cancel in-flight WAAPI blur animations.
  const refCacheRef = useRef<Map<number, (el: HTMLElement | null) => void>>(
    new Map()
  )

  const getStableRef = useCallback(
    (index: number): ((el: HTMLElement | null) => void) => {
      const cached = refCacheRef.current.get(index)
      if (cached) return cached

      const fn = (el: HTMLElement | null) => {
        if (el) {
          elRefs.current.set(index, el)
        } else {
          elRefs.current.delete(index)
        }
      }
      refCacheRef.current.set(index, fn)
      return fn
    },
    []
  )

  const segments: Array<Segment> = currentText.split('').map((char, i) => ({
    char,
    state: i < visibleCount ? 'stable' : 'hidden',
    ref: getStableRef(i),
    index: i,
  }))

  // Mark actively blurring segments
  if (blurConfig) {
    const trailStart = Math.max(0, visibleCount - blurConfig.trailLength)
    for (let i = trailStart; i < visibleCount; i++) {
      if (segments[i]) {
        segments[i] = { ...segments[i], state: 'blurring' }
      }
    }
  }

  const restart = useCallback(() => {
    animationsRef.current.forEach((anim) => anim.cancel())
    animationsRef.current.clear()
    if (timerRef.current) clearTimeout(timerRef.current)

    setStringIndex(0)
    setVisibleCount(0)
    setIsPaused(false)
    hasStartedRef.current = false
    setPhase(initialDelay > 0 ? 'idle' : 'typing')
  }, [initialDelay])

  const pause = useCallback(() => {
    setIsPaused(true)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  const resume = useCallback(() => {
    setIsPaused(false)
  }, [])

  return {
    segments,
    isDone: phase === 'done',
    isTyping: phase === 'typing' && !isPaused,
    isDeleting: phase === 'deleting' && !isPaused,
    restart,
    pause,
    resume,
  }
}
