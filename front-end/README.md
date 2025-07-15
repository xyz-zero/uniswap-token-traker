# Uniswap Token Demo - 前端

这是一个仿 Uniswap 的代币页面演示项目，使用 Next.js 14 和 RainbowKit 构建。

## 功能特性

- 🎨 现代化的 Uniswap 风格界面
- 💰 以太坊代币信息展示（价格：$2,966.88）
- 📊 交互式价格图表
- 📈 实时统计数据
- 🔄 代币兑换界面
- 🌐 Web3 钱包连接（使用 RainbowKit）
- 🎯 完全响应式设计
- 🌙 深色模式支持

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **Web3**: RainbowKit + Wagmi + Viem
- **图表**: Recharts
- **图标**: Heroicons
- **动画**: Framer Motion

## 开始使用

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 打开浏览器

访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── app/                 # Next.js 13+ App Router
│   ├── globals.css     # 全局样式
│   ├── layout.tsx      # 根布局
│   ├── page.tsx        # 主页面
│   └── providers.tsx   # Web3 提供商
├── components/         # React 组件
│   ├── layout/         # 布局组件
│   │   └── Header.tsx  # 头部导航
│   ├── token/          # 代币相关组件
│   │   ├── TokenChart.tsx        # 价格图表
│   │   ├── TokenHeader.tsx       # 代币信息头部
│   │   ├── TokenStats.tsx        # 统计数据
│   │   └── TradingInterface.tsx  # 交易界面
│   └── ui/             # 通用 UI 组件
├── hooks/              # 自定义 React Hooks
├── lib/                # 工具库
├── types/              # TypeScript 类型定义
└── utils/              # 工具函数
```

## 主要组件

### TokenHeader
- 显示以太坊logo和名称
- 收藏、分享功能按钮

### TokenChart
- 交互式价格图表
- 时间框架选择（1小时、1天、1周、1月、1年）
- 价格变化显示

### TokenStats
- 市值、交易量等统计数据
- 关于以太坊的介绍

### TradingInterface
- 代币兑换界面
- 支持 ETH/USDC 交易对
- 实时汇率和Gas费用显示

## 配置说明

在 `src/app/providers.tsx` 中，你需要替换 `YOUR_PROJECT_ID` 为你的 WalletConnect 项目 ID：

```typescript
const { connectors } = getDefaultWallets({
  appName: 'Uniswap Token Demo',
  projectId: 'YOUR_PROJECT_ID', // 替换为你的项目 ID
  chains: [mainnet],
})
```

## 开发脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run type-check` - 运行 TypeScript 类型检查

## 部署

该项目可以轻松部署到 Vercel、Netlify 等平台：

```bash
npm run build
```

## 许可证

MIT License 