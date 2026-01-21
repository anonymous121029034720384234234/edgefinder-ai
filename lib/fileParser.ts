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
// Detect the date format used in a file by examining sample dates
function detectDateFormat(sampleDates: string[]): string | null {
  const validSamples = sampleDates.filter(d => d && String(d).trim().length > 0)
  
  if (validSamples.length === 0) return null

  console.log('[Date Format Detection] Examining samples:', validSamples.slice(0, 3))

  // Try each format and see which one consistently works
  const formats = {
    'MM/DD/YY': /^\d{1,2}\/\d{1,2}\/\d{2}\s+\d{1,2}:\d{2}/, // 01/15/24 09:31:00
    'YYYY-MM-DD': /^\d{4}-\d{1,2}-\d{1,2}/,
    'MM/DD/YYYY': /^\d{1,2}\/\d{1,2}\/\d{4}/,
    'DD/MM/YYYY': /^\d{1,2}\/\d{1,2}\/\d{4}/,
    'DD-MM-YYYY': /^\d{1,2}-\d{1,2}-\d{4}/,
  }

  for (const [formatName, regex] of Object.entries(formats)) {
    const matches = validSamples.filter(d => regex.test(String(d).trim()))
    if (matches.length === validSamples.length) {
      console.log(`[Date Format Detection] Detected format: ${formatName}`)
      return formatName
    }
  }

  console.log('[Date Format Detection] Could not determine format, will try auto-detect per date')
  return null
}

