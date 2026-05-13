import { useState } from 'react'
import { Clock, Hourglass } from 'lucide-react'
import { Stopwatch } from './components/Stopwatch'
import { Timer } from './components/Timer'

export default function App() {
  const [mode, setMode] = useState('stopwatch')

  return (
    <div className="min-h-dvh bg-zinc-950 bg-[radial-gradient(ellipse_at_top,_#1e293b_0%,_#020617_55%,_#020617_100%)] text-white">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
            ChaiCode
          </p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Stopwatch & Timer
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-white/60 sm:text-base">
          A simple stopwatch and timer app built with React and Tailwind CSS.
          </p>
        </header>

        <div
          className="mb-8 flex justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1.5 backdrop-blur-md sm:inline-flex sm:self-center"
          role="tablist"
          aria-label="Mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'stopwatch'}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              mode === 'stopwatch'
                ? 'bg-white/15 text-white shadow-lg shadow-black/30'
                : 'text-white/55 hover:bg-white/5 hover:text-white'
            }`}
            onClick={() => setMode('stopwatch')}
          >
            <Clock className="size-4" aria-hidden />
            Stopwatch
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'timer'}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              mode === 'timer'
                ? 'bg-white/15 text-white shadow-lg shadow-black/30'
                : 'text-white/55 hover:bg-white/5 hover:text-white'
            }`}
            onClick={() => setMode('timer')}
          >
            <Hourglass className="size-4" aria-hidden />
            Timer
          </button>
        </div>

        <main className="flex flex-1 flex-col items-center justify-center pb-12">
          {mode === 'stopwatch' ? <Stopwatch /> : <Timer />}
        </main>

        <footer className="mt-auto border-t border-white/10 pt-6 text-center text-xs text-white/40">
        © 2026. All Rights Reserved
        </footer>
      </div>
    </div>
  )
}
