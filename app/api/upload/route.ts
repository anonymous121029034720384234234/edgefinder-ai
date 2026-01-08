import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { parseTradeFile } from '@/lib/fileParser'
import { createClient } from '@supabase/supabase-js'

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    // Get user from Clerk
    const { userId } = await auth()

    if (!userId) {
      console.error('No user ID from Clerk')
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    console.log('Upload initiated by user:', userId)

    // Get file from request
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' },
        { status: 413 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    // Parse the file
    const trades = await parseTradeFile(fileBuffer, file.name)

    if (!trades || trades.length === 0) {
      return NextResponse.json(
        { error: 'No valid trades found in file' },
        { status: 400 }
      )
    }

    // Initialize Supabase client with service role key for server-side operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create upload record in Supabase (associated with clerk_user_id)
    const { data: uploadRecord, error: uploadError } = await supabase
      .from('uploads')
      .insert({
        clerk_user_id: userId, // Always associate with current user
        filename: file.name,
        trade_count: trades.length,
        status: 'parsed',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (uploadError) {
      console.error('Upload record error:', uploadError)
      return NextResponse.json(
        { error: `Failed to create upload record: ${uploadError.message}` },
        { status: 500 }
      )
    }

    console.log('Upload record created:', uploadRecord.id)

    // Insert trade data into Supabase
    const tradesWithUploadId = trades.map((trade) => {
      // Validate and ensure trade_date is a valid ISO string
      let validDate = new Date().toISOString()
      try {
        const dateObj = new Date(trade.trade_date)
        if (!isNaN(dateObj.getTime())) {
          validDate = dateObj.toISOString()
        }
      } catch (e) {
        console.warn('Invalid date:', trade.trade_date)
      }
      
      // Create a clean copy of raw_data, excluding processed fields
      const { 
        trade_date: _, 
        entry_price: __,
        exit_price: ___,
        pnl: ____,
        side: _____,
        quantity: ______,
        commission: _______,
        platform: ________,
        raw_price: _________,
        raw_buy_data,
        raw_sell_data,
        ...cleanRawData 
      } = trade
      
      return {
        upload_id: uploadRecord.id,
        symbol: String(trade.symbol || 'UNKNOWN'),
        entry_price: Number(trade.entry_price) || 0,
        exit_price: Number(trade.exit_price) || 0,
        pnl: Number(trade.pnl) || 0,
        trade_date: validDate,
        quantity: Number(trade.quantity) || 0,
        platform: trade.platform || 'Unknown',
        raw_data: {
          ...cleanRawData,
          ...(raw_buy_data && { buy_transaction: raw_buy_data }),
          ...(raw_sell_data && { sell_transaction: raw_sell_data }),
        },
      }
    })

    // Store buy/sell data separately for transactions table
    const transactionDataMap = new Map<number, { buy: any; sell: any }>()
    trades.forEach((trade, idx) => {
      transactionDataMap.set(idx, {
        buy: trade.raw_buy_data,
        sell: trade.raw_sell_data,
      })
    })

    const { data: insertedTrades, error: tradesError } = await supabase
      .from('trades')
      .insert(tradesWithUploadId)
      .select()

    if (tradesError) {
      console.error('Trades insert error:', tradesError)
      return NextResponse.json(
        { error: `Failed to insert trades: ${tradesError.message}` },
        { status: 500 }
      )
    }

    // Insert individual transactions for each trade
    const allTransactions: any[] = []
    for (let i = 0; i < insertedTrades.length; i++) {
      const insertedTrade = insertedTrades[i]
      const transactionData = transactionDataMap.get(i)
      if (!transactionData) continue

      const buyData = transactionData.buy
      const sellData = transactionData.sell

      // Insert buy transaction
      if (buyData) {
        allTransactions.push({
          trade_id: insertedTrade.id,
          upload_id: uploadRecord.id,
          symbol: String(buyData.symbol || insertedTrade.symbol),
          side: 'BUY',
          quantity: Number(buyData.quantity) || 0,
          price: Number(buyData.raw_price || buyData.entry_price || 0),
          net_price: buyData.raw_net_price ? Number(buyData.raw_net_price) : null,
          commission: Number(buyData.commission || 0),
          exec_time: buyData['Exec Time'] || buyData.trade_date,
          raw_data: buyData,
        })
      }

      // Insert sell transaction
      if (sellData) {
        allTransactions.push({
          trade_id: insertedTrade.id,
          upload_id: uploadRecord.id,
          symbol: String(sellData.symbol || insertedTrade.symbol),
          side: 'SELL',
          quantity: Number(sellData.quantity) || 0,
          price: Number(sellData.raw_price || sellData.exit_price || 0),
          net_price: sellData.raw_net_price ? Number(sellData.raw_net_price) : null,
          commission: Number(sellData.commission || 0),
          exec_time: sellData['Exec Time'] || sellData.trade_date,
          raw_data: sellData,
        })
      }
    }

    if (allTransactions.length > 0) {
      const { error: transactionsError } = await supabase
        .from('transactions')
        .insert(allTransactions)

      if (transactionsError) {
        console.error('Transactions insert error:', transactionsError)
        // Don't fail the upload if transactions fail, but log it
      }
    }

    console.log(`Successfully inserted ${insertedTrades.length} trades and ${allTransactions.length} transactions for user ${userId}`)

    return NextResponse.json(
      {
        success: true,
        uploadId: uploadRecord.id,
        tradeCount: trades.length,
        trades: insertedTrades,
        message: `Successfully uploaded and parsed ${trades.length} trades`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to process file' },
      { status: 500 }
    )
  }
}
