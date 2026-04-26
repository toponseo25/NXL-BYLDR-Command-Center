'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface NxlHowToModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NxlHowToModal({ open, onOpenChange }: NxlHowToModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[440px] w-full p-7"
        style={{
          background: '#151515',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '12px',
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="text-sm font-bold"
            style={{ fontFamily: "'Space Mono', monospace", color: '#F0EEE8' }}
          >
            How to use your NXL BYLDR Command Center
          </DialogTitle>
          <DialogDescription className="text-xs" style={{ color: '#888780' }}>
            Built for busy business owners. Check in, check out.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-5 space-y-3.5">
          {/* Row 1 — Action Bar */}
          <div className="flex items-start gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0 mt-1"
              style={{ background: '#D6006E', animation: 'stepPulse 1.6s ease-in-out infinite' }}
            />
            <p className="text-xs leading-relaxed" style={{ color: '#888780' }}>
              <strong className="font-medium" style={{ color: '#F0EEE8' }}>Action Bar (top):</strong> If
              it&apos;s Magenta, we need something — an OTP, an approval, a quick OK. Handle it fast to keep
              your lead machine moving.
            </p>
          </div>

          {/* Row 2 — Magenta = done */}
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ background: '#D6006E' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#888780' }}>
              <strong className="font-medium" style={{ color: '#F0EEE8' }}>Magenta light = done.</strong>{' '}
              That step is finished. Nothing needed from you.
            </p>
          </div>

          {/* Row 3 — Grey = pending */}
          <div className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-1" style={{ background: '#333' }} />
            <p className="text-xs leading-relaxed" style={{ color: '#888780' }}>
              <strong className="font-medium" style={{ color: '#F0EEE8' }}>Grey light = pending.</strong>{' '}
              We haven&apos;t reached that stage yet.
            </p>
          </div>
        </div>

        {/* Tip box */}
        <div
          className="mt-5 rounded-r-lg p-3.5 text-xs leading-relaxed"
          style={{
            background: '#1E1E1E',
            borderLeft: '3px solid #D6006E',
            color: '#888780',
          }}
        >
          Your role: check once a day. If the top bar says &quot;All Systems Go&quot; — you&apos;re done. If
          it&apos;s Magenta — action needed. That&apos;s it.
        </div>

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="w-full mt-5 py-2.5 rounded-lg transition-all duration-200 cursor-pointer"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.14)',
            color: '#888780',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#D6006E'
            e.currentTarget.style.color = '#D6006E'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'
            e.currentTarget.style.color = '#888780'
          }}
        >
          Close
        </button>
      </DialogContent>
    </Dialog>
  )
}
