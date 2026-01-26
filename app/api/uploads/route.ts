import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getSupabaseClient } from '@/lib/supabaseServer'

// Cache uploads for 60 seconds
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

    // Get uploads for this user only - select only needed fields for performance
    const { data: uploads, error: uploadsError } = await supabase
      .from('uploads')
      .select('id, filename, trade_count, status, created_at')
      .eq('clerk_user_id', userId)
      .order('created_at', { ascending: false })
      .limit(100) // Limit to 100 most recent uploads

    if (uploadsError) {
      console.error('Error fetching uploads:', uploadsError)
      return NextResponse.json(
        { error: 'Failed to fetch uploads' },
        { status: 500 }
      )
    }

    return NextResponse.json({ uploads }, { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
