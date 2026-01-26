import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseClient } from '@/lib/supabaseServer'

// Cache trades for 60 seconds
export const revalidate = 60

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = getSupabaseClient()

    // Get all uploads for this user
    const { data: uploads, error: uploadsError } = await supabase
      .from('uploads')
      .select('id')
      .eq('clerk_user_id', userId)

    if (uploadsError) {
      console.error('Error fetching uploads:', uploadsError)
      return NextResponse.json(
        { error: 'Failed to fetch uploads' },
        { status: 500 }
      )
    }

    const uploadIds = uploads?.map(u => u.id) || []

    if (uploadIds.length === 0) {
      return NextResponse.json({ trades: [] }, { status: 200 })
    }

    // Get trades from these uploads - limit to recent trades for performance
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .in('upload_id', uploadIds)
      .order('trade_date', { ascending: false })
      .limit(1000) // Limit to last 1000 trades for performance

    if (tradesError) {
      console.error('Error fetching trades:', tradesError)
      return NextResponse.json(
        { error: 'Failed to fetch trades' },
        { status: 500 }
      )
    }

    return NextResponse.json({ trades: trades || [] }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
