import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import { CasinoProvider } from '@/context/CasinoContext'

export const dynamic = 'force-dynamic'

function getTier(chips: number) {
  if (chips >= 50000) return { name: 'The House', cls: 'badge-house' }
  if (chips >= 10000) return { name: 'High Roller', cls: 'badge-roller' }
  if (chips >= 5000)  return { name: 'Elite', cls: 'badge-elite' }
  return { name: 'Degen', cls: 'badge-degen' }
}

function getRankStyle(i: number): React.CSSProperties {
  if (i === 0) return { color: '#f59e0b', fontWeight: 600 }
  if (i === 1) return { color: '#94a3b8', fontWeight: 600 }
  if (i === 2) return { color: '#f97316', fontWeight: 600 }
  return { color: 'var(--tx-3)' }
}

export default async function LeaderboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: currentUser } = await supabase
    .from('users').select('*').eq('id', user.id).single()

  const { data: topPlayers } = await supabase
    .from('users')
    .select('username, chip_balance, current_streak')
    .order('chip_balance', { ascending: false })
    .limit(10)

  return (
    <CasinoProvider
      initialChips={currentUser?.chip_balance || 0}
      initialStreak={currentUser?.current_streak || 0}
    >
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
        <Header user={user} />

        <main
          style={{
            flex: 1,
            padding: '40px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Ambient top glow */}
          <div
            style={{
              position: 'fixed',
              top: 0, left: '50%',
              transform: 'translateX(-50%)',
              width: '600px', height: '200px',
              background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.07) 0%, transparent 70%)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          <div style={{ width: '100%', maxWidth: '720px', position: 'relative', zIndex: 1 }}>

            {/* Page header */}
            <div style={{ marginBottom: '28px' }}>
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 700,
                  letterSpacing: '-0.035em',
                  color: 'var(--tx-1)',
                  marginBottom: '4px',
                }}
              >
                The High Table
              </h2>
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--tx-3)',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Top 10 global bankrolls
              </p>
            </div>

            {/* Table card */}
            <div className="card">
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                }}
              >
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['#', 'Player', 'Tier', 'Bankroll'].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: '12px 16px',
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--tx-3)',
                          textAlign: i === 2 ? 'center' : i === 3 ? 'right' : 'left',
                          background: 'var(--bg-raised)',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topPlayers?.map((player, index) => {
                    const tier = getTier(player.chip_balance)
                    return (
                      <tr
                        key={index}
                        style={{
                          borderBottom: index < (topPlayers.length - 1) ? '1px solid var(--border)' : 'none',
                          transition: 'background 0.1s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        {/* Rank */}
                        <td style={{ padding: '14px 16px', width: '52px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '13px',
                              ...getRankStyle(index),
                            }}
                          >
                            #{index + 1}
                          </span>
                        </td>

                        {/* Player */}
                        <td style={{ padding: '14px 16px' }}>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: 'var(--tx-1)',
                              marginBottom: '3px',
                            }}
                          >
                            {player.username}
                          </div>
                          {player.current_streak > 0 && (
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--or)',
                                fontFamily: 'var(--font-mono)',
                                fontWeight: 500,
                              }}
                            >
                              🔥 {player.current_streak}d streak
                            </div>
                          )}
                        </td>

                        {/* Tier */}
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span className={`badge ${tier.cls}`}>{tier.name}</span>
                        </td>

                        {/* Bankroll */}
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: 'var(--em)',
                            }}
                          >
                            🪙 {player.chip_balance.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </CasinoProvider>
  )
}