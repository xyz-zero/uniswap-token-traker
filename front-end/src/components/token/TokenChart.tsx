'use client'

import { useVolume } from '@/hooks/useVolume'
import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// 模拟价格数据
const priceData = [
  { date: '00:00', price: 2850 },
  { date: '04:00', price: 2880 },
  { date: '08:00', price: 2920 },
  { date: '12:00', price: 2960 },
  { date: '16:00', price: 2966.88 },
  { date: '20:00', price: 2950 },
  { date: '24:00', price: 2966.88 },
]

const timeFrames = [
  { label: '1小时', value: '1h' },
  { label: '1天', value: '1d' },
  { label: '1周', value: '1w' },
  { label: '1月', value: '1m' },
  { label: '1年', value: '1y' },
]

export function TokenChart() {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('1d')
  const currentPrice = 2966.88
  const priceChange = 86.88
  const priceChangePercent = 3.02
  const { volumeData, loading, error, refetch } = useVolume();
  console.log('volumeData:', volumeData)

  return (
    <div className="card">
      {/* 价格信息 */}
      <div className="mb-6">
        <div className="flex items-baseline space-x-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            ${currentPrice.toLocaleString()}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-green-600 font-semibold">
              +${priceChange.toFixed(2)}
            </span>
            <span className="text-green-600 font-semibold">
              (+{priceChangePercent}%)
            </span>
            <span className="text-gray-500 text-sm">今天</span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          过去24小时
        </p>
      </div>

      {/* 时间框架选择器 */}
      <div className="flex space-x-2 mb-6">
        {timeFrames.map((timeFrame) => (
          <button
            key={timeFrame.value}
            onClick={() => setSelectedTimeFrame(timeFrame.value)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              selectedTimeFrame === timeFrame.value
                ? 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            {timeFrame.label}
          </button>
        ))}
      </div>

      {/* 价格图表 */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value) => [`$${value}`, 'ETH 价格']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#ec4899"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#ec4899' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 