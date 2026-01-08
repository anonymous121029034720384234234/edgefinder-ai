import Papa from 'papaparse'
import * as XLSX from 'xlsx'

export interface ParsedTrade {
  symbol: string
  entry_price: number
  exit_price: number
  pnl: number
  trade_date: string
  side: 'BUY' | 'SELL'
  quantity: number
  commission: number
  platform?: string
  raw_price?: number
  raw_net_price?: number
  raw_buy_data?: any
  raw_sell_data?: any
  [key: string]: any
}

// Column mapping for different trading platforms
const COLUMN_MAPPINGS = {
  date: ['date', 'trade_date', 'exec time', 'datetime', 'order_time', 'order created_at', 'transaction_date', 'entry_date', 'timestamp'],
  symbol: ['symbol', 'ticker', 'ticker_symbol', 'stock', 'underlying', 'chain_symbol'],
  side: ['side', 'action', 'b/s', 'type', 'direction', 'order_type', 'action_type'],
  quantity: ['quantity', 'qty', 'filled_qty', 'shares', 'contracts', 'order_quantity', 'processed_quantity'],
  price: ['price', 'filled_price', 'exec_price', 'average_price', 'net price', 't. price', 'c. price'],
  net_price: ['net price', 'net_price', 'adjusted_price'],
  commission: ['commission', 'comm', 'fees', 'comm/fee', 'fee'],
  pnl: ['pnl', 'realized_pnl', 'realized p/l', 'net_amount', 'proceeds', 'amount', 'mtm p/l'],
  time: ['time', 'exec time', 'order_time', 'datetime'],
  description: ['description', 'description', 'notes'],
  strike: ['strike', 'strike_price'],
  expiration: ['expiration', 'expiration_date', 'exp'],
  optionType: ['option_type', 'type'],
}

type ColumnCategory = keyof typeof COLUMN_MAPPINGS

// Platform detection based on column headers
function detectPlatform(headers: string[]): string {
  const headerStr = headers.join('|').toLowerCase()

  if (headerStr.includes('exec time') && headerStr.includes('pos effect')) return 'ThinkorSwim'
  if (headerStr.includes('t. price') && headerStr.includes('c. price') && headerStr.includes('flex')) return 'InteractiveBrokers'
  if (headerStr.includes('chain_symbol') && headerStr.includes('opening_strategy')) return 'Robinhood'
  if (headerStr.includes('order_time') && headerStr.includes('filled_qty')) return 'Webull'
  if (headerStr.includes('exec time') && headerStr.includes('pos effect')) return 'ThinkorSwim'
  if (headerStr.includes('transaction date') && headerStr.includes('pos effect')) return 'ETrade'
  if (headerStr.includes('datetime') && headerStr.includes('quantity') && headerStr.includes('proceeds')) return 'TradeStation'

  return 'Unknown'
}

// Find a field value from a row using multiple possible column names
function findField(row: Record<string, any>, columnNames: string[]): any {
  // First try exact case-insensitive match on lowercase keys
  for (const key in row) {
    const lowerKey = key.toLowerCase().trim()
    for (const col of columnNames) {
      const lowerCol = col.toLowerCase().trim()
      if (lowerKey === lowerCol) {
        const value = row[key]
        if (value !== undefined && value !== null && value !== '') {
          return value
        }
      }
    }
  }
  
  // Fallback: try flexible matching with whitespace normalization
  const lowerRow: Record<string, any> = {}
  for (const key in row) {
    lowerRow[key.toLowerCase().trim().replace(/\s+/g, ' ')] = row[key]
  }

  for (const col of columnNames) {
    const lowerCol = col.toLowerCase().trim().replace(/\s+/g, ' ')
    if (lowerRow[lowerCol] !== undefined && lowerRow[lowerCol] !== null && lowerRow[lowerCol] !== '') {
      return lowerRow[lowerCol]
    }
  }
  
  return null
}

// Parse date with support for multiple formats
function parseDate(dateString: any, timeString?: any): string {
  if (!dateString) return new Date().toISOString()

  let str = String(dateString).trim()
  if (timeString) {
    str = str + ' ' + String(timeString).trim()
  }

  try {
    // Try to parse as ISO format first (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
    if (/^\d{4}-\d{1,2}-\d{1,2}/.test(str)) {
      return new Date(str).toISOString()
    }

    // Handle DD/MM/YYYY, MM/DD/YYYY, D/M/YYYY formats
    if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(str)) {
      const parts = str.split(/[\s\/]+/)
      const first = Number(parts[0])
      const second = Number(parts[1])
      const year = Number(parts[2])

      // Determine if it's DD/MM or MM/DD
      if (first > 12) {
        // Must be DD/MM
        const date = new Date(year, second - 1, first)
        if (!isNaN(date.getTime())) return date.toISOString()
      } else if (second > 12) {
        // Must be MM/DD
        const date = new Date(year, first - 1, second)
        if (!isNaN(date.getTime())) return date.toISOString()
      } else {
        // Ambiguous - assume DD/MM (European default)
        const date = new Date(year, second - 1, first)
        if (!isNaN(date.getTime())) return date.toISOString()
      }
    }

    // Handle DD-MM-YYYY format
    if (/^\d{1,2}-\d{1,2}-\d{4}/.test(str)) {
      const parts = str.split('-')
      const date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
      if (!isNaN(date.getTime())) return date.toISOString()
    }

    // Try MM/DD/YYYY HH:MM:SS format (common in exports)
    if (/^\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}/.test(str)) {
      const parts = str.split(/[\s\/]+/)
      const month = Number(parts[0])
      const day = Number(parts[1])
      const year = Number(parts[2])
      const date = new Date(year, month - 1, day)
      if (!isNaN(date.getTime())) return date.toISOString()
    }

    // Try standard JavaScript date parsing
    const parsed = new Date(str)
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }

    return new Date().toISOString()
  } catch (error) {
    return new Date().toISOString()
  }
}

