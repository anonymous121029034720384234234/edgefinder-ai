import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { calculateInsights } from '@/lib/insightsCalculator'

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
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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

    // Get all trades for this upload
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .eq('upload_id', uploadId)
      .order('trade_date', { ascending: false })

    if (tradesError) {
      console.error('Error fetching trades:', tradesError)
      return NextResponse.json(
        { error: 'Failed to fetch trades' },
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

    // Calculate insights
    const insights = calculateInsights(trades)

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
