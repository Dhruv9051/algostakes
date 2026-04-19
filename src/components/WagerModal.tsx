'use client'

import { motion, AnimatePresence } from 'framer-motion'

type WagerModalProps = {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
  winnings: number
}

export default function WagerModal({ isOpen, onAccept, onDecline, winnings }: WagerModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 40,
            }}
          />

          {/* Modal wrapper — contributes real layout height */}
          <div
            style={{
              position: 'fixed', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 50, padding: '20px',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 8 }}
              transition={{ type: 'spring', damping: 22, stiffness: 320 }}
              style={{
                width: '100%',
                maxWidth: '380px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-md)',
                borderRadius: 'var(--r-xl)',
                padding: '28px',
                pointerEvents: 'auto',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent)',
                }}
              />

              {/* Icon */}
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: '48px', height: '48px',
                  borderRadius: 'var(--r-md)',
                  background: 'rgba(16,185,129,0.1)',
                  border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px',
                  margin: '0 auto 20px',
                }}
              >
                🏆
              </motion.div>

              {/* Title */}
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  letterSpacing: '-0.03em',
                  textAlign: 'center',
                  color: 'var(--tx-1)',
                  marginBottom: '6px',
                }}
              >
                Execution Optimal
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--tx-3)', textAlign: 'center', marginBottom: '20px' }}>
                Your algorithm conquered the challenge
              </p>

              {/* Winnings */}
              <div
                style={{
                  background: 'rgba(16,185,129,0.05)',
                  border: '1px solid rgba(16,185,129,0.15)',
                  borderRadius: 'var(--r-md)',
                  padding: '16px',
                  textAlign: 'center',
                  marginBottom: '16px',
                }}
              >
                <div className="label" style={{ marginBottom: '8px' }}>Chips earned</div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--gold)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  🪙 {winnings.toLocaleString()}
                </div>
              </div>

              {/* Wager breakdown */}
              <div
                style={{
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r-md)',
                  padding: '14px',
                  marginBottom: '18px',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--tx-2)',
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>The Daily Wager</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--tx-3)', lineHeight: 1.55, marginBottom: '12px' }}>
                  Risk your{' '}
                  <span style={{ color: 'var(--em)', fontWeight: 600 }}>
                    {winnings.toLocaleString()} chips
                  </span>{' '}
                  to lock your streak for tomorrow.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--r-sm)',
                      background: 'rgba(16,185,129,0.07)',
                      border: '1px solid rgba(16,185,129,0.18)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--em)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Win</div>
                    <div style={{ fontSize: '11px', color: 'var(--tx-3)' }}>Double chips</div>
                  </div>
                  <div
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--r-sm)',
                      background: 'rgba(244,63,94,0.06)',
                      border: '1px solid rgba(244,63,94,0.15)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--rose)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>Lose</div>
                    <div style={{ fontSize: '11px', color: 'var(--tx-3)' }}>Lose it all</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={onAccept}
                  style={{
                    padding: '13px',
                    background: 'var(--em)',
                    color: '#000',
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    border: 'none',
                    borderRadius: 'var(--r-md)',
                    cursor: 'pointer',
                    transition: 'background 0.15s, transform 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--em-l)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--em)')}
                  onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
                  onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  Wager &amp; Lock Streak
                </button>
                <button
                  onClick={onDecline}
                  style={{
                    padding: '12px',
                    background: 'transparent',
                    color: 'var(--tx-2)',
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    fontWeight: 500,
                    border: '1px solid var(--border-md)',
                    borderRadius: 'var(--r-md)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--bg-overlay)'
                    e.currentTarget.style.color = 'var(--tx-1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--tx-2)'
                  }}
                >
                  Cash Out Safe
                </button>
              </div>

              <p
                style={{
                  textAlign: 'center',
                  marginTop: '14px',
                  fontSize: '11px',
                  color: 'var(--tx-3)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Choose wisely. Your streak awaits.
              </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}