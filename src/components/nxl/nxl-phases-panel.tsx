'use client'

import { motion } from 'framer-motion'

const PHASES = [
  { key: 'handover', num: '01', name: 'The Handover', desc: 'Gathering your business info' },
  { key: 'game_plan', num: '02', name: 'The Game Plan', desc: 'Planning your lead strategy' },
  { key: 'technical', num: '03', name: 'Technical Foundation', desc: 'Building your ads and CRM sync' },
  { key: 'live', num: '04', name: 'Live & Running', desc: 'Getting you on job sites' },
] as const

type PhaseKey = 'handover' | 'game_plan' | 'technical' | 'live'

interface NxlPhasesPanelProps {
  currentPhase: string
}

function getPhaseStatus(phaseKey: string, currentPhase: string): 'done' | 'active' | 'pending' {
  const order: PhaseKey[] = ['handover', 'game_plan', 'technical', 'live']
  const currentIdx = order.indexOf(currentPhase as PhaseKey)
  const phaseIdx = order.indexOf(phaseKey as PhaseKey)

  if (phaseIdx < currentIdx) return 'done'
  if (phaseIdx === currentIdx) return 'active'
  return 'pending'
}

export function NxlPhasesPanel({ currentPhase }: NxlPhasesPanelProps) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: '#151515',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        className="mb-4 text-[10px] tracking-[0.12em] uppercase"
        style={{ fontFamily: "'Space Mono', monospace", color: '#555450' }}
      >
        Project Phases
      </div>

      {PHASES.map((phase, i) => {
        const status = getPhaseStatus(phase.key, currentPhase)

        return (
          <motion.div
            key={phase.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 rounded-lg p-3 mb-2 last:mb-0"
            style={{
              borderLeft: `3px solid ${status === 'pending' ? '#333' : '#D6006E'}`,
              border: `1px solid ${
                status === 'active'
                  ? 'rgba(214,0,110,0.3)'
                  : 'rgba(255,255,255,0.08)'
              }`,
              borderLeft: `3px solid ${status === 'pending' ? '#333' : '#D6006E'}`,
              background:
                status === 'active'
                  ? 'rgba(214,0,110,0.08)'
                  : status === 'done'
                    ? 'rgba(214,0,110,0.04)'
                    : 'transparent',
            }}
          >
            {/* Number */}
            <div
              className="min-w-[18px] shrink-0"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                color: '#555450',
              }}
            >
              {phase.num}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div
                className="text-[13px] font-medium"
                style={{ color: '#F0EEE8' }}
              >
                {phase.name}
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: '#888780' }}>
                {phase.desc}
              </div>
            </div>

            {/* Badge */}
            <span
              className="shrink-0 text-[9px] tracking-[0.06em] uppercase px-2.5 py-1 rounded"
              style={{
                fontFamily: "'Space Mono', monospace",
                ...(status === 'done'
                  ? { background: '#D6006E', color: '#fff' }
                  : status === 'active'
                    ? {
                        border: '1px solid #D6006E',
                        color: '#D6006E',
                        background: 'transparent',
                      }
                    : { background: '#222', color: '#555450' }),
              }}
            >
              {status === 'done' ? 'Complete' : status === 'active' ? 'In Progress' : 'Pending'}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
