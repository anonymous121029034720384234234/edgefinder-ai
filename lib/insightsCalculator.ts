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
  trade_date: string
  side: 'BUY' | 'SELL'
  quantity: number
  commission: number
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

function getHourBucket(dateString: string): string {
  const date = new Date(dateString)
  const hour = date.getHours()
  
  if (hour < 6) return 'Night (12AM-6AM)'
  if (hour < 12) return 'Morning (6AM-12PM)'
  if (hour < 17) return 'Afternoon (12PM-5PM)'
  if (hour < 21) return 'Evening (5PM-9PM)'
  return 'Late (9PM-12AM)'
}

function getDayName(dateString: string): string {
  const date = new Date(dateString)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[date.getDay()]
}

function calculateHoldTime(entry: string, exit: string): number {
  const entryDate = new Date(entry)
  const exitDate = new Date(exit)
  const diffMs = exitDate.getTime() - entryDate.getTime()
  return diffMs / (1000 * 60 * 60) // Convert to hours
}

function formatHoldTime(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`
  if (hours < 24) return `${hours.toFixed(1)}h`
  return `${(hours / 24).toFixed(1)}d`
}

export function calculateInsights(trades: Trade[]): Insights {
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

  // Time Patterns - by Hour
  const timePatterns: { [key: string]: Trade[] } = {}
  trades.forEach(trade => {
    const bucket = getHourBucket(trade.trade_date)
    if (!timePatterns[bucket]) timePatterns[bucket] = []
    timePatterns[bucket].push(trade)
  })

  const timeStats = Object.entries(timePatterns).map(([time, timeTrades]) => ({
    time,
    trades: timeTrades,
    winRate: (timeTrades.filter(t => t.pnl > 0).length / timeTrades.length) * 100,
    pnl: timeTrades.reduce((sum, t) => sum + t.pnl, 0),
  }))

  const bestTime = timeStats.reduce((best, current) => 
    current.pnl > best.pnl ? current : best
  )
  const worstTime = timeStats.reduce((worst, current) => 
    current.pnl < worst.pnl ? current : worst
  )

  // Day of Week Patterns
  const dayPatterns: { [key: string]: Trade[] } = {}
  trades.forEach(trade => {
    const day = getDayName(trade.trade_date)
    if (!dayPatterns[day]) dayPatterns[day] = []
    dayPatterns[day].push(trade)
  })

  const dayStats = Object.entries(dayPatterns).map(([day, dayTrades]) => ({
    day,
    trades: dayTrades,
    winRate: (dayTrades.filter(t => t.pnl > 0).length / dayTrades.length) * 100,
    pnl: dayTrades.reduce((sum, t) => sum + t.pnl, 0),
  }))

  const bestDay = dayStats.reduce((best, current) => 
    current.pnl > best.pnl ? current : best
  )
  const worstDay = dayStats.reduce((worst, current) => 
    current.pnl < worst.pnl ? current : worst
  )

  // Holding Time Analysis
  const winnerHoldTimes = winners
    .filter(t => t.trade_date && t.trade_date) // Has both dates
    .map(t => calculateHoldTime(t.trade_date, new Date().toISOString()))
  const loserHoldTimes = losers
    .filter(t => t.trade_date && t.trade_date)
    .map(t => calculateHoldTime(t.trade_date, new Date().toISOString()))

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
  const consistentPositionSizing = trades.length > 10 // Simplified
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
