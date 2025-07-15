'use client'

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { parseAbiItem, formatUnits } from 'viem'
import { CONTRACT_CONFIG } from '@/lib/config'
import { useEthPrice } from './useEthPrice'

// 交易记录数据类型
export interface Transaction {
  id: string
  timestamp: string
  type: 'buy' | 'sell'
  usdValue: number
  wiseAmount: number
  ethAmount: number
  walletAddress: string
  txHash: string
  blockNumber: number
  gasUsed?: number
  gasPrice?: number
}

/**
 * 交易记录 Hook
 * 用于获取和监听 Uniswap 交易记录
 */
export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const publicClient = usePublicClient()
  const { getCurrentPrice } = useEthPrice()





  // 递归查询函数，直到找到足够的交易
  const fetchTransactionsRecursively = async (
    targetCount: number = 15,
    maxBlocks: number = 10000,
    batchSize: number = 1000
  ): Promise<Transaction[]> => {
    if (!publicClient) return []
    const currentBlock = await publicClient.getBlockNumber()
    let allTransactions: Transaction[] = []
    let blocksSearched = 0

    while (allTransactions.length < targetCount && blocksSearched < maxBlocks) {
      const fromBlock = currentBlock - BigInt(blocksSearched + batchSize)
      const toBlock = currentBlock - BigInt(blocksSearched)
      try {
        const logs = await publicClient.getLogs({
          address: CONTRACT_CONFIG.pairs.WISE_ETH,
          event: parseAbiItem('event Swap(address indexed sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, address indexed to)'),
          fromBlock: fromBlock > 0n ? fromBlock : 1n,
          toBlock: toBlock
        });
        console.log('logs:', logs)
        // 处理这批logs，同时获取区块时间戳
        const batchTransactionPromises = logs.map(async log => {
          const { sender, amount0In, amount1In, amount0Out, amount1Out, to } = log.args || {}

          // 检查必要的参数是否存在（undefined检查，而不是0n检查）
          if (sender === undefined || amount0In === undefined || amount1In === undefined ||
            amount0Out === undefined || amount1Out === undefined || to === undefined) {
            console.log('缺少必要的参数')
            return null
          }

          // 直接使用 log.blockTimestamp（viem 提供的区块时间戳）
          // 使用类型断言来访问 blockTimestamp 属性
          const logWithTimestamp = log as typeof log & { blockTimestamp: bigint }
          // log.blockTimestamp 是 Unix 时间戳（秒），需要转换为毫秒
          const blockTimestamp = new Date(Number(logWithTimestamp.blockTimestamp) * 1000).toISOString()

          const isWISEToBuy = amount1In > 0n && amount0Out > 0n
          const isWISEToSell = amount0In > 0n && amount1Out > 0n

          let type: 'buy' | 'sell' = 'buy'
          let wiseAmount = 0
          let ethAmount = 0

          if (isWISEToBuy) {
            // 买入 WISE：用 ETH(token1) 换 WISE(token0)
            type = 'buy'
            ethAmount = parseFloat(formatUnits(amount1In, 18))   // ETH 输入
            wiseAmount = parseFloat(formatUnits(amount0Out, 18)) // WISE 输出
          } else if (isWISEToSell) {
            // 卖出 WISE：用 WISE(token0) 换 ETH(token1)
            type = 'sell'
            wiseAmount = parseFloat(formatUnits(amount0In, 18))  // WISE 输入
            ethAmount = parseFloat(formatUnits(amount1Out, 18))  // ETH 输出
          }

          const ethPrice = getCurrentPrice() || 2000 // 获取实时价格，降级到 $2000

          const transaction: Transaction = {
            id: (log.transactionHash || '0x') as `0x${string}`,
            type,
            wiseAmount,
            ethAmount,
            usdValue: ethAmount * ethPrice,
            timestamp: blockTimestamp, // 使用真实的区块时间戳
            walletAddress: to,
            txHash: (log.transactionHash || '0x') as `0x${string}`,
            blockNumber: Number(log.blockNumber) || 0
          }
          console.log('transaction:', transaction)
          return transaction
        })

        const batchTransactionResults = await Promise.all(batchTransactionPromises)
        const batchTransactions = batchTransactionResults.filter((tx): tx is Transaction => tx !== null)

        allTransactions = [...allTransactions, ...batchTransactions]
        blocksSearched += batchSize

        // 如果从区块1开始，就停止
        if (fromBlock <= 1n) break
      } catch (err) {
        console.error(`Error fetching logs from block ${fromBlock} to ${toBlock}:`, err)
        blocksSearched += batchSize
      }
    }
    console.log('allTransactions:', allTransactions)
    // 按区块号排序，返回最新的交易
    return allTransactions
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .slice(0, targetCount)
  }

  const fetchTransactions = async () => {
    if (!publicClient) return

    setLoading(true)
    setError(null)

    try {
      const txs = await fetchTransactionsRecursively(15, 20000, 1000)
      console.log('txs:', txs)
      setTransactions(txs)
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('Failed to fetch transactions')
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [publicClient])

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    fetchRecursively: fetchTransactionsRecursively,
  }
} 