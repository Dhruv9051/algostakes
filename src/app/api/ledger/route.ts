import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, action } = await request.json()

    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('chip_balance')
      .eq('id', user.id)
      .single()

    if (fetchError || !userData) {
      return NextResponse.json({ error: 'User wallet not found' }, { status: 404 })
    }

    let newBalance = userData.chip_balance

    if (action === 'ADD') {
      newBalance += amount
    } else if (action === 'SUBTRACT') {
      newBalance = Math.max(0, newBalance - amount)
    } else if (action === 'WAGER') {
      const { error: wagerError } = await supabase
        .from('users')
        .update({
          wager_is_active: true,
          wager_amount: amount,
          last_wager_timestamp: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (wagerError) return NextResponse.json({ error: 'Wager lock failed' }, { status: 500 })
      return NextResponse.json({ success: true, message: 'Wager Locked' })
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ chip_balance: newBalance })
      .eq('id', user.id)

    if (updateError) {
      return NextResponse.json({ error: 'Ledger update failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, newBalance })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error: ' + (error as Error).message },
      { status: 500 }
    )
  }
}