'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { soundEngine } from '@/utils/soundEngine'

const TOPICS    = ['Arrays', 'Strings', 'DP', 'Trees', 'Graphs', 'Stacks', 'Heaps', 'BFS/DFS']
const DIFFS     = ['Easy', 'Medium', 'Hard']
const COMPANIES = ['Google', 'Meta', 'Amazon', 'Netflix', 'Apple', 'Microsoft']

export type SpinResult = { topic: string; diff: string; company: string }

type ReelConfig = {
  label: string
  key: keyof SpinResult
  items: string[]
  accentColor: string
  accentBg: string
}

const REELS: ReelConfig[] = [
  { label: 'Topic',      key: 'topic',   items: TOPICS,    accentColor: 'var(--em)',   accentBg: 'rgba(16,185,129,0.08)' },
  { label: 'Difficulty', key: 'diff',    items: DIFFS,     accentColor: 'var(--or)',   accentBg: 'rgba(249,115,22,0.08)' },
  { label: 'Company',    key: 'company', items: COMPANIES, accentColor: 'var(--pu-l)', accentBg: 'rgba(139,92,246,0.08)' },
]

export default function SlotMachine({ onFinish }: { onFinish: (result: SpinResult) => void }) {
  const [spinning, setSpinning] = useState(false)
  const [values, setValues] = useState<SpinResult>({ topic: '—', diff: '—', company: '—' })

  const spinReel = (
    items: string[],
    setter: (v: string) => void,
    duration: number
  ): Promise<string> => {
    let i = 0
    const iv = setInterval(() => {
      setter(items[i % items.length])
      soundEngine.playTick()
      i++
    }, 90)
    return new Promise(resolve => {
      setTimeout(() => {
        clearInterval(iv)
        const final = items[Math.floor(Math.random() * items.length)]
        setter(final)
        soundEngine.playDing()
        resolve(final)
      }, duration)
    })
  }

  const handleSpin = async () => {
    if (spinning) return
    setSpinning(true)

    const [topic, diff, company] = await Promise.all([
      spinReel(TOPICS,    v => setValues(p => ({ ...p, topic: v })),   1800),
      spinReel(DIFFS,     v => setValues(p => ({ ...p, diff: v })),    2600),
      spinReel(COMPANIES, v => setValues(p => ({ ...p, company: v })), 3400),
    ])

    const result = { topic, diff, company }
    setValues(result)
    setTimeout(() => {
      setSpinning(false)
      onFinish(result)
    }, 600)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', maxWidth: '520px', padding: '0 16px' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '32px',
            fontWeight: 700,
            letterSpacing: '-0.035em',
            color: 'var(--tx-1)',
            marginBottom: '8px',
          }}
        >
          Spin the Realm
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--tx-3)', lineHeight: 1.5 }}>
          Each spin reveals a unique algorithmic challenge
        </p>
      </div>

      {/* Reels */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '28px',
        }}
      >
        {REELS.map(reel => (
          <div
            key={reel.key}
            style={{
              background: 'var(--bg-surface)',
              border: `1px solid ${spinning ? reel.accentBg.replace('0.08', '0.3') : 'var(--border)'}`,
              borderRadius: 'var(--r-lg)',
              padding: '20px 12px',
              textAlign: 'center',
              transition: 'border-color 0.3s',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top shimmer */}
            <div
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                background: `linear-gradient(90deg, transparent, ${reel.accentColor}40, transparent)`,
                opacity: spinning ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            />

            <div className="label" style={{ marginBottom: '14px' }}>{reel.label}</div>

            <AnimatePresence mode="wait">
              <motion.div
                key={values[reel.key]}
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: 0.1 }}
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: spinning ? reel.accentColor : 'var(--tx-1)',
                  minHeight: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.15s',
                }}
              >
                {values[reel.key]}
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Spin button */}
      <div style={{ textAlign: 'center' }}>
        <motion.button
          onClick={handleSpin}
          disabled={spinning}
          whileHover={{ scale: spinning ? 1 : 1.03 }}
          whileTap={{ scale: spinning ? 1 : 0.97 }}
          style={{
            padding: '13px 40px',
            background: spinning ? 'var(--bg-overlay)' : 'var(--em)',
            color: spinning ? 'var(--tx-2)' : '#000',
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            border: spinning ? '1px solid var(--border-md)' : 'none',
            borderRadius: 'var(--r-md)',
            cursor: spinning ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            minWidth: '180px',
          }}
        >
          {spinning ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <svg
                width="14" height="14"
                viewBox="0 0 14 14"
                fill="none"
                style={{ animation: 'spin 0.7s linear infinite' }}
              >
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Spinning...
            </span>
          ) : (
            'Pull Lever'
          )}
        </motion.button>
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '11px',
          color: 'var(--tx-3)',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.04em',
        }}
      >
        Ready to face your algorithm adversary?
      </p>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  )
}