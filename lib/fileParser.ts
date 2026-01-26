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
  exec_time_raw?: string
  instrument_type?: 'STOCK' | 'OPTION' | 'FUTURES' | 'FOREX' | 'CRYPTO'
  [key: string]: any
}

// Comprehensive column mapping for all major trading platforms
const COLUMN_MAPPINGS = {
  // Date/Time fields
  date: [
    'date', 'trade_date', 'exec time', 'datetime', 'order_time', 
    'order created_at', 'transaction_date', 'entry_date', 'timestamp',
    'execution time', 'fill time', 'trade time', 'order date',
    'settlement date', 'time', 'date/time', 'executed at'
  ],
  
  // Symbol/Ticker fields
  symbol: [
    'symbol', 'ticker', 'ticker_symbol', 'stock', 'underlying', 
    'chain_symbol', 'instrument', 'contract', 'asset', 'security',
    'description', 'instrument description', 'product'
  ],
  
  // Side/Action fields
  side: [
    'side', 'action', 'b/s', 'type', 'direction', 'order_type', 
    'action_type', 'buy/sell', 'transaction type', 'pos effect',
    'opening/closing', 'open/close', 'position effect', 'instruction'
  ],
  
  // Quantity fields
  quantity: [
    'quantity', 'qty', 'filled_qty', 'shares', 'contracts', 
    'order_quantity', 'processed_quantity', 'filled quantity',
    'executed quantity', 'amount', 'size', 'fill qty', 'filled'
  ],
  
  // Price fields
  price: [
    'price', 'filled_price', 'exec_price', 'average_price', 
    'net price', 't. price', 'c. price', 'execution price',
    'fill price', 'avg price', 'trade price', 'unit price',
    'price per share', 'strike price'
  ],
  
  // Net price (price after commissions)
  net_price: [
    'net price', 'net_price', 'adjusted_price', 'net amount',
    'proceeds', 'net proceeds', 'total', 'net total'
  ],
  
  // Commission/Fee fields
  commission: [
    'commission', 'comm', 'fees', 'comm/fee', 'fee', 'commissions',
    'commission & fees', 'total fees', 'charges', 'costs',
    'regulatory fees', 'sec fees', 'transaction fees'
  ],
  
  // P&L fields
  pnl: [
    'pnl', 'realized_pnl', 'realized p/l', 'net_amount', 'proceeds', 
    'amount', 'mtm p/l', 'profit/loss', 'gain/loss', 'p&l',
    'realized gain/loss', 'net p/l', 'total p/l'
  ],
  
  // Time field
  time: ['time', 'exec time', 'order_time', 'datetime', 'timestamp', 'execution time', 'fill time'],
  
  // Option-specific fields
  strike: ['strike', 'strike_price', 'strike price'],
  expiration: ['expiration', 'expiration_date', 'exp', 'expiry', 'expiration date'],
  optionType: ['option_type', 'type', 'put/call', 'call/put', 'option type'],
  
  // Additional platform-specific fields
  spread: ['spread', 'spread type'],
  posEffect: ['pos effect', 'position effect', 'opening/closing', 'open/close'],
  orderType: ['order type', 'order_type', 'type'],
  account: ['account', 'account #', 'account number', 'account_id'],
}

type ColumnCategory = keyof typeof COLUMN_MAPPINGS

