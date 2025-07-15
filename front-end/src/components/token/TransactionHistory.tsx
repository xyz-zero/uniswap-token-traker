'use client'

import { useState } from 'react'
import { ChevronDownIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { useTransactionHistory } from '@/hooks/useTransactionHistory'
import { CONTRACT_CONFIG } from '@/lib/config'



export function TransactionHistory({ pairAddress }: { pairAddress?: string } = {}) {
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell'>('all')
  const [sortBy, setSortBy] = useState<'time' | 'amount'>('time')
  const [showMore, setShowMore] = useState(false)
  const [showUserOnly, setShowUserOnly] = useState(false)

  // 使用真实的交易记录 hook，如果没有传递地址则使用 undefined
  const { 
    transactions, 
    loading, 
    error, 
    userTransactions,
    transactionStats,
    formatTimeAgo,
    formatAddress: hookFormatAddress,
    formatNumber: hookFormatNumber
  } = useTransactionHistory(pairAddress as `0x${string}` | undefined)

  // 选择数据源：真实数据或模拟数据
  const allTransactions = transactions.length > 0 ? transactions : []
  const sourceTransactions = showUserOnly ? userTransactions : allTransactions

  // 过滤和排序交易数据
  const filteredTransactions = sourceTransactions
    .filter(tx => filterType === 'all' || tx.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      } else {
        return b.usdValue - a.usdValue
      }
    })

  const displayedTransactions = showMore ? filteredTransactions : filteredTransactions.slice(0, 5)

  // 本地格式化函数（作为回退）
  const formatAddressLocal = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatNumberLocal = (num: number) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 6 
    })
  }

  const formatTimeDisplay = (timestamp: string) => {
    // 尝试使用 hook 的 formatTimeAgo，如果不存在则使用本地实现
    if (formatTimeAgo) {
      return formatTimeAgo(timestamp)
    }
    
    const now = new Date()
    const txTime = new Date(timestamp)
    const diffMs = now.getTime() - txTime.getTime()
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMinutes < 60) {
      return `${diffMinutes}分钟`
    } else if (diffHours < 24) {
      return `${diffHours}小时`
    } else {
      return `${diffDays}天`
    }
  }

  const openEtherscan = (txHash: string) => {
    window.open(`https://etherscan.io/tx/${txHash}`, '_blank')
  }

  // 使用适当的格式化函数
  const formatAddress = hookFormatAddress || formatAddressLocal
  const formatNumber = hookFormatNumber || formatNumberLocal

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          交易记录
          {transactions.length > 0 && (
            <span className="ml-2 text-sm text-green-600 dark:text-green-400">
              (实时数据)
            </span>
          )}
          {transactions.length === 0 && (
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              (演示数据)
            </span>
          )}
        </h3>
        
        {/* 过滤器 */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showUserOnly}
              onChange={(e) => setShowUserOnly(e.target.checked)}
              className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">仅显示我的交易</span>
          </label>
          
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'buy' | 'sell')}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="all">全部</option>
              <option value="buy">买入</option>
              <option value="sell">卖出</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'time' | 'amount')}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="time">时间</option>
              <option value="amount">金额</option>
            </select>
            <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 用户交易统计 */}
      {showUserOnly && transactionStats && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">我的交易统计</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">总交易数</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{transactionStats.totalTransactions}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">买入次数</p>
              <p className="text-sm font-semibold text-green-600">{transactionStats.totalBuys}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">卖出次数</p>
              <p className="text-sm font-semibold text-red-600">{transactionStats.totalSells}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">总交易量</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">${formatNumber(transactionStats.totalVolume)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">正在加载交易记录...</p>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            正在使用演示数据
          </p>
        </div>
      )}

      {/* 表格 */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  时间
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  类型
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  USD
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  WISE
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  ETH
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  钱包
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedTransactions.map((transaction) => (
                <tr 
                  key={transaction.id} 
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                    {formatTimeDisplay(transaction.timestamp)}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.type === 'buy' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {transaction.type === 'buy' ? '购买' : '出售'} WISE
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-sm text-gray-900 dark:text-white">
                    US${formatNumber(transaction.usdValue)}
                  </td>
                  <td className="py-4 px-4 text-right text-sm text-gray-900 dark:text-white">
                    {formatNumber(transaction.wiseAmount)}
                  </td>
                  <td className="py-4 px-4 text-right text-sm text-gray-900 dark:text-white">
                    {formatNumber(transaction.ethAmount)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-900 dark:text-white font-mono">
                        {formatAddress(transaction.walletAddress)}
                      </span>
                      <button
                        onClick={() => openEtherscan(transaction.txHash)}
                        className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        title="在 Etherscan 查看"
                      >
                        <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 显示更多按钮 */}
      {!loading && filteredTransactions.length > 5 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowMore(!showMore)}
            className="px-6 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {showMore ? '显示更少' : `显示全部 (${filteredTransactions.length})`}
          </button>
        </div>
      )}

      {/* 空状态 */}
      {!loading && filteredTransactions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-600 text-lg mb-2">
            暂无交易记录
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {showUserOnly 
              ? '您还没有任何交易记录' 
              : filterType === 'all' 
                ? '还没有任何交易记录' 
                : `没有${filterType === 'buy' ? '买入' : '卖出'}交易记录`
            }
          </p>
        </div>
      )}
    </div>
  )
} 