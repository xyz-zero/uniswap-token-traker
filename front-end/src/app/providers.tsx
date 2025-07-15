'use client'

import { ReactNode } from 'react'
import {  createConfig ,WagmiProvider,http} from 'wagmi'
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { APP_CONFIG, WALLET_CONFIG } from '@/lib/config'
import { mainnet } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

const queryClient = new QueryClient()


interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
       <QueryClientProvider client={queryClient}>
         <RainbowKitProvider>
            {/* Your App */}
            {children}
          </RainbowKitProvider>
       </QueryClientProvider>
     </WagmiProvider>
  )
} 