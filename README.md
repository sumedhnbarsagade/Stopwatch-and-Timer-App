# Stopwatch & Timer

A small **React** app with a stopwatch and a countdown timer. Time is driven by **wall-clock deltas** (`Date.now()`), so the display stays accurate across pauses and tab throttling. UI uses **Tailwind CSS v4**, **Lucide** icons, and a glass-style layout.

## Features

| Mode        | What you get |
|------------|----------------|
| **Stopwatch** | Start, Pause, Reset; elapsed time with centiseconds |
| **Timer**     | Hours / minutes / seconds inputs; circular progress ring; Start, Pause, Reset |
| **Timer done** | On-screen message, optional **chime** (Web Audio), optional **browser notifications** (after you allow them) |

## Tech stack

- [Vite](https://vite.dev/) + [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- [Lucide React](https://lucide.dev/) for icons

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build   # production bundle
npm run preview # serve dist locally
npm run lint    # ESLint
```

## Project layout

```text
src/
├── App.jsx                 # Mode tabs (Stopwatch ↔ Timer)
├── components/
│   ├── Controls.jsx        # Start, Pause, Reset
│   ├── Display.jsx         # Memoized time readout
│   ├── Stopwatch.jsx
│   └── Timer.jsx           # Inputs, ring, notification toggle
├── hooks/
│   ├── usePrecisionTimer.js   # Stopwatch engine (rAF + wall time)
│   └── useCountdownTimer.js   # Countdown engine + onComplete
└── utils/
    ├── formatTime.js          # MM:SS.cc / HH:MM:SS.cc
    └── timerCompleteFeedback.js
```

## Behavior notes

- **Stopwatch**: Elapsed time = accumulated paused time + time since the current run segment started. While running, the UI updates on `requestAnimationFrame`.
- **Timer**: While running, the end timestamp is `Date.now() + remaining`, so the countdown catches up if the tab was in the background.
- **Inputs**: H/M/S fields are locked while the timer is running or paused mid-session (change duration after **Reset**, or when the display matches your full duration again).

## License

Private project (see `package.json`).