// Platform detection based on column headers and data patterns
function detectPlatform(headers: string[], sampleRow?: Record<string, any>): string {
  const headerStr = headers.join('|').toLowerCase()

  // ThinkorSwim / TD Ameritrade
  if (headerStr.includes('exec time') && headerStr.includes('pos effect')) {
    return 'ThinkorSwim'
  }
  
  // Interactive Brokers
  if ((headerStr.includes('t. price') && headerStr.includes('c. price')) || 
      headerStr.includes('ibkr') || 
      headerStr.includes('basis')) {
    return 'InteractiveBrokers'
  }
  
  // Robinhood
  if (headerStr.includes('chain_symbol') || 
      headerStr.includes('opening_strategy') ||
      headerStr.includes('closing_strategy')) {
    return 'Robinhood'
  }
  
  // Webull
  if (headerStr.includes('order_time') && headerStr.includes('filled_qty')) {
    return 'Webull'
  }
  
  // E*TRADE
  if (headerStr.includes('transaction date') && 
      (headerStr.includes('pos effect') || headerStr.includes('quantity'))) {
    return 'ETrade'
  }
  
  // TradeStation
  if (headerStr.includes('exit time') || 
      (headerStr.includes('entry time') && headerStr.includes('exit time'))) {
    return 'TradeStation'
  }
  
  // Fidelity
  if (headerStr.includes('run date') || 
      headerStr.includes('settlement date') ||
      (headerStr.includes('action') && headerStr.includes('quantity') && headerStr.includes('price'))) {
    return 'Fidelity'
  }
  
  // Charles Schwab
  if (headerStr.includes('schwab') || 
      (headerStr.includes('action') && headerStr.includes('quantity') && headerStr.includes('fees & comm'))) {
    return 'CharlesSchwab'
  }
  
  // Tastytrade / Tastyworks
  if (headerStr.includes('tasty') || 
      headerStr.includes('underlying symbol') ||
      (headerStr.includes('action') && headerStr.includes('instrument type'))) {
    return 'Tastytrade'
  }

  // Coinbase (Crypto)
  if (headerStr.includes('coinbase') || 
      (headerStr.includes('asset') && headerStr.includes('spot price'))) {
    return 'Coinbase'
  }

  // Binance (Crypto)
  if (headerStr.includes('binance') || headerStr.includes('bnb')) {
    return 'Binance'
  }

  // MetaTrader (Forex/CFD)
  if (headerStr.includes('metatrader') || 
      headerStr.includes('mt4') || 
      headerStr.includes('mt5') ||
      headerStr.includes('ticket')) {
    return 'MetaTrader'
  }

  // NinjaTrader (Futures)
  if (headerStr.includes('ninjatrader') || 
      headerStr.includes('instrument') && headerStr.includes('entry time')) {
    return 'NinjaTrader'
  }

  return 'Unknown'
}

