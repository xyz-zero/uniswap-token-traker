'use client'

import { useState } from 'react'
import { StarIcon, ShareIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

export function TokenHeader() {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      {/* 左侧：代币信息 */}
      <div className="flex items-center space-x-4">
        <img
          src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
          alt="Ethereum"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            以太坊
          </h1>
          <p className="text-gray-600 dark:text-gray-400">ETH</p>
        </div>
      </div>

      {/* 右侧：操作按钮 */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {isFavorite ? (
            <StarIconSolid className="w-5 h-5 text-yellow-500" />
          ) : (
            <StarIcon className="w-5 h-5 text-gray-500" />
          )}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isFavorite ? '已收藏' : '收藏'}
          </span>
        </button>
        
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <ShareIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">分享</span>
        </button>
        
        <button className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>
  )
} 