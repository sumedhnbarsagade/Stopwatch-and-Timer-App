export function formatTime(ms, options = {}) {
  const { showFraction = true } = options
  const clamped = Math.max(0, Math.floor(ms))
  const h = Math.floor(clamped / 3_600_000)
  const m = Math.floor((clamped % 3_600_000) / 60_000)
  const s = Math.floor((clamped % 60_000) / 1_000)
  const centi = Math.floor((clamped % 1_000) / 10)

  const pad2 = (n) => String(n).padStart(2, '0')

  const timeCore = h > 0
    ? `${pad2(h)}:${pad2(m)}:${pad2(s)}`
    : `${pad2(m)}:${pad2(s)}`

  if (!showFraction) return timeCore
  return `${timeCore}.${pad2(centi)}`
}