// Parse numeric value, removing currency symbols and commas
function parseNumeric(value: any): number {
  if (value === null || value === undefined || value === '') return 0
  const str = String(value).trim().replace(/[$,()]/g, '')
  const num = parseFloat(str)
  return isNaN(num) ? 0 : num
}

// Parse side (BUY/SELL)
function parseSide(value: any): 'BUY' | 'SELL' {
  const str = String(value).trim().toUpperCase()
  if (str.includes('SELL') || str.includes('SHORT') || str === 'S') return 'SELL'
  if (str.includes('BUY') || str.includes('LONG') || str === 'B') return 'BUY'
  // Default to BUY
  return 'BUY'
}

function normalizeTradeData(row: Record<string, any>, platform: string): ParsedTrade {
  // Extract fields using flexible column mapping
  const dateField = findField(row, COLUMN_MAPPINGS.date)
  const timeField = findField(row, COLUMN_MAPPINGS.time)
  const symbol = String(findField(row, COLUMN_MAPPINGS.symbol) || 'UNKNOWN').toUpperCase()
  const sideRaw = findField(row, COLUMN_MAPPINGS.side)
  const quantityRaw = findField(row, COLUMN_MAPPINGS.quantity)
  const priceRaw = findField(row, COLUMN_MAPPINGS.price)
  const netPriceRaw = findField(row, COLUMN_MAPPINGS.net_price)
  const commissionRaw = findField(row, COLUMN_MAPPINGS.commission)
  const pnlRaw = findField(row, COLUMN_MAPPINGS.pnl)

  // Parse values
  const side = parseSide(sideRaw)
  const quantity = parseNumeric(quantityRaw)
  const price = parseNumeric(priceRaw)
  const netPrice = parseNumeric(netPriceRaw)
  const commission = parseNumeric(commissionRaw)
  const pnl = parseNumeric(pnlRaw)

  // Store as raw transaction (will be processed into trade pairs later)
  return {
    symbol,
    entry_price: side === 'BUY' ? price : 0,
    exit_price: side === 'SELL' ? price : 0,
    pnl: pnl,
    trade_date: parseDate(dateField, timeField),
    side,
    quantity,
    commission,
    platform,
    raw_price: price, // Store actual price for matching
    raw_net_price: netPrice > 0 ? netPrice : undefined, // Store net price if available
    ...row,
  }
}

export async function parseCSVFile(fileBuffer: Buffer): Promise<ParsedTrade[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(fileBuffer.toString(), {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        try {
          const trades = results.data as Record<string, any>[]
          const headers = results.meta.fields || Object.keys(trades[0] || {})
          const platform = detectPlatform(headers)

          // Filter out non-trade rows (some platforms mix transaction types)
          const filteredTrades = trades.filter((row) => {
            const symbol = findField(row, COLUMN_MAPPINGS.symbol)
            return symbol && String(symbol).trim() !== ''
          })

          const parsed = filteredTrades.map((trade) => normalizeTradeData(trade, platform))
          resolve(parsed)
        } catch (error) {
          reject(error)
        }
      },
      error: (error: any) => {
        reject(new Error(`CSV parsing error: ${error.message}`))
      },
    })
  })
}

export async function parseExcelFile(fileBuffer: Buffer): Promise<ParsedTrade[]> {
  try {
    const workbook = XLSX.read(fileBuffer)
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const trades = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[]

    const headers = trades.length > 0 ? Object.keys(trades[0]) : []
    const platform = detectPlatform(headers)

    // Filter out non-trade rows
    const filteredTrades = trades.filter((row) => {
      const symbol = findField(row, COLUMN_MAPPINGS.symbol)
      return symbol && String(symbol).trim() !== ''
    })

    const parsed = filteredTrades.map((trade) => normalizeTradeData(trade, platform))
    return parsed
  } catch (error) {
    throw new Error(`Excel parsing error: ${(error as Error).message}`)
  }
}

