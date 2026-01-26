import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseClient } from '@/lib/supabaseServer'
import { calculateInsights } from '../../../../../lib/insightsCalculator'

// Cache insights for 5 minutes since they're calculated data
export const revalidate = 300

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { uploadId } = await params
    
    const supabase = getSupabaseClient()

    // Verify the upload belongs to this user
    const { data: upload, error: uploadError } = await supabase
      .from('uploads')
      .select('*')
      .eq('id', uploadId)
      .eq('clerk_user_id', userId)
      .single()

    if (uploadError) {
      console.error('Upload error:', uploadError, 'uploadId:', uploadId, 'userId:', userId)
    }

    if (uploadError || !upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      )
    }

    // Get trades for this upload (select only needed fields for performance)
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('id, symbol, entry_price, exit_price, pnl, trade_date, quantity, side')
      .eq('upload_id', uploadId)
      .order('trade_date', { ascending: false })

    if (tradesError) {
      console.error('Error fetching trades:', tradesError)
      return NextResponse.json(
        { error: 'Failed to fetch trades' },
        { status: 500 }
      )
    }

    // Get transactions for timing analysis (select only needed fields)
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('id, trade_id, symbol, side, quantity, price, exec_time')
      .eq('upload_id', uploadId)
      .order('exec_time', { ascending: false })

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError)
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      )
    }

    if (!trades || trades.length === 0) {
      return NextResponse.json(
        { error: 'No trades found in this upload' },
        { status: 400 }
      )
    }

    if (trades.length < 5) {
      return NextResponse.json(
        { error: 'Minimum 5 trades required for meaningful insights' },
        { status: 400 }
      )
    }

    // Calculate insights - pass both trades and transactions
    const insights = calculateInsights(trades, transactions || [])

    return NextResponse.json({
      success: true,
      insights,
      upload: {
        id: upload.id,
        filename: upload.filename,
        trade_count: trades.length,
        created_at: upload.created_at,
      },
    })

  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
