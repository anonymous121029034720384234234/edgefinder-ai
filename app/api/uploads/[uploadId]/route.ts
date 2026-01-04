import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
  request: NextRequest,
  { params }: { params: { uploadId: string } }
) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // First verify the upload belongs to this user
    const { data: upload, error: uploadError } = await supabase
      .from('uploads')
      .select('id')
      .eq('id', params.uploadId)
      .eq('clerk_user_id', userId)
      .single()

    if (uploadError || !upload) {
      return NextResponse.json(
        { error: 'Upload not found or unauthorized' },
        { status: 404 }
      )
    }

    // Get trades for this upload
    const { data: trades, error: tradesError } = await supabase
      .from('trades')
      .select('*')
      .eq('upload_id', params.uploadId)
      .order('trade_date', { ascending: true })

    if (tradesError) {
      console.error('Error fetching trades:', tradesError)
      return NextResponse.json(
        { error: 'Failed to fetch trades' },
        { status: 500 }
      )
    }

    return NextResponse.json({ trades }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
