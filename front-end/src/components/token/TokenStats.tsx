'use client'

export function TokenStats() {
  const stats = [
    {
      label: '市值',
      value: '$356,234,567,890',
      change: '+2.5%',
      positive: true,
    },
    {
      label: '完全稀释估值',
      value: '$356,234,567,890',
      change: '+2.5%',
      positive: true,
    },
    {
      label: '24小时交易量',
      value: '$12,345,678,901',
      change: '+15.2%',
      positive: true,
    },
    {
      label: '24小时费用',
      value: '$1,234,567',
      change: '+8.9%',
      positive: true,
    },
    {
      label: '总供应量',
      value: '120,279,346 ETH',
      change: '+0.1%',
      positive: true,
    },
    {
      label: '最大供应量',
      value: '∞',
      change: null,
      positive: null,
    },
  ]

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        统计数据
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
            {stat.change && (
              <div className={`text-sm font-medium ${
                stat.positive ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* 关于部分 */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
          关于以太坊
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          以太坊是一个去中心化的开源区块链平台，具有智能合约功能。以太币（ETH）是以太坊平台的原生加密货币，
          也是仅次于比特币的第二大加密货币。以太坊使开发者能够构建和部署去中心化应用程序（DApps）。
        </p>
      </div>
    </div>
  )
} 