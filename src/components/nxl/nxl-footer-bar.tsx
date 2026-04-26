'use client'

export function NxlFooterBar({ completedCount }: { completedCount: number }) {
  return (
    <div
      className="flex flex-wrap items-center gap-4 sm:gap-5 rounded-xl px-5 py-3"
      style={{
        background: '#151515',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Completed legend */}
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#D6006E' }} />
        <span
          className="text-[10px] tracking-[0.06em] uppercase"
          style={{ fontFamily: "'Space Mono', monospace", color: '#555450' }}
        >
          Completed
        </span>
      </div>

      {/* In progress legend */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: '#D6006E', animation: 'stepPulse 1.6s ease-in-out infinite' }}
        />
        <span
          className="text-[10px] tracking-[0.06em] uppercase"
          style={{ fontFamily: "'Space Mono', monospace", color: '#555450' }}
        >
          In progress
        </span>
      </div>

      {/* Pending legend */}
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: '#333' }} />
        <span
          className="text-[10px] tracking-[0.06em] uppercase"
          style={{ fontFamily: "'Space Mono', monospace", color: '#555450' }}
        >
          Pending
        </span>
      </div>

      {/* Progress count */}
      <div
        className="ml-auto text-[11px]"
        style={{ fontFamily: "'Space Mono', monospace", color: '#888780' }}
      >
        <span style={{ color: '#D6006E', fontWeight: 700 }}>{completedCount}</span>
        {' / 13 steps complete'}
      </div>
    </div>
  )
}
