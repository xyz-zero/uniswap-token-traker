'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Uniswap
              </span>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium">
                交易
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium">
                资金池
              </a>
              <a href="#" className="text-pink-600 dark:text-pink-400 font-medium">
                代币
              </a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 font-medium">
                NFT
              </a>
            </nav>
          </div>
          
          {/* Search and Connect */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="搜索代币和 NFT 收藏品"
                className="w-64 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-white"
              />
            </div>
            
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
} 