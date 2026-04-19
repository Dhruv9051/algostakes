'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SlotMachine from './SlotMachine'
import Arena from './Arena'

type Problem = {
  id: string
  title: string
  description: string
  difficulty: string
  topic: string
  starter_codes: Record<string, string>
  sample_cases: Array<{ input: string; output: string }>
  constraints: string[]
}

export default function GameWrapper({ problemData }: { problemData: Problem }) {
  const [spun, setSpun] = useState(false)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {!spun ? (
          <motion.div
            key="slot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-base)',
            }}
          >
            <SlotMachine onFinish={() => setSpun(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="arena"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          >
            <Arena problem={problemData} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}