// Find field value with fuzzy matching
function findField(row: Record<string, any>, columnNames: string[]): any {
  // First pass: exact case-insensitive match
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
  
  // Second pass: flexible matching with whitespace normalization
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

// Comprehensive date parsing supporting multiple international formats
function parseDate(dateString: any, timeString?: any): string {
  if (!dateString) {
    console.warn('[parseDate] No date string provided')
    return new Date().toISOString()
  }

  let str = String(dateString).trim()
  
  // Combine date and time if separate
  if (timeString && String(timeString).trim() !== str && !str.includes(':')) {
    str = str + ' ' + String(timeString).trim()
  }

  console.log(`[parseDate] Parsing: "${str}"`)

  try {
    // Pattern 1: MM/DD/YY HH:MM:SS or MM/DD/YY HH:MM (US format with 2-digit year)
    let match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/)
    if (match) {
      const month = parseInt(match[1])
      const day = parseInt(match[2])
      let year = parseInt(match[3])
      const hour = parseInt(match[4])
      const minute = parseInt(match[5])
      const second = match[6] ? parseInt(match[6]) : 0

      year = year < 30 ? 2000 + year : 1900 + year
      const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
      
      if (!isNaN(date.getTime())) {
        console.log(`[parseDate] ✓ Parsed MM/DD/YY HH:MM:SS → ${date.toISOString()}`)
        return date.toISOString()
      }
    }

    // Pattern 2: M/D/YYYY H:MM or MM/DD/YYYY HH:MM:SS (US format with 4-digit year)
    match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2})?:?(\d{2})?(?::(\d{2}))?/)
    if (match) {
      const month = parseInt(match[1])
      const day = parseInt(match[2])
      const year = parseInt(match[3])
      const hour = match[4] ? parseInt(match[4]) : 0
      const minute = match[5] ? parseInt(match[5]) : 0
      const second = match[6] ? parseInt(match[6]) : 0

      const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
      
      if (!isNaN(date.getTime())) {
        console.log(`[parseDate] ✓ Parsed MM/DD/YYYY HH:MM → ${date.toISOString()}`)
        return date.toISOString()
      }
    }

    // Pattern 3: DD/MM/YYYY HH:MM (European/Australian format)
    match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s*(\d{1,2})?:?(\d{2})?(?::(\d{2}))?/)
    if (match) {
      const first = parseInt(match[1])
      const second = parseInt(match[2])
      const year = parseInt(match[3])
      const hour = match[4] ? parseInt(match[4]) : 0
      const minute = match[5] ? parseInt(match[5]) : 0
      const sec = match[6] ? parseInt(match[6]) : 0

      // Determine if DD/MM or MM/DD based on values
      let date: Date
      if (first > 12) {
        // Must be DD/MM
        date = new Date(Date.UTC(year, second - 1, first, hour, minute, sec))
      } else if (second > 12) {
        // Must be MM/DD
        date = new Date(Date.UTC(year, first - 1, second, hour, minute, sec))
      } else {
        // Ambiguous - try DD/MM first (international standard)
        date = new Date(Date.UTC(year, second - 1, first, hour, minute, sec))
      }
      
      if (!isNaN(date.getTime())) {
        console.log(`[parseDate] ✓ Parsed DD/MM/YYYY or MM/DD/YYYY → ${date.toISOString()}`)
        return date.toISOString()
      }
    }

    // Pattern 4: YYYY-MM-DD or YYYY-MM-DD HH:MM:SS (ISO format)
    if (/^\d{4}-\d{1,2}-\d{1,2}/.test(str)) {
      const date = new Date(str)
      if (!isNaN(date.getTime())) {
        console.log(`[parseDate] ✓ Parsed ISO format → ${date.toISOString()}`)
        return date.toISOString()
      }
    }

    // Pattern 5: DD-MM-YYYY HH:MM (European format with dashes)
    match = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})\s*(\d{1,2})?:?(\d{2})?(?::(\d{2}))?/)
    if (match) {
      const day = parseInt(match[1])
      const month = parseInt(match[2])
      const year = parseInt(match[3])
      const hour = match[4] ? parseInt(match[4]) : 0
      const minute = match[5] ? parseInt(match[5]) : 0
      const second = match[6] ? parseInt(match[6]) : 0

      const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
      
      if (!isNaN(date.getTime())) {
        console.log(`[parseDate] ✓ Parsed DD-MM-YYYY → ${date.toISOString()}`)
        return date.toISOString()
      }
    }

    // Pattern 6: Unix timestamp (milliseconds or seconds)
    const numVal = Number(str)
    if (!isNaN(numVal) && numVal > 1000000000) {
      // If > 10 digits, assume milliseconds, else seconds
      const timestamp = numVal > 10000000000 ? numVal : numVal * 1000
      const date = new Date(timestamp)
      
      if (!isNaN(date.getTime())) {
        console.log(`[parseDate] ✓ Parsed Unix timestamp → ${date.toISOString()}`)
        return date.toISOString()
      }
    }

    // Pattern 7: Month DD, YYYY format (e.g., "January 15, 2024")
    match = str.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})\s*(\d{1,2})?:?(\d{2})?(?::(\d{2}))?/)
    if (match) {
      const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                          'july', 'august', 'september', 'october', 'november', 'december']
      const monthIndex = monthNames.findIndex(m => m.startsWith(match[1].toLowerCase()))
      
      if (monthIndex !== -1) {
        const day = parseInt(match[2])
        const year = parseInt(match[3])
        const hour = match[4] ? parseInt(match[4]) : 0
        const minute = match[5] ? parseInt(match[5]) : 0
        const second = match[6] ? parseInt(match[6]) : 0

        const date = new Date(Date.UTC(year, monthIndex, day, hour, minute, second))
        
        if (!isNaN(date.getTime())) {
          console.log(`[parseDate] ✓ Parsed Month DD, YYYY → ${date.toISOString()}`)
          return date.toISOString()
        }
      }
    }

    // Fallback: Try native Date parsing
    const parsed = new Date(str)
    if (!isNaN(parsed.getTime())) {
      console.log(`[parseDate] ✓ Parsed with native Date() → ${parsed.toISOString()}`)
      return parsed.toISOString()
    }

    console.warn(`[parseDate] ✗ Failed to parse "${str}", using current date`)
    return new Date().toISOString()
  } catch (error) {
    console.error(`[parseDate] Exception parsing "${str}":`, error)
    return new Date().toISOString()
  }
}

