# AMM 计算示例 - 实战演练

## 🧮 恒定乘积公式计算

让我们通过一个具体的例子来理解 AMM 是如何工作的：

### 📊 初始流动性池状态

```
ETH/USDC 流动性池
├── ETH 数量: 1,000
├── USDC 数量: 2,966,880
├── 恒定乘积 k: 1,000 × 2,966,880 = 2,966,880,000
└── 当前价格: 2,966,880 ÷ 1,000 = $2,966.88 per ETH
```

## 💰 用户交易示例

### 示例 1: 小额交易（100 USDC → ETH）

**交易前:**
```javascript
const reserve_ETH = 1000
const reserve_USDC = 2966880
const k = reserve_ETH * reserve_USDC // 2,966,880,000
const price_before = reserve_USDC / reserve_ETH // $2,966.88
```

**用户输入:**
```javascript
const amountIn_USDC = 100
const fee_rate = 0.003 // 0.3% 手续费
const amountIn_after_fee = amountIn_USDC * (1 - fee_rate) // 99.7 USDC
```

**计算输出 ETH:**
```javascript
// 使用恒定乘积公式: (x + Δx) * (y - Δy) = k
// 其中 Δx 是输入的 USDC，Δy 是输出的 ETH

const new_reserve_USDC = reserve_USDC + amountIn_after_fee // 2,966,979.7
const new_reserve_ETH = k / new_reserve_USDC // 999.9663
const amountOut_ETH = reserve_ETH - new_reserve_ETH // 0.0337 ETH
```

**结果:**
```javascript
console.log(`用户支付: ${amountIn_USDC} USDC`)
console.log(`用户获得: ${amountOut_ETH.toFixed(4)} ETH`)
console.log(`实际价格: ${(amountIn_USDC / amountOut_ETH).toFixed(2)} USDC per ETH`)
console.log(`价格影响: ${((price_before - (amountIn_USDC / amountOut_ETH)) / price_before * 100).toFixed(3)}%`)

// 输出:
// 用户支付: 100 USDC
// 用户获得: 0.0337 ETH  
// 实际价格: 2967.36 USDC per ETH
// 价格影响: -0.016%
```

### 示例 2: 大额交易（10,000 USDC → ETH）

```javascript
const amountIn_USDC = 10000
const amountIn_after_fee = amountIn_USDC * 0.997 // 9,970 USDC

const new_reserve_USDC = 2966880 + amountIn_after_fee // 2,976,850
const new_reserve_ETH = 2966880000 / new_reserve_USDC // 996.65 ETH
const amountOut_ETH = 1000 - new_reserve_ETH // 3.35 ETH

console.log(`大额交易结果:`)
console.log(`用户支付: ${amountIn_USDC} USDC`)
console.log(`用户获得: ${amountOut_ETH.toFixed(4)} ETH`)
console.log(`实际价格: ${(amountIn_USDC / amountOut_ETH).toFixed(2)} USDC per ETH`)
console.log(`价格影响: ${(((2976850 / 996.65) - 2966.88) / 2966.88 * 100).toFixed(3)}%`)

// 输出:
// 用户支付: 10,000 USDC
// 用户获得: 3.3500 ETH
// 实际价格: 2985.07 USDC per ETH  
// 价格影响: 0.613%
```

## 🏊‍♂️ 流动性提供计算

### 添加流动性

**当前池子状态:**
```javascript
const pool_ETH = 1000
const pool_USDC = 2966880
const total_LP_supply = Math.sqrt(pool_ETH * pool_USDC) // 54,395.66 LP tokens
```

**用户添加流动性:**
```javascript
const add_ETH = 10 // 用户想添加 10 ETH
const current_ratio = pool_USDC / pool_ETH // 2966.88
const required_USDC = add_ETH * current_ratio // 29,668.8 USDC

// 计算获得的 LP 代币
const lp_tokens_minted = Math.sqrt(add_ETH * required_USDC) // 544.33 LP tokens
const user_pool_share = lp_tokens_minted / (total_LP_supply + lp_tokens_minted) // 0.99%

console.log(`添加流动性:`)
console.log(`需要添加: ${add_ETH} ETH + ${required_USDC} USDC`)
console.log(`获得 LP 代币: ${lp_tokens_minted.toFixed(2)}`)
console.log(`池子份额: ${(user_pool_share * 100).toFixed(2)}%`)
```

### 移除流动性

```javascript
const remove_lp_tokens = 544.33 // 用户想移除的 LP 代币
const new_total_supply = total_LP_supply + lp_tokens_minted // 包含新增的
const remove_share = remove_lp_tokens / new_total_supply

// 计算可获得的代币
const get_ETH = (pool_ETH + add_ETH) * remove_share // 10 ETH
const get_USDC = (pool_USDC + required_USDC) * remove_share // 29,668.8 USDC

console.log(`移除流动性:`)
console.log(`销毁 LP 代币: ${remove_lp_tokens}`)
console.log(`获得: ${get_ETH} ETH + ${get_USDC} USDC`)
```

