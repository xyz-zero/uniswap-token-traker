'use client'

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { parseAbiItem, formatUnits } from 'viem'
import { CONTRACT_CONFIG } from '@/lib/config'
import { useEthPrice } from './useEthPrice'

// 成交量数据类型
export interface VolumeData {
  volume24h: {
    eth: number
    wise: number
    usd: number
  }
  volume7d: {
    eth: number
    wise: number
    usd: number
  }
  volumeTotal: {
    eth: number
    wise: number
    usd: number
  }
}

/**
 * 交易对成交量 Hook
 * 用于获取 WISE/ETH 交易对的成交量数据
 */
export function useVolume() {
  const [volumeData, setVolumeData] = useState<VolumeData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const publicClient = usePublicClient()
  const { getCurrentPrice } = useEthPrice()

  // 计算指定时间段内的成交量
  const calculateVolumeForPeriod = async (
    hours: number // 24小时、168小时(7天)等
  ): Promise<{ eth: number; wise: number; usd: number }> => {
    if (!publicClient) return { eth: 0, wise: 0, usd: 0 }

    const currentTime = Math.floor(Date.now() / 1000)
    const targetTime = currentTime - (hours * 3600)
    const currentBlock = await publicClient.getBlockNumber()
    
    // 估算目标时间对应的区块号（以太坊平均出块时间约13秒）
    const estimatedBlocksBack = Math.floor((hours * 3600) / 13)
    const fromBlock = currentBlock - BigInt(estimatedBlocksBack)

    try {
      const logs = await publicClient.getLogs({
        address: CONTRACT_CONFIG.pairs.WISE_ETH,
        event: parseAbiItem('event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)'),
        fromBlock: fromBlock > 0n ? fromBlock : 1n,
        toBlock: currentBlock
      })

      let totalEthVolume = 0
      let totalWiseVolume = 0

      for (const log of logs) {
        const logWithTimestamp = log as typeof log & { blockTimestamp: bigint }
        
        // 检查时间戳是否在目标时间段内
        if (Number(logWithTimestamp.blockTimestamp) < targetTime) {
          continue
        }

        const { amount0In, amount1In, amount0Out, amount1Out } = log.args || {}
        
        if (amount0In === undefined || amount1In === undefined || 
            amount0Out === undefined || amount1Out === undefined) {
          continue
        }

        // 累计成交量（无论买卖方向，都计算绝对值）
        const ethAmount = amount1In > 0n ? 
          parseFloat(formatUnits(amount1In, 18)) : 
          parseFloat(formatUnits(amount1Out, 18))
        
        const wiseAmount = amount0In > 0n ? 
          parseFloat(formatUnits(amount0In, 18)) : 
          parseFloat(formatUnits(amount0Out, 18))

        totalEthVolume += ethAmount
        totalWiseVolume += wiseAmount
      }

      const ethPrice = getCurrentPrice() || 2000 // 获取实时价格，降级到 $2000
      
      return {
        eth: totalEthVolume,
        wise: totalWiseVolume,
        usd: totalEthVolume * ethPrice
      }
    } catch (err) {
      console.error(`计算 ${hours} 小时成交量失败:`, err)
      return { eth: 0, wise: 0, usd: 0 }
    }
  }

  // 获取所有时间段的成交量数据
  const fetchVolumeData = async () => {
    if (!publicClient) return
    
    setLoading(true)
    setError(null)
    
    try {
      // 并行计算不同时间段的成交量
      const [volume24h, volume7d, volumeTotal] = await Promise.all([
        calculateVolumeForPeriod(24),    // 24小时
        calculateVolumeForPeriod(168),   // 7天
        calculateVolumeForPeriod(8760)   // 1年（作为总成交量的近似值）
      ])

      const volumeData: VolumeData = {
        volume24h,
        volume7d,
        volumeTotal
      }

      setVolumeData(volumeData)
    } catch (err) {
      console.error('获取成交量数据失败:', err)
      setError('Failed to fetch volume data')
      setVolumeData(null)
    } finally {
      setLoading(false)
    }
  }

  

  useEffect(() => {
    fetchVolumeData()
  }, [publicClient])

  return {
    volumeData,
    loading,
    error,
    refetch: fetchVolumeData,
  }
} 