// Parse numeric value with support for various formats
function parseNumeric(value: any): number {
  if (value === null || value === undefined || value === '') return 0
  
  let str = String(value).trim()
  
  // Handle parentheses for negative numbers (accounting format)
  const isNegative = str.startsWith('(') && str.endsWith(')')
  if (isNegative) {
    str = str.slice(1, -1)
  }
  
  // Remove currency symbols, commas, spaces
  str = str.replace(/[$€£¥₹,\s]/g, '')
  
  const num = parseFloat(str)
  return isNaN(num) ? 0 : (isNegative ? -num : num)
}

// Parse side/action with support for various platform formats
function parseSide(value: any, posEffect?: any): 'BUY' | 'SELL' {
  const str = String(value || '').trim().toUpperCase()
  const effect = String(posEffect || '').trim().toUpperCase()
  
  // Direct BUY indicators
  if (str.includes('BUY') || str.includes('BOUGHT') || str.includes('LONG') || 
      str === 'B' || str === 'BOT' || str.includes('BTO') || str.includes('BTC')) {
    return 'BUY'
  }
  
  // Direct SELL indicators
  if (str.includes('SELL') || str.includes('SOLD') || str.includes('SHORT') || 
      str === 'S' || str === 'SLD' || str.includes('STO') || str.includes('STC')) {
    return 'SELL'
  }

  // Position effect indicators
  if (effect.includes('OPEN') || effect.includes('OPENING')) {
    return 'BUY'
  }
  if (effect.includes('CLOSE') || effect.includes('CLOSING')) {
    return 'SELL'
  }

  // Default to BUY if unclear
  return 'BUY'
}

// Determine instrument type
function determineInstrumentType(row: Record<string, any>, symbol: string): 'STOCK' | 'OPTION' | 'FUTURES' | 'FOREX' | 'CRYPTO' {
  const spread = findField(row, COLUMN_MAPPINGS.spread)
  const strike = findField(row, COLUMN_MAPPINGS.strike)
  const expiration = findField(row, COLUMN_MAPPINGS.expiration)
  
  // Check for options
  if (strike || expiration || (spread && !String(spread).toUpperCase().includes('STOCK'))) {
    return 'OPTION'
  }
  
  // Check for crypto
  if (symbol.includes('BTC') || symbol.includes('ETH') || symbol.includes('USDT') ||
      symbol.includes('DOGE') || symbol.includes('SOL') || symbol.includes('ADA')) {
    return 'CRYPTO'
  }
  
  // Check for forex pairs
  if (symbol.length === 6 && /^[A-Z]{3}[A-Z]{3}$/.test(symbol)) {
    return 'FOREX'
  }
  
  // Check for futures
  if (symbol.match(/^[A-Z]+[FGHJKMNQUVXZ]\d{2}$/) || symbol.includes('/')) {
    return 'FUTURES'
  }
  
  return 'STOCK'
}

