/**
 * Calculate insights from trade data without AI
 * This calculates metrics from actual trade history
 */

export interface Trade {
  id: string
  symbol: string
  entry_price: number
  exit_price: number
  pnl: number
  trade_date?: string
  side?: 'BUY' | 'SELL'
  quantity: number
  commission?: number
  [key: string]: any
}

export interface Transaction {
  id: string
  symbol: string
  side: 'BUY' | 'SELL'
  quantity: number
  price: number
  exec_time: string | null
  commission?: number
  [key: string]: any
}

export interface Insights {
  overallPerformance: {
    totalTrades: number
    winners: number
    losers: number
    winRate: number
    totalPnL: number
    profitFactor: number
    averageWin: number
    averageLoss: number
    largestWin: number
    largestLoss: number
  }
  timePatterns: {
    bestTimeOfDay: { timeRange: string; winRate: number; pnL: number }
    worstTimeOfDay: { timeRange: string; winRate: number; pnL: number }
    bestDayOfWeek: { day: string; winRate: number; pnL: number }
    worstDayOfWeek: { day: string; winRate: number; pnL: number }
  }
  holdingTimeAnalysis: {
    avgWinnerHoldTime: string
    avgLoserHoldTime: string
    insight: string
  }
  riskManagementScore: {
    score: number
    strengths: string[]
    weaknesses: string[]
  }
  topSymbols: Array<{
    symbol: string
    trades: number
    winRate: number
    totalPnL: number
  }>
}

