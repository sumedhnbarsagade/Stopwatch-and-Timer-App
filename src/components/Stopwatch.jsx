import { Clock } from 'lucide-react'
import { Controls } from './Controls'
import { Display } from './Display'
import { usePrecisionTimer } from '../hooks/usePrecisionTimer'

export function Stopwatch() {
  const { elapsedMs, isActive, start, pause, reset } = usePrecisionTimer()

  return (
    <section
      className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8"
      aria-labelledby="stopwatch-heading"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-violet-500/15 blur-3xl" />

      <header className="relative mb-6 flex items-center gap-2 text-white/80">
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-cyan-200">
          <Clock className="size-5" aria-hidden />
        </span>
        <div className="text-left">
          <h2 id="stopwatch-heading" className="text-base font-semibold text-white">
            Stopwatch
          </h2>
          <p className="text-sm text-white/55">Wall-clock accurate elapsed time</p>
        </div>
      </header>

      <Display ms={elapsedMs} className="relative mb-8" label="Elapsed" />

      <Controls
        isRunning={isActive}
        onStart={start}
        onPause={pause}
        onReset={reset}
      />
    </section>
  )
}