function normalizeTradeData(row: Record<string, any>, platform: string): ParsedTrade {
  const dateField = findField(row, COLUMN_MAPPINGS.date)
  const timeField = findField(row, COLUMN_MAPPINGS.time)
  const symbolRaw = findField(row, COLUMN_MAPPINGS.symbol)
  const symbol = String(symbolRaw || 'UNKNOWN').toUpperCase().trim()
  
  const sideRaw = findField(row, COLUMN_MAPPINGS.side)
  const posEffect = findField(row, COLUMN_MAPPINGS.posEffect)
  const side = parseSide(sideRaw, posEffect)
  
  const quantityRaw = findField(row, COLUMN_MAPPINGS.quantity)
  const quantity = Math.abs(parseNumeric(quantityRaw)) // Ensure positive
  
  const priceRaw = findField(row, COLUMN_MAPPINGS.price)
  const price = parseNumeric(priceRaw)
  
  const netPriceRaw = findField(row, COLUMN_MAPPINGS.net_price)
  const netPrice = parseNumeric(netPriceRaw)
  
  const commissionRaw = findField(row, COLUMN_MAPPINGS.commission)
  const commission = Math.abs(parseNumeric(commissionRaw)) // Ensure positive
  
  const pnlRaw = findField(row, COLUMN_MAPPINGS.pnl)
  const pnl = parseNumeric(pnlRaw)

  const instrumentType = determineInstrumentType(row, symbol)
  const parsedDate = parseDate(dateField, timeField !== dateField ? timeField : undefined)

  return {
    symbol,
    entry_price: side === 'BUY' ? price : 0,
    exit_price: side === 'SELL' ? price : 0,
    pnl: pnl,
    trade_date: parsedDate,
    side,
    quantity,
    commission,
    platform,
    raw_price: price,
    raw_net_price: netPrice > 0 ? netPrice : undefined,
    exec_time_raw: String(dateField || ''),
    instrument_type: instrumentType,
    ...row,
  }
}