// Parse various datetime formats from different brokers and platforms
// Supports: YYYY-MM-DD HH:MM:SS, ISO 8601, MM/DD/YYYY, DD/MM/YYYY, Unix timestamps, and more
function parseDateTime(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null
  
  const trimmed = dateStr.trim()
  if (!trimmed) return null
  
  try {
    // Check if it's a Unix timestamp (milliseconds or seconds)
    const asNumber = Number(trimmed)
    if (!isNaN(asNumber) && asNumber > 0) {
      // If number is less than 10 billion, assume it's seconds; otherwise milliseconds
      const timestamp = asNumber < 10000000000 ? asNumber * 1000 : asNumber
      const date = new Date(timestamp)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    // ISO 8601 format with T separator and timezone (2024-01-15T09:30:45Z, 2024-01-15T09:30:45+00:00)
    if (trimmed.includes('T')) {
      const date = new Date(trimmed)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
    
    // YYYY-MM-DD HH:MM:SS (most common broker format)
    // Also supports: YYYY-MM-DD HH:MM, YYYY-MM-DD HH:MM:SS.mmm
    const yyyymmddRegex = /(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{3}))?/
    const match1 = trimmed.match(yyyymmddRegex)
    if (match1) {
      const year = parseInt(match1[1])
      const month = parseInt(match1[2]) - 1
      const day = parseInt(match1[3])
      const hour = parseInt(match1[4])
      const minute = parseInt(match1[5])
      const second = match1[6] ? parseInt(match1[6]) : 0
      const ms = match1[7] ? parseInt(match1[7]) : 0
      const date = new Date(year, month, day, hour, minute, second, ms)
      if (!isNaN(date.getTime())) return date
    }
    
    // MM/DD/YYYY HH:MM:SS or MM/DD/YYYY HH:MM (US format)
    const mmddyyyyRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/
    const match2 = trimmed.match(mmddyyyyRegex)
    if (match2) {
      const month = parseInt(match2[1]) - 1
      const day = parseInt(match2[2])
      const year = parseInt(match2[3])
      const hour = parseInt(match2[4])
      const minute = parseInt(match2[5])
      const second = match2[6] ? parseInt(match2[6]) : 0
      const date = new Date(year, month, day, hour, minute, second)
      if (!isNaN(date.getTime())) return date
    }
    
    // DD/MM/YYYY HH:MM:SS or DD/MM/YYYY HH:MM (European format)
    // Smart detection: if first number > 12, assume DD/MM
    const ddmmyyyyRegex = /(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/
    const match3 = trimmed.match(ddmmyyyyRegex)
    if (match3) {
      const firstNum = parseInt(match3[1])
      const secondNum = parseInt(match3[2])
      
      // If first > 12, definitely DD/MM format
      // If second > 12, definitely MM/DD format  
      // Otherwise, default to MM/DD (US convention)
      if (firstNum > 12 || (secondNum <= 12 && firstNum <= 12 && secondNum > firstNum)) {
        // DD/MM/YYYY format
        const day = firstNum
        const month = secondNum - 1
        const year = parseInt(match3[3])
        const hour = parseInt(match3[4])
        const minute = parseInt(match3[5])
        const second = match3[6] ? parseInt(match3[6]) : 0
        const date = new Date(year, month, day, hour, minute, second)
        if (!isNaN(date.getTime())) return date
      }
    }
    
    // YYYY/MM/DD HH:MM:SS (alternative separator)
    const yyyysmmsddsRegex = /(\d{4})\/(\d{1,2})\/(\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/
    const match4 = trimmed.match(yyyysmmsddsRegex)
    if (match4) {
      const year = parseInt(match4[1])
      const month = parseInt(match4[2]) - 1
      const day = parseInt(match4[3])
      const hour = parseInt(match4[4])
      const minute = parseInt(match4[5])
      const second = match4[6] ? parseInt(match4[6]) : 0
      const date = new Date(year, month, day, hour, minute, second)
      if (!isNaN(date.getTime())) return date
    }
    
    // MM-DD-YYYY HH:MM:SS (dash separators)
    const mmdashdddashdashyyyyRegex = /(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/
    const match5 = trimmed.match(mmdashdddashdashyyyyRegex)
    if (match5) {
      const month = parseInt(match5[1]) - 1
      const day = parseInt(match5[2])
      const year = parseInt(match5[3])
      const hour = parseInt(match5[4])
      const minute = parseInt(match5[5])
      const second = match5[6] ? parseInt(match5[6]) : 0
      const date = new Date(year, month, day, hour, minute, second)
      if (!isNaN(date.getTime())) return date
    }
    
    // Fallback: Try native Date parsing for other formats
    const date = new Date(trimmed)
    if (!isNaN(date.getTime())) {
      return date
    }

    console.warn('Could not parse datetime:', dateStr)
    return null
  } catch (e) {
    console.error('Error parsing date:', dateStr, e)
    return null
  }
}

function getHourBucket(date: Date): string {
  if (!date || isNaN(date.getTime())) return 'Unknown'
  
  const hour = date.getHours()
  
  // Validate hour is in valid range
  if (hour < 0 || hour > 23) {
    console.warn('Invalid hour extracted:', hour, 'from date:', date)
    return 'Unknown'
  }
  
  if (hour < 6) return 'Night (12AM-6AM)'
  if (hour < 12) return 'Morning (6AM-12PM)'
  if (hour < 17) return 'Afternoon (12PM-5PM)'
  if (hour < 21) return 'Evening (5PM-9PM)'
  return 'Late (9PM-12AM)'
}

function getDayName(date: Date): string {
  if (!date || isNaN(date.getTime())) return 'Unknown'
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayIndex = date.getDay()
  if (dayIndex < 0 || dayIndex > 6) return 'Unknown'
  return days[dayIndex]
}

function calculateHoldTime(entryDate: Date, exitDate: Date): number {
  const diffMs = exitDate.getTime() - entryDate.getTime()
  return diffMs / (1000 * 60 * 60) // Convert to hours
}

function formatHoldTime(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`
  if (hours < 24) return `${hours.toFixed(1)}h`
  return `${(hours / 24).toFixed(1)}d`
}

export function calculateInsights(trades: Trade[], transactions: Transaction[] = []): Insights {
  if (trades.length === 0) {
    return {
      overallPerformance: {
        totalTrades: 0,
        winners: 0,
        losers: 0,
        winRate: 0,
        totalPnL: 0,
        profitFactor: 0,
        averageWin: 0,
        averageLoss: 0,
        largestWin: 0,
        largestLoss: 0,
      },
      timePatterns: {
        bestTimeOfDay: { timeRange: 'N/A', winRate: 0, pnL: 0 },
        worstTimeOfDay: { timeRange: 'N/A', winRate: 0, pnL: 0 },
        bestDayOfWeek: { day: 'N/A', winRate: 0, pnL: 0 },
        worstDayOfWeek: { day: 'N/A', winRate: 0, pnL: 0 },
      },
      holdingTimeAnalysis: {
        avgWinnerHoldTime: '0h',
        avgLoserHoldTime: '0h',
        insight: 'Not enough data',
      },
      riskManagementScore: {
        score: 0,
        strengths: [],
        weaknesses: [],
      },
      topSymbols: [],
    }
  }

  // Overall Performance
  const winners = trades.filter(t => t.pnl > 0)
  const losers = trades.filter(t => t.pnl < 0)
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0)
  const totalWinAmount = winners.reduce((sum, t) => sum + t.pnl, 0)
  const totalLossAmount = Math.abs(losers.reduce((sum, t) => sum + t.pnl, 0))
  const winRate = (winners.length / trades.length) * 100
  const profitFactor = totalLossAmount > 0 ? totalWinAmount / totalLossAmount : totalWinAmount
  const averageWin = winners.length > 0 ? totalWinAmount / winners.length : 0
  const averageLoss = losers.length > 0 ? -(totalLossAmount / losers.length) : 0
  const largestWin = Math.max(...trades.map(t => t.pnl), 0)
  const largestLoss = Math.min(...trades.map(t => t.pnl), 0)

  // Build transaction map for timing lookups - index by trade_id or id
  const transactionsByTradeId: { [key: string]: Transaction[] } = {}
  transactions.forEach(t => {
    // Try multiple field names that might contain the trade reference
    const tradeId = (t as any).trade_id || (t as any).tradeId || t.id
    if (tradeId) {
      if (!transactionsByTradeId[tradeId]) transactionsByTradeId[tradeId] = []
      transactionsByTradeId[tradeId].push(t)
    }
  })

  // Time Patterns - by Hour (using transaction times - EXIT time)
  const timePatterns: { [key: string]: Trade[] } = {}
  
  trades.forEach(trade => {
    let timeStr: string | null = null
    
    // Try to get exit transaction time for this trade (when it was sold/closed)
    if (trade.id && transactionsByTradeId[trade.id]?.length > 0) {
      // Sort by exec_time to get transactions in order
      const txsSorted = [...transactionsByTradeId[trade.id]].sort((a, b) => {
        const timeA = parseDateTime(a.exec_time) || new Date(0)
        const timeB = parseDateTime(b.exec_time) || new Date(0)
        return timeA.getTime() - timeB.getTime()
      })
      
      // Get the LAST (exit) transaction - when the trade was closed
      const exitTx = txsSorted[txsSorted.length - 1]
      if (exitTx?.exec_time) {
        const date = parseDateTime(exitTx.exec_time)
        if (date && !isNaN(date.getTime())) {
          timeStr = getHourBucket(date)
          if (!timeStr || timeStr === 'Unknown') {
            console.warn('Failed to get time bucket for trade:', trade.id, 'Date:', date)
          }
        }
      }
    }
    
    // Fallback to trade_date if available
    if (!timeStr && trade.trade_date) {
      const date = parseDateTime(trade.trade_date)
      if (date && !isNaN(date.getTime())) {
        timeStr = getHourBucket(date)
      }
    }
    
    // If we got a valid time, add to patterns
    if (timeStr && timeStr !== 'Unknown') {
      if (!timePatterns[timeStr]) timePatterns[timeStr] = []
      timePatterns[timeStr].push(trade)
    }
  })

  const timeStats = Object.entries(timePatterns).map(([time, timeTrades]) => ({
    time,
    trades: timeTrades,
    winRate: (timeTrades.filter(t => t.pnl > 0).length / timeTrades.length) * 100,
    pnl: timeTrades.reduce((sum, t) => sum + t.pnl, 0),
  }))

  const bestTime = timeStats.length > 0 
    ? timeStats.reduce((best, current) => 
        current.pnl > best.pnl ? current : best
      )
    : { time: 'N/A', trades: [], winRate: 0, pnl: 0 }

  const worstTime = timeStats.length > 0
    ? timeStats.reduce((worst, current) => 
        current.pnl < worst.pnl ? current : worst
      )
    : { time: 'N/A', trades: [], winRate: 0, pnl: 0 }

  // Day of Week Patterns (using transaction times - EXIT time)
  const dayPatterns: { [key: string]: Trade[] } = {}
  
  trades.forEach(trade => {
    let dayStr: string | null = null
    
    // Try to get exit transaction time for this trade (when it was sold/closed)
    if (trade.id && transactionsByTradeId[trade.id]?.length > 0) {
      // Sort by exec_time to get transactions in order
      const txsSorted = [...transactionsByTradeId[trade.id]].sort((a, b) => {
        const timeA = parseDateTime(a.exec_time) || new Date(0)
        const timeB = parseDateTime(b.exec_time) || new Date(0)
        return timeA.getTime() - timeB.getTime()
      })
      
      // Get the LAST (exit) transaction - when the trade was closed
      const exitTx = txsSorted[txsSorted.length - 1]
      if (exitTx?.exec_time) {
        const date = parseDateTime(exitTx.exec_time)
        if (date && !isNaN(date.getTime())) {
          dayStr = getDayName(date)
          if (!dayStr) {
            console.warn('Failed to get day name for trade:', trade.id, 'Date:', date)
          }
        }
      }
    }
    
    // Fallback to trade_date if available
    if (!dayStr && trade.trade_date) {
      const date = parseDateTime(trade.trade_date)
      if (date && !isNaN(date.getTime())) {
        dayStr = getDayName(date)
      }
    }
    
    // If we got a valid day, add to patterns
    if (dayStr) {
      if (!dayPatterns[dayStr]) dayPatterns[dayStr] = []
      dayPatterns[dayStr].push(trade)
    }
  })

  const dayStats = Object.entries(dayPatterns).map(([day, dayTrades]) => ({
    day,
    trades: dayTrades,
    winRate: (dayTrades.filter(t => t.pnl > 0).length / dayTrades.length) * 100,
    pnl: dayTrades.reduce((sum, t) => sum + t.pnl, 0),
  }))

  const bestDay = dayStats.length > 0
    ? dayStats.reduce((best, current) => 
        current.pnl > best.pnl ? current : best
      )
    : { day: 'N/A', trades: [], winRate: 0, pnl: 0 }

  const worstDay = dayStats.length > 0
    ? dayStats.reduce((worst, current) => 
        current.pnl < worst.pnl ? current : worst
      )
    : { day: 'N/A', trades: [], winRate: 0, pnl: 0 }

  // Holding Time Analysis (using transaction times for accurate entry/exit)
  const winnerHoldTimes: number[] = []
  const loserHoldTimes: number[] = []

  winners.forEach(trade => {
    if (trade.id && transactionsByTradeId[trade.id]?.length >= 2) {
      const txs = transactionsByTradeId[trade.id].sort((a, b) => {
        const timeA = parseDateTime(a.exec_time) || new Date(0)
        const timeB = parseDateTime(b.exec_time) || new Date(0)
        return timeA.getTime() - timeB.getTime()
      })
      
      // Try to find BUY and SELL, or just use first and last
      const buyTx = txs.find(t => t.side === 'BUY') || txs[0]
      const sellTx = txs.find(t => t.side === 'SELL') || txs[txs.length - 1]
      
      if (buyTx?.exec_time && sellTx?.exec_time && buyTx !== sellTx) {
        const entryDate = parseDateTime(buyTx.exec_time)
        const exitDate = parseDateTime(sellTx.exec_time)
        
        if (entryDate && exitDate && exitDate > entryDate) {
          const holdHours = calculateHoldTime(entryDate, exitDate)
          if (holdHours > 0) {
            winnerHoldTimes.push(holdHours)
          }
        }
      }
    }
  })

  losers.forEach(trade => {
    if (trade.id && transactionsByTradeId[trade.id]?.length >= 2) {
      const txs = transactionsByTradeId[trade.id].sort((a, b) => {
        const timeA = parseDateTime(a.exec_time) || new Date(0)
        const timeB = parseDateTime(b.exec_time) || new Date(0)
        return timeA.getTime() - timeB.getTime()
      })
      
      // Try to find BUY and SELL, or just use first and last
      const buyTx = txs.find(t => t.side === 'BUY') || txs[0]
      const sellTx = txs.find(t => t.side === 'SELL') || txs[txs.length - 1]
      
      if (buyTx?.exec_time && sellTx?.exec_time && buyTx !== sellTx) {
        const entryDate = parseDateTime(buyTx.exec_time)
        const exitDate = parseDateTime(sellTx.exec_time)
        
        if (entryDate && exitDate && exitDate > entryDate) {
          const holdHours = calculateHoldTime(entryDate, exitDate)
          if (holdHours > 0) {
            loserHoldTimes.push(holdHours)
          }
        }
      }
    }
  })

  const avgWinnerHoldTime = winnerHoldTimes.length > 0 
    ? winnerHoldTimes.reduce((a, b) => a + b, 0) / winnerHoldTimes.length 
    : 0
  const avgLoserHoldTime = loserHoldTimes.length > 0 
    ? loserHoldTimes.reduce((a, b) => a + b, 0) / loserHoldTimes.length 
    : 0

  const holdTimeInsight = avgLoserHoldTime > avgWinnerHoldTime 
    ? 'You hold losers longer than winners. Consider tighter stop losses.'
    : avgWinnerHoldTime > avgLoserHoldTime
    ? 'You hold winners longer than losers. Good discipline on cutting losses.'
    : 'Your hold times are balanced.'

  // Risk Management Score (1-10)
  const largeDrawdowns = trades.filter(t => t.pnl < -(Math.abs(totalPnL) * 0.1)).length
  const riskScore = Math.min(10, Math.max(1, 
    5 + 
    (winRate > 50 ? 2 : -1) + 
    (profitFactor > 1.5 ? 2 : profitFactor > 1 ? 1 : -1) +
    (largeDrawdowns === 0 ? 1 : -2)
  ))

  const riskStrengths = [
    profitFactor > 1 && 'Positive profit factor',
    winRate > 45 && 'Win rate above 45%',
    largeDrawdowns === 0 && 'No major drawdowns',
  ].filter(Boolean) as string[]

  const riskWeaknesses = [
    profitFactor < 1 && 'Negative profit factor',
    winRate < 40 && 'Low win rate',
    largeDrawdowns > 0 && `${largeDrawdowns} large drawdowns detected`,
    avgLoserHoldTime > avgWinnerHoldTime && 'Holding losers too long',
  ].filter(Boolean) as string[]

  // Top Symbols
  const symbolStats: { [key: string]: Trade[] } = {}
  trades.forEach(trade => {
    if (!symbolStats[trade.symbol]) symbolStats[trade.symbol] = []
    symbolStats[trade.symbol].push(trade)
  })

  const topSymbols = Object.entries(symbolStats)
    .map(([symbol, symbolTrades]) => ({
      symbol,
      trades: symbolTrades.length,
      winRate: (symbolTrades.filter(t => t.pnl > 0).length / symbolTrades.length) * 100,
      totalPnL: symbolTrades.reduce((sum, t) => sum + t.pnl, 0),
    }))
    .sort((a, b) => b.totalPnL - a.totalPnL)
    .slice(0, 5)

  return {
    overallPerformance: {
      totalTrades: trades.length,
      winners: winners.length,
      losers: losers.length,
      winRate,
      totalPnL,
      profitFactor,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss,
    },
    timePatterns: {
      bestTimeOfDay: {
        timeRange: bestTime.time,
        winRate: bestTime.winRate,
        pnL: bestTime.pnl,
      },
      worstTimeOfDay: {
        timeRange: worstTime.time,
        winRate: worstTime.winRate,
        pnL: worstTime.pnl,
      },
      bestDayOfWeek: {
        day: bestDay.day,
        winRate: bestDay.winRate,
        pnL: bestDay.pnl,
      },
      worstDayOfWeek: {
        day: worstDay.day,
        winRate: worstDay.winRate,
        pnL: worstDay.pnl,
      },
    },
    holdingTimeAnalysis: {
      avgWinnerHoldTime: formatHoldTime(avgWinnerHoldTime),
      avgLoserHoldTime: formatHoldTime(avgLoserHoldTime),
      insight: holdTimeInsight,
    },
    riskManagementScore: {
      score: Math.round(riskScore),
      strengths: riskStrengths.length > 0 ? riskStrengths : ['Data available for analysis'],
      weaknesses: riskWeaknesses.length > 0 ? riskWeaknesses : ['No issues detected'],
    },
    topSymbols,
  }
}