function parseDate(dateString: any, timeString?: any, detectedFormat?: string | null): string {
  if (!dateString) {
    console.warn('[parseDate] No date string provided')
    return new Date().toISOString()
  }

  let str = String(dateString).trim()
  
  // Don't append timeString if it's the same as dateString (already has time)
  if (timeString && String(timeString).trim() !== str) {
    str = str + ' ' + String(timeString).trim()
  }

  console.log(`[parseDate] Parsing: "${str}" (format hint: ${detectedFormat || 'auto-detect'})`)

  try {
    // Handle MM/DD/YY HH:MM:SS format (ThinkorSwim)
    if (detectedFormat === 'MM/DD/YY' || /^\d{1,2}\/\d{1,2}\/\d{2}\s+\d{1,2}:\d{2}/.test(str)) {
      const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/)
      if (match) {
        let month = parseInt(match[1])
        let day = parseInt(match[2])
        let year = parseInt(match[3])
        const hour = parseInt(match[4])
        const minute = parseInt(match[5])
        const second = match[6] ? parseInt(match[6]) : 0

        // Convert 2-digit year to 4-digit (24 → 2024, 99 → 1999)
        if (year < 100) {
          year = year < 30 ? 2000 + year : 1900 + year
        }

        // Create date in UTC without timezone conversion
        const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
        if (!isNaN(date.getTime())) {
          console.log(`[parseDate] ✓ Successfully parsed as MM/DD/YY: ${date.toISOString()}`)
          return date.toISOString()
        }
      }
    }

    // If we have a detected format, use it specifically
    if (detectedFormat === 'YYYY-MM-DD') {
      if (/^\d{4}-\d{1,2}-\d{1,2}/.test(str)) {
        const date = new Date(str)
        if (!isNaN(date.getTime())) {
          console.log(`[parseDate] ✓ Successfully parsed as ${detectedFormat}: ${date.toISOString()}`)
          return date.toISOString()
        }
      }
    }

    if (detectedFormat === 'MM/DD/YYYY') {
      if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(str)) {
        const parts = str.split(/[\s\/]+/)
        const month = Number(parts[0])
        const day = Number(parts[1])
        const year = Number(parts[2])
        const hour = parts[3] ? Number(parts[3]) : 0
        const minute = parts[4] ? Number(parts[4]) : 0
        const date = new Date(Date.UTC(year, month - 1, day, hour, minute, 0))
        if (!isNaN(date.getTime())) {
          console.log(`[parseDate] ✓ Successfully parsed as ${detectedFormat}: ${date.toISOString()}`)
          return date.toISOString()
        }
      }
    }

    if (detectedFormat === 'DD/MM/YYYY') {
      if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(str)) {
        const parts = str.split(/[\s\/]+/)
        const day = Number(parts[0])
        const month = Number(parts[1])
        const year = Number(parts[2])
        const hour = parts[3] ? Number(parts[3]) : 0
        const minute = parts[4] ? Number(parts[4]) : 0
        const date = new Date(Date.UTC(year, month - 1, day, hour, minute, 0))
        if (!isNaN(date.getTime())) {
          console.log(`[parseDate] ✓ Successfully parsed as ${detectedFormat}: ${date.toISOString()}`)
          return date.toISOString()
        }
      }
    }

    if (detectedFormat === 'DD-MM-YYYY') {
      if (/^\d{1,2}-\d{1,2}-\d{4}/.test(str)) {
        const parts = str.split('-')
        const day = Number(parts[0])
        const month = Number(parts[1])
        const year = Number(parts[2])
        const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
        if (!isNaN(date.getTime())) {
          console.log(`[parseDate] ✓ Successfully parsed as ${detectedFormat}: ${date.toISOString()}`)
          return date.toISOString()
        }
      }
    }

    // Fallback: Try to parse as ISO format first (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS)
    if (/^\d{4}-\d{1,2}-\d{1,2}/.test(str)) {
      const date = new Date(str)
      if (!isNaN(date.getTime())) {
        console.log(`[parseDate] ✓ Parsed as ISO format: ${date.toISOString()}`)
        return date.toISOString()
      }
    }

    // Handle MM/DD/YY HH:MM:SS auto-detect
    const yyMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/)
    if (yyMatch) {
      let month = parseInt(yyMatch[1])
      let day = parseInt(yyMatch[2])
      let year = parseInt(yyMatch[3])
      const hour = parseInt(yyMatch[4])
      const minute = parseInt(yyMatch[5])
      const second = yyMatch[6] ? parseInt(yyMatch[6]) : 0

      // Convert 2-digit year to 4-digit
      if (year < 100) {
        year = year < 30 ? 2000 + year : 1900 + year
      }

      const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
      if (!isNaN(date.getTime())) {
        console.log(`[parseDate] ✓ Auto-detected MM/DD/YY: ${date.toISOString()}`)
        return date.toISOString()
      }
    }

    // Handle DD/MM/YYYY, MM/DD/YYYY, D/M/YYYY formats
    if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(str)) {
      const parts = str.split(/[\s\/]+/)
      const first = Number(parts[0])
      const second = Number(parts[1])
      const year = Number(parts[2])
      const hour = parts[3] ? Number(parts[3]) : 0
      const minute = parts[4] ? Number(parts[4]) : 0

      // Determine if it's DD/MM or MM/DD
      if (first > 12) {
        // Must be DD/MM
        const date = new Date(Date.UTC(year, second - 1, first, hour, minute, 0))
        if (!isNaN(date.getTime())) {
          console.log(`[parseDate] ✓ Auto-detected DD/MM/YYYY: ${date.toISOString()}`)
          return date.toISOString()
        }
      } else if (second > 12) {
        // Must be MM/DD
        const date = new Date(Date.UTC(year, first - 1, second, hour, minute, 0))
        if (!isNaN(date.getTime())) {
          console.log(`[parseDate] ✓ Auto-detected MM/DD/YYYY: ${date.toISOString()}`)
          return date.toISOString()
        }
      } else {
        // Ambiguous - assume MM/DD (US default)
        const date = new Date(Date.UTC(year, first - 1, second, hour, minute, 0))
        if (!isNaN(date.getTime())) {
          console.log(`[parseDate] ✓ Ambiguous format, assumed MM/DD/YYYY: ${date.toISOString()}`)
          return date.toISOString()
        }
      }
    }

    // Handle DD-MM-YYYY format
    if (/^\d{1,2}-\d{1,2}-\d{4}/.test(str)) {
      const parts = str.split('-')
      const date = new Date(Date.UTC(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]), 0, 0, 0))
      if (!isNaN(date.getTime())) {
        console.log(`[parseDate] ✓ Parsed as DD-MM-YYYY: ${date.toISOString()}`)
        return date.toISOString()
      }
    }

    // Try standard JavaScript date parsing
    const parsed = new Date(str)
    if (!isNaN(parsed.getTime())) {
      console.log(`[parseDate] ✓ Parsed with native Date(): ${parsed.toISOString()}`)
      return parsed.toISOString()
    }

    console.warn(`[parseDate] ✗ Failed to parse "${str}", using current date`)
    return new Date().toISOString()
  } catch (error) {
    console.error(`[parseDate] Exception parsing "${str}":`, error)
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

function normalizeTradeData(row: Record<string, any>, platform: string, detectedDateFormat?: string | null): ParsedTrade {
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
    trade_date: parseDate(dateField, timeField, detectedDateFormat),
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

          console.log('[CSV Parser] Platform detected:', platform)
          console.log('[CSV Parser] Headers:', headers)
          console.log('[CSV Parser] ========== RAW CSV DATA ==========')
          console.log(`[CSV Parser] Total rows in CSV: ${trades.length}`)
          
          // Show first 10 raw rows
          trades.slice(0, 10).forEach((row, idx) => {
            console.log(`[CSV Parser] Row ${idx}:`, JSON.stringify(row, null, 2))
          })
          console.log('[CSV Parser] ================================')

          // Filter out non-trade rows (some platforms mix transaction types)
          const filteredTrades = trades.filter((row) => {
            const symbol = findField(row, COLUMN_MAPPINGS.symbol)
            return symbol && String(symbol).trim() !== ''
          })

          console.log(`[CSV Parser] Filtered rows: ${filteredTrades.length}`)

          // Detect date format from sample of trades
          const sampleDates = filteredTrades.slice(0, 5).map(t => findField(t, COLUMN_MAPPINGS.date))
          const detectedDateFormat = detectDateFormat(sampleDates)

          const parsed = filteredTrades.map((trade, idx) => {
            const dateField = findField(trade, COLUMN_MAPPINGS.date)
            const timeField = findField(trade, COLUMN_MAPPINGS.time)
            const normalized = normalizeTradeData(trade, platform, detectedDateFormat)
            
            if (idx < 5) {
              console.log(`[CSV Parser] Parsed Row ${idx}:`)
              console.log(`  Raw date: "${dateField}"`)
              console.log(`  Raw time: "${timeField}"`)
              console.log(`  → Symbol: ${normalized.symbol}`)
              console.log(`  → Side: ${normalized.side}`)
              console.log(`  → Price: ${normalized.raw_price}`)
              console.log(`  → Parsed trade_date: ${normalized.trade_date}`)
            }
            return normalized
          })

          console.log('[CSV Parser] ✓ CSV parsing complete')
          resolve(parsed)
        } catch (error) {
          console.error('[CSV Parser] Error:', error)
          reject(error)
        }
      },
      error: (error: any) => {
        console.error('[CSV Parser] Parse error:', error)
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

    console.log('[Excel Parser] Sheet name:', sheetName)

    const headers = trades.length > 0 ? Object.keys(trades[0]) : []
    const platform = detectPlatform(headers)

    console.log('[Excel Parser] Platform detected:', platform)
    console.log('[Excel Parser] Headers:', headers)
    console.log('[Excel Parser] ========== RAW EXCEL DATA ==========')
    console.log(`[Excel Parser] Total rows in sheet: ${trades.length}`)

    // Show first 10 raw rows
    trades.slice(0, 10).forEach((row, idx) => {
      console.log(`[Excel Parser] Row ${idx}:`, JSON.stringify(row, null, 2))
    })
    console.log('[Excel Parser] ================================')

    // Filter out non-trade rows
    const filteredTrades = trades.filter((row) => {
      const symbol = findField(row, COLUMN_MAPPINGS.symbol)
      return symbol && String(symbol).trim() !== ''
    })

    console.log(`[Excel Parser] Filtered rows: ${filteredTrades.length}`)

    // Detect date format from sample of trades
    const sampleDates = filteredTrades.slice(0, 5).map(t => findField(t, COLUMN_MAPPINGS.date))
    const detectedDateFormat = detectDateFormat(sampleDates)

    const parsed = filteredTrades.map((trade, idx) => {
      const dateField = findField(trade, COLUMN_MAPPINGS.date)
      const timeField = findField(trade, COLUMN_MAPPINGS.time)
      const normalized = normalizeTradeData(trade, platform, detectedDateFormat)
      
      if (idx < 5) {
        console.log(`[Excel Parser] Parsed Row ${idx}:`)
        console.log(`  Raw date: "${dateField}"`)
        console.log(`  Raw time: "${timeField}"`)
        console.log(`  → Symbol: ${normalized.symbol}`)
        console.log(`  → Side: ${normalized.side}`)
        console.log(`  → Price: ${normalized.raw_price}`)
        console.log(`  → Parsed trade_date: ${normalized.trade_date}`)
      }
      return normalized
    })

    console.log('[Excel Parser] ✓ Excel parsing complete')
    return parsed
  } catch (error) {
    console.error('[Excel Parser] Error:', error)
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
          trade_date: tx['Exec Time'] ? parseDate(tx['Exec Time']) : tx.trade_date, // Use actual execution time from SELL (exit) transaction
          side: 'BUY', // Completed trades are marked as BUY (entry)
          quantity,
          commission: totalCommission,
          platform: buyTx.platform || 'Unknown',
          raw_buy_data: buyTx,
          raw_sell_data: tx,
        }

        completedTrades.push(completedTrade)

        console.log(`[Trade Matching] ✓ ${symbol}: Buy@${entryPrice} (${buyTx['Exec Time'] || buyTx.trade_date}) → Sell@${exitPrice} (${tx['Exec Time'] || tx.trade_date}) | Qty:${quantity} | PnL:${pnl.toFixed(2)} | Exit date: ${completedTrade.trade_date}`)
      } else if (tx.side === 'SELL') {
        // Sell with no matching buy - add as incomplete
        completedTrades.push({
          ...tx,
          side: 'SELL',
        })
        console.log(`[Trade Matching] ⚠ Unmatched SELL: ${symbol} - Sell@${tx.exit_price} (${tx['Exec Time'] || tx.trade_date})`)
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
