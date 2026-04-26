'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NxlAlertBar } from './nxl-alert-bar'
import { NxlPhasesPanel } from './nxl-phases-panel'
import { NxlChecklistPanel } from './nxl-checklist-panel'
import { NxlFooterBar } from './nxl-footer-bar'
import { NxlHowToModal } from './nxl-how-to-modal'
import { ArrowLeft, LogOut } from 'lucide-react'

interface NxlProject {
  id: string
  projectName: string
  businessName: string
  ownerName: string
  ownerEmail: string
  phase: string
  alertState: string
  alertMessage: string
  checklistStep: number
  completedSteps: string
  createdAt: string
  updatedAt: string
}

export function NxlCommandCenter() {
  const [project, setProject] = useState<NxlProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [alertState, setAlertState] = useState<'action' | 'clear'>('clear')
  const [alertMessage, setAlertMessage] = useState('All Systems Go — Machine is on Schedule')
  const [howToOpen, setHowToOpen] = useState(false)

  // Fetch project data
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch('/api/nxl')
        if (res.ok) {
          const data = await res.json()
          setProject(data)
          setAlertState(data.alertState as 'action' | 'clear')
          setAlertMessage(data.alertMessage)
        }
      } catch (err) {
        console.error('Failed to fetch NXL project:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [])

  // Persist alert state to backend
  const persistAlertState = useCallback(async (state: 'action' | 'clear') => {
    setAlertState(state)
    if (!project) return

    const msg =
      state === 'action'
        ? 'ACTION REQUIRED: We need your OTP code for Facebook Ads'
        : 'All Systems Go — Machine is on Schedule'
    setAlertMessage(msg)

    try {
      await fetch('/api/nxl', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertState: state, alertMessage: msg }),
      })
    } catch {
      // Silent fail for alert state sync
    }
  }, [project])

  // Advance checklist step
  const handleAdvanceStep = useCallback(async (stepIndex: number) => {
    if (!project) return

    const completedArr = project.completedSteps
      .split(',')
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n))

    if (!completedArr.includes(stepIndex)) {
      completedArr.push(stepIndex)
      completedArr.sort((a, b) => a - b)

      const nextStep = stepIndex + 1
      const newCompleted = completedArr.join(',')
      const updates: Partial<NxlProject> = {
        completedSteps: newCompleted,
        checklistStep: nextStep < 13 ? nextStep : stepIndex,
      }

      // Auto-advance phase based on steps
      if (nextStep >= 10 && project.phase === 'technical') {
        updates.phase = 'live'
      } else if (nextStep >= 5 && project.phase === 'game_plan') {
        updates.phase = 'technical'
      } else if (nextStep >= 1 && project.phase === 'handover') {
        updates.phase = 'game_plan'
      }

      setProject({ ...project, ...updates })

      try {
        await fetch('/api/nxl', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        })
      } catch {
        // Silent fail
      }
    }
  }, [project])

  const completedCount = project
    ? project.completedSteps.split(',').filter((s) => s.trim() !== '').length
    : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: '#D6006E', animation: 'stepPulse 1.6s ease-in-out infinite' }}
          />
          <span className="text-xs" style={{ fontFamily: "'Space Mono', monospace", color: '#555450' }}>
            LOADING COMMAND CENTER...
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D', color: '#F0EEE8' }}>
      {/* Scanline texture overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          )`,
        }}
      />

      {/* Alert Bar */}
      <div className="relative z-10">
        <NxlAlertBar
          alertState={alertState}
          alertMessage={alertMessage}
          onToggleState={persistAlertState}
        />
      </div>

      {/* Main Page */}
      <div className="relative z-10 flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 pb-12">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between py-6 pb-5 mb-7 gap-4">
          <div>
            <div
              className="text-[10px] tracking-[0.14em] uppercase mb-1"
              style={{ fontFamily: "'Space Mono', monospace", color: '#D6006E' }}
            >
              VSUAL Digital Media · NXL BYLDR
            </div>
            <div
              className="text-xl sm:text-[22px] font-bold tracking-tight mb-1"
              style={{ fontFamily: "'Space Mono', monospace", color: '#F0EEE8' }}
            >
              NXL BYLDR Command Center
            </div>
            <div className="text-[13px]" style={{ color: '#888780' }}>
              Your central hub for tracking project status and lead activity.
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setHowToOpen(true)}
              className="transition-all duration-200 cursor-pointer whitespace-nowrap"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '9px 18px',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '8px',
                background: 'transparent',
                color: '#888780',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D6006E'
                e.currentTarget.style.color = '#D6006E'
                e.currentTarget.style.background = 'rgba(214,0,110,0.18)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                e.currentTarget.style.color = '#888780'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              How to use this Command Center →
            </button>

            <button
              onClick={() => (window.location.href = '/')}
              className="flex items-center gap-1.5 transition-all duration-200 cursor-pointer"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '9px 14px',
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: '8px',
                background: 'transparent',
                color: '#888780',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D6006E'
                e.currentTarget.style.color = '#D6006E'
                e.currentTarget.style.background = 'rgba(214,0,110,0.18)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
                e.currentTarget.style.color = '#888780'
                e.currentTarget.style.background = 'transparent'
              }}
              title="Back to Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Main Grid */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"
          >
            <NxlPhasesPanel currentPhase={project?.phase ?? 'game_plan'} />
            <NxlChecklistPanel
              completedSteps={project?.completedSteps ?? '0,1,2,3'}
              checklistStep={project?.checklistStep ?? 4}
              onAdvanceStep={handleAdvanceStep}
            />
          </motion.div>
        </AnimatePresence>

        {/* Footer Bar */}
        <NxlFooterBar completedCount={completedCount} />
      </div>

      {/* How To Modal */}
      <NxlHowToModal open={howToOpen} onOpenChange={setHowToOpen} />
    </div>
  )
}
