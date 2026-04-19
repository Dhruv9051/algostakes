'use client'

import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCasino } from '@/context/CasinoContext'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { motion } from 'framer-motion'

type HeaderProps = { user: User }

export default function Header({ user }: HeaderProps) {
  const { chips, streak } = useCasino()
  const pathname = usePathname()

  const isArena = pathname.startsWith('/dashboard')
  const isBoard = pathname.startsWith('/leaderboard')

  return (
    <header
      style={{
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Bottom accent line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.3) 40%, rgba(139,92,246,0.3) 60%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <span
          style={{
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, var(--em) 0%, var(--pu-l) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            userSelect: 'none',
          }}
        >
          AlgoStakes
        </span>
      </motion.div>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: '2px', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        {[
          { href: '/dashboard', label: 'Arena', active: isArena },
          { href: '/leaderboard', label: 'High Table', active: isBoard },
        ].map(({ href, label, active }) => (
          <Link
            key={href}
            href={href}
            style={{
              padding: '5px 14px',
              borderRadius: 'var(--r-sm)',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.15s',
              background: active ? 'rgba(16,185,129,0.09)' : 'transparent',
              color: active ? 'var(--em)' : 'var(--tx-3)',
              border: active ? '1px solid rgba(16,185,129,0.18)' : '1px solid transparent',
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Streak */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--r-sm)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
          }}
        >
          <span style={{ fontSize: '12px' }}>🔥</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--or)' }}>
            {streak}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--tx-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            streak
          </span>
        </div>

        {/* Bankroll */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: 'var(--r-sm)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
          }}
        >
          <span style={{ fontSize: '12px' }}>🪙</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--em)' }}>
            {chips.toLocaleString()}
          </span>
        </div>

        {/* Avatar */}
        <Image
          src={user.user_metadata.avatar_url}
          alt="Profile"
          width={32}
          height={32}
          style={{
            borderRadius: 'var(--r-sm)',
            border: '1px solid var(--border-md)',
            objectFit: 'cover',
          }}
        />
      </div>
    </header>
  )
}