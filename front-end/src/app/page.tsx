import { Header } from '@/components/layout/Header'
import { TokenHeader } from '@/components/token/TokenHeader'
import { TokenChart } from '@/components/token/TokenChart'
import { TokenStats } from '@/components/token/TokenStats'
import { TradingInterface } from '@/components/token/TradingInterface'
import { TransactionHistory } from '@/components/token/TransactionHistory'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* 代币信息头部 */}
        <TokenHeader />
        
        {/* 主要内容区域 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：图表和统计信息 */}
          <div className="lg:col-span-2 space-y-6">
            <TokenChart />
            <TokenStats />
            <TransactionHistory pairAddress="0x21b8065d10f73EE2e260e5B47D3344d3Ced7596E" />
           
          </div>
          
          {/* 右侧：交易界面 */}
          <div className="lg:col-span-1">
            <TradingInterface />
          </div>
        </div>
      </main>
    </div>
  )
} 