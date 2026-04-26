'use client'

import { motion } from 'framer-motion'

interface NxlAlertBarProps {
  alertState: 'action' | 'clear'
  alertMessage: string
  onToggleState: (state: 'action' | 'clear') => void
}

export function NxlAlertBar({ alertState, alertMessage, onToggleState }: NxlAlertBarProps) {
  return (
    <motion.div
      layout
      className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 py-3 transition-colors duration-400"
      style={{
        background: alertState === 'action' ? '#D6006E' : '#1C1C1C',
        borderBottom: alertState === 'clear' ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {/* Pulsing dot */}
        <div
          className="w-2 h-2 rounded-full bg-white shrink-0"
          style={
            alertState === 'action'
              ? { animation: 'pulseAlert 1.2s ease-in-out infinite' }
              : {}
          }
        />
        <span
          className="truncate text-[11px] font-bold tracking-[0.09em] uppercase"
          style={{
            fontFamily: "'Space Mono', monospace",
            color: alertState === 'action' ? '#fff' : '#888780',
          }}
        >
          {alertMessage}
        </span>
      </div>

      <div className="flex gap-1.5 shrink-0 ml-4">
        {(['action', 'clear'] as const).map((state) => (
          <button
            key={state}
            onClick={() => onToggleState(state)}
            className="transition-all duration-200 cursor-pointer"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              padding: '5px 12px',
              borderRadius: '4px',
              border:
                alertState === 'action'
                  ? '1px solid rgba(255,255,255,0.2)'
                  : '1px solid rgba(255,255,255,0.14)',
              background:
                alertState === state
                  ? alertState === 'action'
                    ? 'rgba(255,255,255,0.22)'
                    : '#1E1E1E'
                  : alertState === 'action'
                    ? 'rgba(255,255,255,0.1)'
                    : 'transparent',
              color:
                alertState === state
                  ? alertState === 'action'
                    ? '#fff'
                    : '#888780'
                  : alertState === 'action'
                    ? 'rgba(255,255,255,0.6)'
                    : '#555450',
              borderColor:
                alertState === state && alertState === 'action'
                  ? 'rgba(255,255,255,0.5)'
                  : undefined,
            }}
          >
            {state === 'action' ? 'Action' : 'All Clear'}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
