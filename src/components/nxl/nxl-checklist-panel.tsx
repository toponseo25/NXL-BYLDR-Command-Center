'use client'

import { motion } from 'framer-motion'

const CHECKLIST_STEPS = [
  'Initial onboarding call',
  'Business info submitted',
  'Facebook page access granted',
  'Ad account created',
  'OTP verification — Facebook',
  'Audience research complete',
  'Ad creative designed',
  'Ad copy written & approved',
  'CRM sync configured',
  'Lead notifications tested',
  'Landing page live',
  'Test campaign launched',
  'Full campaign live',
] as const

interface NxlChecklistPanelProps {
  completedSteps: string
  checklistStep: number
  onAdvanceStep: (stepIndex: number) => void
}

export function NxlChecklistPanel({ completedSteps, checklistStep, onAdvanceStep }: NxlChecklistPanelProps) {
  const completedSet = new Set(completedSteps.split(',').map((s) => parseInt(s.trim())).filter((n) => !isNaN(n)))

  const getStepStatus = (index: number): 'done' | 'active' | 'pending' => {
    if (completedSet.has(index)) return 'done'
    if (index === checklistStep) return 'active'
    return 'pending'
  }

  const completedCount = completedSet.size

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
        Setup Progress — 13 Steps
      </div>

      <div className="max-h-[420px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
        {CHECKLIST_STEPS.map((step, i) => {
          const status = getStepStatus(i)

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2.5 cursor-pointer py-2"
              style={{
                borderBottom: i < CHECKLIST_STEPS.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}
              onClick={() => {
                if (status === 'pending' && i === checklistStep) {
                  onAdvanceStep(i)
                }
              }}
              title={
                status === 'active'
                  ? 'Click to mark as complete'
                  : status === 'pending'
                    ? i === checklistStep
                      ? 'Click to mark as complete'
                      : 'Waiting for previous steps'
                    : 'Step completed'
              }
            >
              {/* Status light */}
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  background: status === 'pending' ? '#333' : '#D6006E',
                  animation: status === 'active' ? 'stepPulse 1.6s ease-in-out infinite' : 'none',
                }}
              />

              {/* Step name */}
              <span
                className="flex-1 text-[12px] min-w-0"
                style={{
                  color: status === 'done' ? '#555450' : '#F0EEE8',
                  textDecoration: status === 'done' ? 'line-through' : 'none',
                  textDecorationColor: status === 'done' ? '#333' : undefined,
                }}
              >
                {step}
              </span>

              {/* Step index */}
              <span
                className="shrink-0 text-[10px]"
                style={{ fontFamily: "'Space Mono', monospace", color: '#555450' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
            </motion.div>
          )
        })}
      </div>

      <div
        className="mt-4 pt-3 text-[11px] tracking-wide"
        style={{
          fontFamily: "'Space Mono', monospace",
          color: '#888780',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <span style={{ color: '#D6006E', fontWeight: 700 }}>{completedCount}</span>
        {' / 13 steps complete'}
      </div>
    </div>
  )
}
