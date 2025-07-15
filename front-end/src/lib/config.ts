// 应用配置
export const APP_CONFIG = {
  name: 'Uniswap Token Demo',
  description: '仿 Uniswap 的代币页面演示，展示以太坊交易和统计信息',
  url: 'http://localhost:3000',
} as const

// 钱包配置
export const WALLET_CONFIG = {
  projectId: 'your-wallet-connect-project-id',
} as const

// 网络配置
export const NETWORK_CONFIG = {
  chainId: 1,
  name: 'mainnet',
  // 多个RPC端点，提供备选方案
  rpcUrls: [
    'https://eth-mainnet.g.alchemy.com/v2/demo', // Alchemy 公共端点
    'https://rpc.ankr.com/eth', // Ankr 公共端点
    'https://eth.public-rpc.com', // 公共RPC
    'https://ethereum.publicnode.com', // PublicNode
    'https://eth-mainnet.public.blastapi.io', // Blast API
  ],
  blockExplorer: 'https://etherscan.io',
} as const

// 合约地址配置
export const CONTRACT_CONFIG = {
  // 主网 Uniswap V2 合约地址
  factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f' as const,
  router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D' as const,
  
  // 常用代币地址
  tokens: {
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' as const,
    USDC: '0xA0b86a33E6441c58e7b5f7b7F95e18c06a7bF56A' as const,
    USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const,
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F' as const,
    WISE: '0x66a0f676479Cee1d7373f3DC2e2952778BfF5bd6' as const, // WISE代币地址
  },
  
  // 交易对地址
  pairs: {
    WISE_ETH: '0x21b8065d10f73EE2e260e5B47D3344d3Ced7596E' as const, // WISE/ETH 交易对
  },
} as const

// 交易配置
export const TRADING_CONFIG = {
  // 默认滑点容忍度 (0.5%)
  defaultSlippageTolerance: 0.5,
  
  // 交易截止时间 (20分钟)
  defaultDeadlineMinutes: 20,
  
  // 最小交易金额
  minTradeAmount: '0.001',
  
  // 最大交易金额
  maxTradeAmount: '1000000',
  
  // Gas 限制
  gasLimit: {
    swap: 200000,
    addLiquidity: 300000,
    removeLiquidity: 250000,
  },
} as const

// 代币列表配置
export const TOKEN_LIST = [
  {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
  },
  {
    address: CONTRACT_CONFIG.tokens.WETH,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
  },
  {
    address: CONTRACT_CONFIG.tokens.USDC,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86a33E6441c58e7b5f7b7F95e18c06a7bF56A/logo.png',
  },
  {
    address: CONTRACT_CONFIG.tokens.USDT,
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
  {
    address: CONTRACT_CONFIG.tokens.DAI,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
] as const

// 主题配置
export const THEME_CONFIG = {
  colors: {
    primary: '#ec4899',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
  },
  
  darkColors: {
    primary: '#ec4899',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
  },
} as const

// 功能开关配置
export const FEATURE_FLAGS = {
  // 是否启用钱包连接
  enableWalletConnect: true,
  
  // 是否启用暗色模式
  enableDarkMode: true,
  
  // 是否启用多语言
  enableI18n: false,
  
  // 是否启用价格图表
  enablePriceChart: true,
  
  // 是否启用交易历史
  enableTradeHistory: true,
  
  // 是否启用流动性功能
  enableLiquidity: true,
  
  // 是否启用 NFT 功能
  enableNFT: false,
} as const

// 获取环境变量的辅助函数
export const getEnvVar = (key: string, defaultValue?: string): string => {
  if (typeof window !== 'undefined') {
    // 客户端环境
    return (window as any).ENV?.[key] || defaultValue || ''
  }
  
  // 服务器环境
  return process.env[key] || defaultValue || ''
}

// 检查是否在开发环境
export const isDevelopment = process.env.NODE_ENV === 'development'

// 检查是否在生产环境
export const isProduction = process.env.NODE_ENV === 'production' 