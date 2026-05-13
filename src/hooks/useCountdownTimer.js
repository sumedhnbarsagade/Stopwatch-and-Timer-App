import { useCallback, useEffect, useRef, useState } from 'react'

export function useCountdownTimer({ durationMs, onComplete }) {
  const [remainingMs, setRemainingMs] = useState(durationMs)
  const [isActive, setIsActive] = useState(false)

  const endWallTimeRef = useRef(null)
  const durationRef = useRef(durationMs)
  const remainingRef = useRef(durationMs)
  const prevDurationRef = useRef(durationMs)
  const onCompleteRef = useRef(onComplete)
  const firedRef = useRef(false)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    remainingRef.current = remainingMs
  }, [remainingMs])

  useEffect(() => {
    durationRef.current = durationMs
  }, [durationMs])

  useEffect(() => {
    if (isActive) return
    if (prevDurationRef.current === durationMs) return
    prevDurationRef.current = durationMs
    firedRef.current = false
    setRemainingMs(durationMs)
    remainingRef.current = durationMs
  }, [durationMs, isActive])

  const readRemaining = useCallback(() => {
    if (endWallTimeRef.current == null) return remainingRef.current
    return Math.max(0, endWallTimeRef.current - Date.now())
  }, [])

  useEffect(() => {
    if (!isActive) return

    let frame = 0
    const tick = () => {
      const next = readRemaining()
      setRemainingMs(next)

      if (next <= 0 && !firedRef.current) {
        firedRef.current = true
        endWallTimeRef.current = null
        setIsActive(false)
        setRemainingMs(0)
        remainingRef.current = 0
        onCompleteRef.current?.()
        return
      }

      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isActive, readRemaining])

  const start = useCallback(() => {
    if (isActive) return
    const base = Math.min(durationRef.current, Math.max(0, remainingRef.current))
    if (base <= 0) return
    firedRef.current = false
    endWallTimeRef.current = Date.now() + base
    setIsActive(true)
    setRemainingMs(base)
    remainingRef.current = base
  }, [isActive])

  const pause = useCallback(() => {
    if (!isActive) return
    const left = endWallTimeRef.current != null
      ? Math.max(0, endWallTimeRef.current - Date.now())
      : remainingRef.current
    endWallTimeRef.current = null
    setIsActive(false)
    setRemainingMs(left)
    remainingRef.current = left
  }, [isActive])

  const reset = useCallback(() => {
    endWallTimeRef.current = null
    firedRef.current = false
    setIsActive(false)
    setRemainingMs(durationRef.current)
    remainingRef.current = durationRef.current
  }, [])

  return { remainingMs, isActive, start, pause, reset }
}