export async function parseCSVFile(fileBuffer: Buffer): Promise<ParsedTrade[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(fileBuffer.toString(), {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      delimitersToGuess: [',', '\t', '|', ';'],
      complete: (results: any) => {
        try {
          const trades = results.data as Record<string, any>[]
          const headers = results.meta.fields || Object.keys(trades[0] || {})
          const platform = detectPlatform(headers, trades[0])

          console.log('[CSV Parser] Platform detected:', platform)
          console.log('[CSV Parser] Headers:', headers)
          console.log(`[CSV Parser] Total rows in CSV: ${trades.length}`)

          const filteredTrades = trades.filter((row) => {
            const symbol = findField(row, COLUMN_MAPPINGS.symbol)
            const quantity = findField(row, COLUMN_MAPPINGS.quantity)
            return symbol && String(symbol).trim() !== '' && quantity
          })

          console.log(`[CSV Parser] Filtered rows: ${filteredTrades.length}`)

          const parsed = filteredTrades.map((trade, idx) => {
            const normalized = normalizeTradeData(trade, platform)
            
            if (idx < 10) {
              console.log(`[CSV Parser] Row ${idx}: ${normalized.symbol} ${normalized.side} ${normalized.quantity} @ $${normalized.raw_price} | ${normalized.exec_time_raw}`)
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
    const trades = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: '' }) as Record<string, any>[]

    console.log('[Excel Parser] Sheet name:', sheetName)
    console.log(`[Excel Parser] Total rows in sheet: ${trades.length}`)

    const headers = trades.length > 0 ? Object.keys(trades[0]) : []
    const platform = detectPlatform(headers, trades[0])

    console.log('[Excel Parser] Platform detected:', platform)

    const filteredTrades = trades.filter((row) => {
      const symbol = findField(row, COLUMN_MAPPINGS.symbol)
      const quantity = findField(row, COLUMN_MAPPINGS.quantity)
      return symbol && String(symbol).trim() !== '' && quantity
    })

    console.log(`[Excel Parser] Filtered rows: ${filteredTrades.length}`)

    const parsed = filteredTrades.map((trade, idx) => {
      const normalized = normalizeTradeData(trade, platform)
      
      if (idx < 10) {
        console.log(`[Excel Parser] Row ${idx}: ${normalized.symbol} ${normalized.side} ${normalized.quantity} @ $${normalized.raw_price} | ${normalized.exec_time_raw}`)
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

  const processedTrades = matchTradesAndCalculatePnL(result)

  if (processedTrades.length > 0) {
    console.log(`\n========== PARSING SUMMARY ==========`)
    console.log(`Platform: ${processedTrades[0].platform}`)
    console.log(`File: ${fileName}`)
    console.log(`Total matched trades: ${processedTrades.length}`)
    console.log(`Instrument types: ${[...new Set(processedTrades.map(t => t.instrument_type))].join(', ')}`)
    console.log(`=====================================\n`)
  }

  return processedTrades
}

// Enhanced trade matching with FIFO logic
function matchTradesAndCalculatePnL(transactions: ParsedTrade[]): ParsedTrade[] {
  const tradesBySymbol: { [symbol: string]: ParsedTrade[] } = {}
  
  for (const tx of transactions) {
    if (!tradesBySymbol[tx.symbol]) {
      tradesBySymbol[tx.symbol] = []
    }
    tradesBySymbol[tx.symbol].push(tx)
  }

  const completedTrades: ParsedTrade[] = []
  const pendingBuys: { [symbol: string]: ParsedTrade[] } = {}

  for (const symbol in tradesBySymbol) {
    console.log(`\n[Trade Matching] Processing symbol: ${symbol}`)
    
    // Sort by parsed ISO date
    const symbolTrades = tradesBySymbol[symbol].sort((a, b) => {
      return new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime()
    })

    console.log(`[Trade Matching] ${symbol} - ${symbolTrades.length} transactions in chronological order:`)
    symbolTrades.forEach((tx, i) => {
      console.log(`  ${i + 1}. ${tx.side} ${tx.quantity} @ $${tx.raw_price} | ${tx.exec_time_raw}`)
    })

    pendingBuys[symbol] = []

    for (const tx of symbolTrades) {
      if (tx.side === 'BUY') {
        pendingBuys[symbol].push(tx)
        console.log(`[Trade Matching]   → Added BUY to queue (${pendingBuys[symbol].length} pending)`)
      } else if (tx.side === 'SELL') {
        if (pendingBuys[symbol].length > 0) {
          // Match with oldest pending buy (FIFO)
          const buyTx = pendingBuys[symbol].shift()!
          
          // Use net_price if available (includes commission)
          const entryPrice = (buyTx.raw_net_price && buyTx.raw_net_price > 0) 
            ? buyTx.raw_net_price 
            : buyTx.raw_price || 0
          
          const exitPrice = (tx.raw_net_price && tx.raw_net_price > 0) 
            ? tx.raw_net_price 
            : tx.raw_price || 0
          
          const quantity = Math.min(buyTx.quantity || 0, tx.quantity || 0)
          const totalCommission = (buyTx.commission || 0) + (tx.commission || 0)
          
          // Calculate P&L
          const hasNetPrices = (buyTx.raw_net_price && buyTx.raw_net_price > 0) || 
                               (tx.raw_net_price && tx.raw_net_price > 0)
          const pnl = hasNetPrices 
            ? (exitPrice - entryPrice) * quantity 
            : ((exitPrice - entryPrice) * quantity - totalCommission)

          const completedTrade: ParsedTrade = {
            symbol,
            entry_price: entryPrice,
            exit_price: exitPrice,
            pnl,
            trade_date: tx.trade_date,
            side: 'BUY',
            quantity,
            commission: totalCommission,
            platform: buyTx.platform || 'Unknown',
            instrument_type: buyTx.instrument_type,
            raw_buy_data: buyTx,
            raw_sell_data: tx,
          }

          completedTrades.push(completedTrade)

          console.log(`[Trade Matching]   ✓ MATCHED: Buy@${entryPrice.toFixed(2)} (${buyTx.exec_time_raw}) → Sell@${exitPrice.toFixed(2)} (${tx.exec_time_raw}) | P&L: ${pnl.toFixed(2)}`)
        } else {
          // Unmatched SELL (short sale or missing data)
          completedTrades.push({
            ...tx,
            side: 'SELL',
          })
          console.log(`[Trade Matching]   ⚠ Unmatched SELL: ${symbol} @ ${tx.raw_price}`)
        }
      }
    }

    // Add remaining pending buys as incomplete trades
    for (const pendingBuy of pendingBuys[symbol]) {
      completedTrades.push({
        ...pendingBuy,
        side: 'BUY',
      })
      console.log(`[Trade Matching]   ⚠ Unmatched BUY: ${symbol} @ ${pendingBuy.raw_price}`)
    }
  }

  return completedTrades
}