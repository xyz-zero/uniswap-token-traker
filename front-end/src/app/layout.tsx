import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Uniswap Token Demo - Ethereum',
  description: '仿 Uniswap 的代币页面演示，展示以太坊交易和统计信息',
  keywords: ['DeFi', 'Uniswap', 'Ethereum', 'Token', 'Trading'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 