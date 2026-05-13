import { useCallback, useId, useMemo, useState } from 'react'
import { Bell, BellOff, Hourglass } from 'lucide-react'
import { Controls } from './Controls'
import { Display } from './Display'
import { useCountdownTimer } from '../hooks/useCountdownTimer'
import { notifyTimerComplete, playCompletionChime } from '../utils/timerCompleteFeedback'

const R = 52
const CIRC = 2 * Math.PI * R

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function parseSegment(raw, max) {
  const n = Number.parseInt(String(raw), 10)
  if (Number.isNaN(n)) return 0
  return clamp(n, 0, max)
}


function CountdownRing({ remainingMs, totalMs, className = '' }) {
  const reactId = useId()
  const gradId = `ring-${reactId.replace(/:/g, '')}`
  const denom = Math.max(1, totalMs)
  const ratio = clamp(remainingMs / denom, 0, 1)
  const offset = CIRC * (1 - ratio)

  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      role="img"
      aria-hidden
    >
      <circle
        cx="60"
        cy="60"
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="10"
      />
      <circle
        cx="60"
        cy="60"
        r={R}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
        className="transition-[stroke-dashoffset] duration-150 ease-linear"
      />
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function Timer() {
  const [h, setH] = useState(0)
  const [m, setM] = useState(1)
  const [s, setS] = useState(0)
  const [finished, setFinished] = useState(false)
  const [ringTotalMs, setRingTotalMs] = useState(60_000)

  const durationMs = useMemo(
    () => h * 3_600_000 + m * 60_000 + s * 1_000,
    [h, m, s],
  )

  const onComplete = useCallback(() => {
    setFinished(true)
    playCompletionChime()
    notifyTimerComplete('Timer finished', 'Your countdown reached zero.')
  }, [])

  const { remainingMs, isActive, start, pause, reset } = useCountdownTimer({
    durationMs,
    onComplete,
  })

  const inputsLocked = isActive || (remainingMs !== durationMs && remainingMs !== 0)

  const inSession = isActive || remainingMs !== durationMs
  const progressDenominator = inSession ? ringTotalMs : Math.max(durationMs, 1)

  const handleStart = () => {
    if (durationMs <= 0) return
    setFinished(false)
    setRingTotalMs(Math.max(remainingMs, 1))
    start()
  }

  const handleReset = () => {
    reset()
    setFinished(false)
    setRingTotalMs(Math.max(durationMs, 1))
  }

  const notifSupported = typeof Notification !== 'undefined'
  const notifEnabled = notifSupported && Notification.permission === 'granted'

  const requestNotifications = async () => {
    if (!notifSupported) return
    try {
      await Notification.requestPermission()
    } catch {
      /* ignore */
    }
  }

  return (
    <section
      className={`relative w-full max-w-lg overflow-hidden rounded-3xl border p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8 ${
        finished
          ? 'border-amber-400/40 bg-amber-500/10'
          : 'border-white/10 bg-white/5'
      }`}
      aria-labelledby="timer-heading"
    >
      <div className="pointer-events-none absolute -right-12 top-24 size-44 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-0 size-52 rounded-full bg-sky-500/10 blur-3xl" />

      <header className="relative mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-white/80">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-violet-200">
            <Hourglass className="size-5" aria-hidden />
          </span>
          <div className="text-left">
            <h2 id="timer-heading" className="text-base font-semibold text-white">
              Timer
            </h2>
            <p className="text-sm text-white/55">Countdown with ring progress</p>
          </div>
        </div>

        {notifSupported ? (
          <button
            type="button"
            onClick={requestNotifications}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 backdrop-blur hover:bg-white/10"
            title="Browser notifications when the timer hits zero"
          >
            {notifEnabled ? (
              <>
                <Bell className="size-4 text-emerald-300" aria-hidden />
                Notifications on
              </>
            ) : (
              <>
                <BellOff className="size-4" aria-hidden />
                Enable notifications
              </>
            )}
          </button>
        ) : null}
      </header>

      {finished ? (
        <p
          className="relative mb-4 rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-center text-sm font-medium text-amber-100"
          role="status"
        >
          Time is up — chime played. Reset to start again.
        </p>
      ) : null}

      <div className="relative mx-auto mb-6 flex max-w-[16rem] flex-col items-center gap-4">
        <div className="relative grid place-items-center">
          <CountdownRing
            remainingMs={remainingMs}
            totalMs={progressDenominator}
            className="size-52 sm:size-56"
          />
          <div className="absolute inset-0 grid place-items-center">
            <Display
              ms={remainingMs}
              showFraction
              variant="compact"
              className="gap-0"
            />
          </div>
        </div>
      </div>

      <fieldset className="relative mb-6 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-left">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-white/45">
          Set duration
        </legend>
        <label className="flex flex-col gap-1 text-xs text-white/55">
          Hours
          <input
            type="number"
            min={0}
            max={99}
            value={h}
            disabled={inputsLocked}
            onChange={(e) => setH(parseSegment(e.target.value, 99))}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-display text-lg text-white tabular-nums outline-none ring-cyan-400/40 focus:ring-2 disabled:opacity-45"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-white/55">
          Minutes
          <input
            type="number"
            min={0}
            max={59}
            value={m}
            disabled={inputsLocked}
            onChange={(e) => setM(parseSegment(e.target.value, 59))}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-display text-lg text-white tabular-nums outline-none ring-cyan-400/40 focus:ring-2 disabled:opacity-45"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-white/55">
          Seconds
          <input
            type="number"
            min={0}
            max={59}
            value={s}
            disabled={inputsLocked}
            onChange={(e) => setS(parseSegment(e.target.value, 59))}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 font-display text-lg text-white tabular-nums outline-none ring-cyan-400/40 focus:ring-2 disabled:opacity-45"
          />
        </label>
      </fieldset>

      <Controls
        isRunning={isActive}
        onStart={handleStart}
        onPause={pause}
        onReset={handleReset}
        startDisabled={durationMs <= 0}
        controlsLabel="Timer controls"
      />
    </section>
  )
}
