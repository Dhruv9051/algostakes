'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function LoginButton() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (error) {
      console.error(error.message)
      setLoading(false)
    }
  }

  return (
    <motion.button
      onClick={handleLogin}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.03 }}
      whileTap={{ scale: loading ? 1 : 0.97 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 28px',
        background: 'var(--em)',
        color: '#000',
        fontFamily: 'var(--font-display)',
        fontSize: '14px',
        fontWeight: 600,
        letterSpacing: '0.01em',
        border: 'none',
        borderRadius: 'var(--r-md)',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--em-l)' }}
      onMouseLeave={e => { (e.target as HTMLElement).style.background = 'var(--em)' }}
    >
      {loading ? (
        <>
          <svg
            width="14" height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{ animation: 'spin 0.8s linear infinite' }}
          >
            <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
            <path d="M7 1.5A5.5 5.5 0 0 1 12.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Connecting...
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Enter the Arena
        </>
      )}
    </motion.button>
  )
}