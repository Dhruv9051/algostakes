'use client'

import { createContext, useContext, useState } from 'react'

type CasinoContextType = {
  chips: number
  setChips: React.Dispatch<React.SetStateAction<number>>
  streak: number
  setStreak: React.Dispatch<React.SetStateAction<number>>
}

const CasinoContext = createContext<CasinoContextType | null>(null)

export function CasinoProvider({
  children,
  initialChips,
  initialStreak,
}: {
  children: React.ReactNode
  initialChips: number
  initialStreak: number
}) {
  const [chips, setChips]   = useState(initialChips)
  const [streak, setStreak] = useState(initialStreak)

  return (
    <CasinoContext.Provider value={{ chips, setChips, streak, setStreak }}>
      {children}
    </CasinoContext.Provider>
  )
}

export const useCasino = () => {
  const ctx = useContext(CasinoContext)
  if (!ctx) throw new Error('useCasino must be used within a CasinoProvider')
  return ctx
}