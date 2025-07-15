'use client'

import { useState, useEffect, useCallback } from 'react'

// 价格数据点类型
export interface PricePoint {
  timestamp: number // Unix 时间戳（毫秒）
  price: number     // 价格（USD）
  date: string      // ISO 日期字符串
}

// 时间间隔类型
export type TimeInterval = '1h' | '1d' | '1w' | '1m' | '1y'

// 价格数据类型
export interface PriceData {
  currentPrice: number
  priceHistory: PricePoint[]
  priceChange24h: number
  priceChangePercent24h: number
}

/**
 * ETH 价格数据 Hook
 * 使用 CoinGecko API 获取 ETH 价格数据
 */
export function useEthPrice() {
  const [priceData, setPriceData] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 获取当前价格和24小时变化
  const fetchCurrentPrice = async (): Promise<{
    currentPrice: number
    priceChange24h: number
    priceChangePercent24h: number
  }> => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true'
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const ethData = data.ethereum
      console.log('data:', data)
      
      return {
        currentPrice: ethData.usd,
        priceChange24h: ethData.usd_24h_change || 0,
        priceChangePercent24h: ethData.usd_24h_change || 0
      }
    } catch (err) {
      console.error('获取当前价格失败:', err)
      return {
        currentPrice: 0,
        priceChange24h: 0,
        priceChangePercent24h: 0
      }
    }
  }

  // 获取历史价格数据
  const fetchPriceHistory = async (interval: TimeInterval): Promise<PricePoint[]> => {
    try {
      let days: string
      let dataPoints = 100 // 默认数据点数量

      // 根据时间间隔确定天数和数据点
      switch (interval) {
        case '1h':
          days = '1'
          dataPoints = 24 // 24小时，每小时一个点
          break
        case '1d':
          days = '7'
          dataPoints = 168 // 7天，每小时一个点
          break
        case '1w':
          days = '30'
          dataPoints = 30 // 30天，每天一个点
          break
        case '1m':
          days = '90'
          dataPoints = 90 // 90天，每天一个点
          break
        case '1y':
          days = '365'
          dataPoints = 365 // 365天，每天一个点
          break
        default:
          days = '7'
      }

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}&interval=${interval === '1h' ? 'hourly' : 'daily'}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // CoinGecko 返回格式: { prices: [[timestamp, price], ...] }
      return data.prices.map(([timestamp, price]: [number, number]) => ({
        timestamp,
        price,
        date: new Date(timestamp).toISOString()
      }))
    } catch (err) {
      console.error(`获取 ${interval} 历史价格失败:`, err)
      return []
    }
  }

  // 获取指定时间间隔的完整价格数据
  const fetchPriceData = useCallback(async (interval: TimeInterval = '1d') => {
    setLoading(true)
    setError(null)
    
    try {
      // 并行获取当前价格和历史数据
      const [currentData, priceHistory] = await Promise.all([
        fetchCurrentPrice(),
        fetchPriceHistory(interval)
      ])

      const priceData: PriceData = {
        currentPrice: currentData.currentPrice,
        priceHistory,
        priceChange24h: currentData.priceChange24h,
        priceChangePercent24h: currentData.priceChangePercent24h
      }

      setPriceData(priceData)
    } catch (err) {
      console.error('获取价格数据失败:', err)
      setError('Failed to fetch price data')
      setPriceData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // 获取指定时间戳的价格（用于计算历史交易的USD价值）
  const getPriceAtTimestamp = useCallback(async (timestamp: number): Promise<number> => {
    try {
      const date = new Date(timestamp)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear()
      const dateString = `${day}-${month}-${year}`

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/ethereum/history?date=${dateString}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data.market_data?.current_price?.usd || 0
    } catch (err) {
      console.error('获取历史价格失败:', err)
      return 0
    }
  }, [])

  // 备选方案：从 Binance API 获取价格数据
  const fetchFromBinance = useCallback(async (interval: TimeInterval = '1d') => {
    try {
      let binanceInterval: string
      let limit = 100

      switch (interval) {
        case '1h':
          binanceInterval = '1h'
          limit = 24
          break
        case '1d':
          binanceInterval = '1d'
          limit = 7
          break
        case '1w':
          binanceInterval = '1d'
          limit = 30
          break
        case '1m':
          binanceInterval = '1d'
          limit = 90
          break
        case '1y':
          binanceInterval = '1w'
          limit = 52
          break
        default:
          binanceInterval = '1d'
      }

      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=${binanceInterval}&limit=${limit}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Binance 返回格式: [[timestamp, open, high, low, close, ...], ...]
      const priceHistory: PricePoint[] = data.map((kline: any[]) => ({
        timestamp: kline[0], // 开盘时间
        price: parseFloat(kline[4]), // 收盘价
        date: new Date(kline[0]).toISOString()
      }))

      // 获取当前价格（最新的收盘价）
      const currentPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : 0
      
      // 计算24小时变化
      const price24hAgo = priceHistory.length > 1 ? priceHistory[priceHistory.length - 2].price : currentPrice
      const priceChange24h = currentPrice - price24hAgo
      const priceChangePercent24h = price24hAgo > 0 ? (priceChange24h / price24hAgo) * 100 : 0

      return {
        currentPrice,
        priceHistory,
        priceChange24h,
        priceChangePercent24h
      }
    } catch (err) {
      console.error('Binance API 获取价格失败:', err)
      throw err
    }
  }, [])

  // 默认获取1天数据
  useEffect(() => {
    fetchPriceData('1d')
  }, [fetchPriceData])

  return {
    priceData,
    loading,
    error,
    // 方法
    fetchPriceData,
    getPriceAtTimestamp,
    fetchFromBinance,
    // 便捷方法
    getCurrentPrice: () => priceData?.currentPrice || 0,
    getPriceChange24h: () => priceData?.priceChange24h || 0,
    getPriceChangePercent24h: () => priceData?.priceChangePercent24h || 0,
  }
} 