export async function parseTradeFile(fileBuffer: Buffer, fileName: string): Promise<ParsedTrade[]> {
  const lowerName = fileName.toLowerCase()

  let result: ParsedTrade[] = []

  if (lowerName.endsWith('.csv')) {
    result = await parseCSVFile(fileBuffer)
  } else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
    result = await parseExcelFile(fileBuffer)
  } else {
    throw new Error('Unsupported file format. Please use CSV, XLSX, or XLS.')
  }

  // Match BUY/SELL pairs and calculate PnL
  const processedTrades = matchTradesAndCalculatePnL(result)

  // Log detected platform and sample
  if (processedTrades.length > 0) {
    console.log(`Detected platform: ${processedTrades[0].platform}`)
    console.log(`Processed ${processedTrades.length} trades from ${fileName}`)
    console.log('Sample trades:', processedTrades.slice(0, 2))
  }

  return processedTrades
}

// Match BUY and SELL transactions and calculate PnL
function matchTradesAndCalculatePnL(transactions: ParsedTrade[]): ParsedTrade[] {
  // Group transactions by symbol
  const tradesBySymbol: { [symbol: string]: ParsedTrade[] } = {}
  for (const tx of transactions) {
    if (!tradesBySymbol[tx.symbol]) {
      tradesBySymbol[tx.symbol] = []
    }
    tradesBySymbol[tx.symbol].push(tx)
  }

  const completedTrades: ParsedTrade[] = []
  const pendingBuys: { [symbol: string]: ParsedTrade[] } = {}

  // Process transactions in chronological order for each symbol
  for (const symbol in tradesBySymbol) {
    const symbolTrades = tradesBySymbol[symbol].sort((a, b) => {
      // Sort by actual transaction date from raw data (Exec Time)
      const aTime = a['Exec Time'] || a.trade_date
      const bTime = b['Exec Time'] || b.trade_date
      return new Date(aTime).getTime() - new Date(bTime).getTime()
    })

    pendingBuys[symbol] = []

    for (const tx of symbolTrades) {
      if (tx.side === 'BUY') {
        // Add to pending buys queue
        pendingBuys[symbol].push(tx)
      } else if (tx.side === 'SELL' && pendingBuys[symbol].length > 0) {
        // Match with oldest pending buy (FIFO)
        const buyTx = pendingBuys[symbol].shift()!
        
        // Create a completed trade from the BUY/SELL pair
        // Use net_price if available (includes commission), otherwise fall back to raw_price
        const entryPrice = (buyTx.raw_net_price !== undefined && buyTx.raw_net_price > 0) ? buyTx.raw_net_price : (buyTx.raw_price || Number(buyTx.entry_price) || 0)
        const exitPrice = (tx.raw_net_price !== undefined && tx.raw_net_price > 0) ? tx.raw_net_price : (tx.raw_price || Number(tx.exit_price) || 0)
        const quantity = Math.min(Number(buyTx.quantity) || 0, Number(tx.quantity) || 0)
        const totalCommission = (Number(buyTx.commission) || 0) + (Number(tx.commission) || 0)
        
        // Calculate PnL: (exit - entry) * quantity
        // If net_price is used, commission is already included in the price, so we don't subtract it again
        const hasNetPrices = (buyTx.raw_net_price !== undefined && buyTx.raw_net_price > 0) || (tx.raw_net_price !== undefined && tx.raw_net_price > 0)
        const pnl = hasNetPrices ? (exitPrice - entryPrice) * quantity : ((exitPrice - entryPrice) * quantity - totalCommission)

        const completedTrade: ParsedTrade = {
          symbol,
          entry_price: entryPrice,
          exit_price: exitPrice,
          pnl,
          trade_date: buyTx['Exec Time'] ? parseDate(buyTx['Exec Time']) : buyTx.trade_date, // Use actual execution time from buy transaction
          side: 'BUY', // Completed trades are marked as BUY (entry)
          quantity,
          commission: totalCommission,
          platform: buyTx.platform || 'Unknown',
          raw_buy_data: buyTx,
          raw_sell_data: tx,
        }

        completedTrades.push(completedTrade)

        console.log(`Matched trade: ${symbol} - Buy@${entryPrice} (${buyTx['Exec Time']}) Sell@${exitPrice} (${tx['Exec Time']}) Qty:${quantity} PnL:${pnl.toFixed(2)} ${hasNetPrices ? '(using net prices)' : '(using regular prices)'}`)
      } else if (tx.side === 'SELL') {
        // Sell with no matching buy - add as incomplete
        completedTrades.push({
          ...tx,
          side: 'SELL',
        })
        console.log(`Unmatched SELL: ${symbol} - Sell@${tx.exit_price} (${tx['Exec Time']})`)
      }
    }

    // Add any remaining pending buys as incomplete trades
    for (const pendingBuy of pendingBuys[symbol]) {
      completedTrades.push({
        ...pendingBuy,
        side: 'BUY',
      })
      console.log(`Unmatched BUY: ${symbol} - Buy@${pendingBuy.entry_price} (${pendingBuy['Exec Time']})`)
    }
  }

  return completedTrades
}
