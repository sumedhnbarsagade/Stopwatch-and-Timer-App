import { Pause, Play, RotateCcw } from 'lucide-react'

const baseBtn =
  'inline-flex min-h-11 min-w-[6.5rem] flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[7rem] sm:flex-none'

const themes = {
  start: `${baseBtn} bg-emerald-400/90 text-emerald-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-300 focus-visible:outline-emerald-200`,
  pause: `${baseBtn} bg-amber-400/90 text-amber-950 shadow-lg shadow-amber-500/20 hover:bg-amber-300 focus-visible:outline-amber-200`,
  reset: `${baseBtn} border border-white/15 bg-white/5 text-white/90 backdrop-blur hover:bg-white/10 focus-visible:outline-white/40`,
}

/**
 * @param {{
 *   isRunning: boolean,
 *   onStart: () => void,
 *   onPause: () => void,
 *   onReset: () => void,
 *   startDisabled?: boolean,
 *   resetDisabled?: boolean,
 *   controlsLabel?: string,
 * }} props
 */
export function Controls({
  isRunning,
  onStart,
  onPause,
  onReset,
  startDisabled = false,
  resetDisabled = false,
  controlsLabel = 'Playback controls',
}) {
  return (
    <div
      className="flex w-full flex-wrap items-stretch justify-center gap-3 sm:flex-nowrap"
      role="group"
      aria-label={controlsLabel}
    >
      <button
        type="button"
        className={themes.start}
        onClick={onStart}
        disabled={startDisabled || isRunning}
      >
        <Play className="size-4 shrink-0" aria-hidden />
        Start
      </button>
      <button
        type="button"
        className={themes.pause}
        onClick={onPause}
        disabled={!isRunning}
        aria-pressed={isRunning}
      >
        <Pause className="size-4 shrink-0" aria-hidden />
        Pause
      </button>
      <button
        type="button"
        className={themes.reset}
        onClick={onReset}
        disabled={resetDisabled}
      >
        <RotateCcw className="size-4 shrink-0" aria-hidden />
        Reset
      </button>
    </div>
  )
}
