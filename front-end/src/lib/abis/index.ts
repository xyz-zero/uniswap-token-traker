// 导入所有 ABI 文件
import ERC20ABI from './ERC20.json'
import UniswapV2FactoryABI from './UniswapV2Factory.json'
import UniswapV2Router02ABI from './UniswapV2Router02.json'
import UniswapV2PairABI from './UniswapV2Pair.json'

// 导出所有 ABI
export {
  ERC20ABI,
  UniswapV2FactoryABI,
  UniswapV2Router02ABI,
  UniswapV2PairABI,
}

// 导出类型化的 ABI（用于 TypeScript 类型推断）
export const ABIS = {
  ERC20: ERC20ABI,
  UniswapV2Factory: UniswapV2FactoryABI,
  UniswapV2Router02: UniswapV2Router02ABI,
  UniswapV2Pair: UniswapV2PairABI,
} as const

// 合约地址类型
export interface ContractAddresses {
  factory: `0x${string}`
  router: `0x${string}`
  weth: `0x${string}`
  usdc: `0x${string}`
}

// 导入配置
import { CONTRACT_CONFIG } from '@/lib/config'

// 合约地址（从配置文件导入）
export const CONTRACT_ADDRESSES: ContractAddresses = {
  factory: CONTRACT_CONFIG.factory,
  router: CONTRACT_CONFIG.router,
  weth: CONTRACT_CONFIG.tokens.WETH,
  usdc: CONTRACT_CONFIG.tokens.USDC,
}

// 代币信息类型
export interface TokenInfo {
  address: `0x${string}`
  symbol: string
  name: string
  decimals: number
  logoURI?: string
}

// 代币信息可以从 config.ts 中的 TOKEN_LIST 获取 