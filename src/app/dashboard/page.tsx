import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import GameWrapper from '@/components/GameWrapper'
import Header from '@/components/Header'
import { CasinoProvider } from '@/context/CasinoContext'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect('/')

  let { data: userData } = await supabase
    .from('users').select('*').eq('id', user.id).single()

  if (!userData) {
    const { data: newUser } = await supabase
      .from('users')
      .insert({
        id: user.id,
        username: user.user_metadata.user_name || user.email?.split('@')[0],
        chip_balance: 1000,
        current_streak: 0,
      })
      .select()
      .single()
    userData = newUser
  }

  const { data: problemData } = await supabase
    .from('problems')
    .select('*')
    .limit(1)
    .single()

  return (
    <CasinoProvider
      initialChips={userData?.chip_balance ?? 1000}
      initialStreak={userData?.current_streak ?? 0}
    >
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-base)',
          overflow: 'hidden',
        }}
      >
        <Header user={user} />

        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {problemData ? (
            <GameWrapper problemData={problemData} />
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--tx-3)',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '0.06em',
              }}
            >
              INITIALIZING ARENA...
            </div>
          )}
        </main>
      </div>
    </CasinoProvider>
  )
}