## 💸 手续费收益计算

### 日收益估算

```javascript
// 假设数据
const daily_volume_USD = 10000000 // 日交易量 $10M
const fee_rate = 0.003 // 0.3% 手续费
const user_pool_share = 0.01 // 1% 池子份额

// 计算收益
const daily_fees = daily_volume_USD * fee_rate // $30,000
const user_daily_income = daily_fees * user_pool_share // $300

// 年化收益率
const pool_value = 2 * 1000 * 2966.88 // $5,933,760 (假设 ETH 价格不变)
const user_investment = pool_value * user_pool_share // $59,337.6
const daily_return_rate = user_daily_income / user_investment // 0.5%
const annual_return_rate = daily_return_rate * 365 // 183% APR

console.log(`收益计算:`)
console.log(`每日手续费收入: $${user_daily_income}`)
console.log(`年化收益率: ${(annual_return_rate * 100).toFixed(1)}%`)
console.log(`注意: 这是理想情况，实际收益会因价格波动和无常损失而变化`)
```

## ⚠️ 无常损失详细计算

### 价格变化对 LP 的影响

```javascript
// 初始状态
const initial_ETH = 1
const initial_USDC = 3000
const initial_value = 6000 // $6,000
const ETH_price_initial = 3000

// ETH 价格涨到 $4,000
const ETH_price_new = 4000
const price_ratio = ETH_price_new / ETH_price_initial // 1.333

// 由于套利，池子会重新平衡
const new_ETH_in_pool = initial_ETH / Math.sqrt(price_ratio) // 0.866 ETH
const new_USDC_in_pool = initial_USDC * Math.sqrt(price_ratio) // 3,464 USDC

// LP 的价值变化
const lp_value = new_ETH_in_pool * ETH_price_new + new_USDC_in_pool // $6,928
const hodl_value = initial_ETH * ETH_price_new + initial_USDC // $7,000

// 无常损失
const impermanent_loss = hodl_value - lp_value // $72
const loss_percentage = impermanent_loss / hodl_value * 100 // 1.03%

console.log(`无常损失分析:`)
console.log(`HODL 策略价值: $${hodl_value}`)
console.log(`LP 策略价值: $${lp_value.toFixed(0)}`)
console.log(`无常损失: $${impermanent_loss} (${loss_percentage.toFixed(2)}%)`)
```

### 无常损失公式

```javascript
// 通用无常损失计算公式
function calculateImpermanentLoss(priceRatio) {
    // priceRatio = new_price / initial_price
    const il = 2 * Math.sqrt(priceRatio) / (1 + priceRatio) - 1
    return il * 100 // 转换为百分比
}

// 不同价格变化的无常损失
const scenarios = [1.25, 1.5, 2, 3, 4, 5]
console.log(`价格比例 → 无常损失`)
scenarios.forEach(ratio => {
    const loss = calculateImpermanentLoss(ratio)
    console.log(`${ratio}x → ${loss.toFixed(2)}%`)
})

// 输出:
// 1.25x → -0.62%
// 1.5x → -2.02%  
// 2x → -5.72%
// 3x → -13.40%
// 4x → -20.00%
// 5x → -25.46%
```

## 🎯 实际应用中的考虑

### 1. 滑点设置

```javascript
function calculateMinAmountOut(expectedAmount, slippageTolerance) {
    return expectedAmount * (1 - slippageTolerance / 100)
}

// 示例: 期望获得 0.0337 ETH，设置 0.5% 滑点
const minAmount = calculateMinAmountOut(0.0337, 0.5) // 0.03352 ETH
console.log(`最小接受金额: ${minAmount.toFixed(5)} ETH`)
```

### 2. Gas 费用优化

```javascript
// 不同操作的 Gas 估算
const gasEstimates = {
    swap: 150000,
    addLiquidity: 200000,
    removeLiquidity: 180000,
    approve: 50000
}

function calculateGasCost(operation, gasPrice) {
    return gasEstimates[operation] * gasPrice / 1e9 // ETH
}

// 示例: 当前 Gas 价格 30 Gwei
const swapGasCost = calculateGasCost('swap', 30e9)
console.log(`交易 Gas 费用: ${swapGasCost.toFixed(6)} ETH`)
```

### 3. MEV 保护

```javascript
// 计算合理的截止时间
function calculateDeadline(minutesFromNow = 20) {
    return Math.floor(Date.now() / 1000) + minutesFromNow * 60
}

// 示例: 20分钟后过期
const deadline = calculateDeadline(20)
console.log(`交易截止时间: ${new Date(deadline * 1000).toLocaleString()}`)
```

这些计算示例展示了 AMM 机制的核心数学原理，帮助你理解去中心化交易所是如何在没有订单簿的情况下运作的！🧮 