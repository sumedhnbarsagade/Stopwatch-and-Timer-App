import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Elapsed wall-clock timer: uses Date.now() deltas so the display does not drift.
 * @returns {{
 *   elapsedMs: number,
 *   isActive: boolean,
 *   start: () => void,
 *   pause: () => void,
 *   reset: () => void,
 * }}
 */
export function usePrecisionTimer() {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isActive, setIsActive] = useState(false)

  const segmentStartRef = useRef(null)
  const accumulatedRef = useRef(0)

  const readElapsed = useCallback(() => {
    if (segmentStartRef.current == null) return accumulatedRef.current
    return accumulatedRef.current + (Date.now() - segmentStartRef.current)
  }, [])

  useEffect(() => {
    if (!isActive) return

    let frame = 0
    const tick = () => {
      setElapsedMs(readElapsed())
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isActive, readElapsed])

  const start = useCallback(() => {
    if (isActive) return
    segmentStartRef.current = Date.now()
    setIsActive(true)
    setElapsedMs(readElapsed())
  }, [isActive, readElapsed])

  const pause = useCallback(() => {
    if (!isActive) return
    accumulatedRef.current = readElapsed()
    segmentStartRef.current = null
    setIsActive(false)
    setElapsedMs(accumulatedRef.current)
  }, [isActive, readElapsed])

  const reset = useCallback(() => {
    accumulatedRef.current = 0
    segmentStartRef.current = null
    setIsActive(false)
    setElapsedMs(0)
  }, [])

  return { elapsedMs, isActive, start, pause, reset }
}
