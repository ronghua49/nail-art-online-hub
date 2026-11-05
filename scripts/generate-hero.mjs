// 用硅基流动 API 生成 Hero 背景图，并直接保存到 public/hero-bg.jpg
// 用法（PowerShell）：
//   $env:SILICONFLOW_API_KEY="sk-你的key"
//   node scripts/generate-hero.mjs
// 可选环境变量：SF_IMAGE_MODEL / SF_SIZE / SF_PROMPT / SF_NEGATIVE
//
// 注意：X-Enable-Watermark: 0 只去掉「AI 生成」显式水印；隐式水印仍存在。
// 商用场景请自行在成品上添加 AI 生成标识。

import fs from 'node:fs/promises'
import path from 'node:path'

const API_KEY = process.env.SILICONFLOW_API_KEY
if (!API_KEY) {
  console.error('缺少 SILICONFLOW_API_KEY 环境变量。')
  process.exit(1)
}

const model = process.env.SF_IMAGE_MODEL || 'Qwen/Qwen-Image'
const size = process.env.SF_SIZE || '928x1664'
const prompt =
  process.env.SF_PROMPT ||
  `高端美甲工作室宣传主图，极近距离特写一双优雅的亚洲女性手部，
裸粉色与奶油色美甲，甲面细腻有光泽，手轻搭在米白色真丝布料上，
旁边散落几支干花，柔和自然光从左侧打来，浅景深背景虚化，
极简克制的高级感，暖色调，时尚杂志美妆摄影风格，
竖构图，画面上方留出空白用于叠加文字，无人物面部，8K高清`
const negative =
  process.env.SF_NEGATIVE ||
  '卡通, 插画, 塑料感, 过曝, 大红大紫, 杂乱背景, 戒指, 文字, 水印, 畸形手指'

const body = {
  model,
  prompt,
  negative_prompt: negative,
  num_inference_steps: 30,
}

// Qwen-Image 用 image_size + cfg；ERNIE-Image-Turbo 用 size
if (/ernie/i.test(model)) {
  body.size = size
} else {
  body.image_size = size
  body.cfg = 4.0
}

console.log(`模型: ${model} / 尺寸: ${size}`)
console.log('正在请求硅基流动生图接口...')

const res = await fetch('https://api.siliconflow.cn/v1/images/generations', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'X-Enable-Watermark': '0',
  },
  body: JSON.stringify(body),
})

if (!res.ok) {
  console.error('请求失败:', res.status)
  console.error(await res.text())
  process.exit(1)
}

const data = await res.json()
const imageUrl =
  data?.images?.[0]?.url ||
  data?.data?.[0]?.url ||
  data?.data?.[0]?.b64_json

if (!imageUrl) {
  console.error('响应里没有图片地址:', JSON.stringify(data, null, 2))
  process.exit(1)
}

const outPath = path.resolve('public/hero-bg.jpg')
await fs.mkdir(path.dirname(outPath), { recursive: true })

if (imageUrl.startsWith('data:') || (!imageUrl.startsWith('http') && imageUrl.length > 200)) {
  const base64 = imageUrl.includes(',') ? imageUrl.split(',')[1] : imageUrl
  await fs.writeFile(outPath, Buffer.from(base64, 'base64'))
} else {
  console.log('下载图片（URL 1 小时内有效）...')
  const img = await fetch(imageUrl)
  if (!img.ok) {
    console.error('图片下载失败:', img.status)
    process.exit(1)
  }
  await fs.writeFile(outPath, Buffer.from(await img.arrayBuffer()))
}

console.log(`✅ 已保存: ${outPath}`)
console.log('接下来把 Hero 背景指向 /hero-bg.jpg 即可（我可以帮你接）。')
