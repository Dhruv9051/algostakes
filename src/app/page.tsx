'use client'

import LoginButton from '@/components/LoginButton'
import { motion } from 'framer-motion'

const features = [
  { icon: '⚡', title: 'Instant execution', desc: 'Judge0-powered sandbox. Real feedback in milliseconds.' },
  { icon: '🎲', title: 'Daily spin', desc: 'Random topic, difficulty, and company every session.' },
  { icon: '💰', title: 'Earn chips', desc: 'Win, wager, and climb the high table.' },
]

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[380px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.09) 0%, transparent 68%)',
          }}
        />
        <div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[500px] h-[250px]"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(139,92,246,0.07) 0%, transparent 65%)',
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl flex flex-col items-center text-center gap-8">

        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase"
            style={{
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              color: 'var(--em)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--em)', animation: 'pulse-dot 1.5s ease infinite' }}
            />
            Arena is live
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-3"
        >
          <h1
            style={{
              fontSize: 'clamp(44px, 9vw, 68px)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 1.0,
              color: 'var(--tx-1)',
            }}
          >
            Code.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, var(--em) 0%, var(--pu-l) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Compete.
            </span>{' '}
            Climb.
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--tx-2)', lineHeight: 1.65, maxWidth: '380px', margin: '0 auto' }}>
            The high-stakes arena where algorithmic skill meets casino psychology.
            Solve daily challenges, wager your chips, and own the leaderboard.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <LoginButton />
        </motion.div>

        {/* Feature grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.08 }}
              style={{
                padding: '16px',
                borderRadius: 'var(--r-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                textAlign: 'left',
              }}
            >
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>{f.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--tx-1)', marginBottom: '4px' }}>
                {f.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--tx-3)', lineHeight: 1.55 }}>{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ fontSize: '11px', color: 'var(--tx-3)', fontFamily: 'var(--font-mono)' }}
        >
          Sign in with GitHub · No setup required
        </motion.p>
      </div>
    </main>
  )
}