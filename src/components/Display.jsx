import { memo } from 'react'
import { formatTime } from '../utils/formatTime'

export const Display = memo(function Display({
  ms,
  showFraction = true,
  className = '',
  label,
  variant = 'hero',
}) {
  const text = formatTime(ms, { showFraction })
  const digitClass =
    variant === 'compact'
      ? 'font-display text-2xl tracking-tight text-white tabular-nums sm:text-3xl'
      : 'font-display text-4xl tracking-tight text-white tabular-nums sm:text-5xl md:text-6xl'

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      {label ? (
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          {label}
        </span>
      ) : null}
      <output className={`${digitClass}`} aria-live="polite">
        {text}
      </output>
    </div>
  )
})
