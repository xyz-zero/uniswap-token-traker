'use client'

import { useState } from 'react'
import { ArrowsUpDownIcon, CogIcon } from '@heroicons/react/24/outline'

export function TradingInterface() {
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromToken, setFromToken] = useState('USDC')
  const [toToken, setToToken] = useState('ETH')

  const handleSwap = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          兑换
        </h3>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <CogIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-4">
        {/* 从代币输入 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">从</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              余额: 1,000.00
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-semibold text-gray-900 dark:text-white outline-none"
            />
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 rounded-lg px-3 py-2">
              <img
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86a33E6441c58e7b5f7b7F95e18c06a7bF56A/logo.png"
                alt="USDC"
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-gray-900 dark:text-white">
                {fromToken}
              </span>
            </div>
          </div>
        </div>

        {/* 交换按钮 */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowsUpDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* 到代币输出 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">到</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              余额: 0.5678
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={toAmount}
              onChange={(e) => setToAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl font-semibold text-gray-900 dark:text-white outline-none"
            />
            <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 rounded-lg px-3 py-2">
              <img
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
                alt="ETH"
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-gray-900 dark:text-white">
                {toToken}
              </span>
            </div>
          </div>
        </div>
        
        {/* 兑换信息 */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">兑换率</span>
            <span className="text-gray-900 dark:text-white">1 ETH = 2,966.88 USDC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">预计Gas费</span>
            <span className="text-gray-900 dark:text-white">~$15.20</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">价格影响</span>
            <span className="text-green-600">&lt;0.01%</span>
          </div>
        </div>

        {/* 兑换按钮 */}
        <button className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105">
          连接钱包
        </button>
      </div>
    </div>
  )
} 