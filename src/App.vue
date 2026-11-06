<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'

// ==================== 数据定义（方便后期替换） ====================

// 精选作品集 — 已使用本地真实美甲图片
const galleryImages = ref([
  { id: 1, category: '极简法式', src: '/gallery/极简法式/1040g00831vt2vuhjis4g5plj0al7e8m6n5roqmo.webp' },
  { id: 2, category: '极简法式', src: '/gallery/极简法式/1040g34o323l3a8opgm305pl099r93p49p519s30.webp' },
  { id: 3, category: '极简法式', src: '/gallery/极简法式/1040g3k031tfrqpm2m86g5pthclr22kkgkogvn58.webp' },
  { id: 4, category: '日式晕染', src: '/gallery/日式晕染/1040g00831u4vu3ds2u005o6i0otg8pgsoia0si8.webp' },
  { id: 5, category: '日式晕染', src: '/gallery/日式晕染/1040g3k831u4j9p37iu305q026u822jgo8oica5g.webp' },
  { id: 6, category: '日式晕染', src: '/gallery/日式晕染/1040g3k83232us03u7a705pj6ih30u1bs6rq0m60.webp' },
  { id: 7, category: '立体雕花', src: '/gallery/立体雕花/1040g2sg31tl3ldukmie048rqhd0jk2a85dqi4qg.webp' },
  { id: 8, category: '立体雕花', src: '/gallery/立体雕花/1040g2sg3218cbj38no005ndtsu4g8ijj7pmbrlg.webp' },
  { id: 9, category: '立体雕花', src: '/gallery/立体雕花/1040g3k031u24p54hh8605pqbocp7dithounu02g.webp' },
  { id: 10, category: '小红书爆款', src: '/gallery/小红书爆款/1040g2sg31muqhh2q52e05n0u2u0hdej4np1gd70.webp' },
  { id: 11, category: '小红书爆款', src: '/gallery/小红书爆款/1040g3k831h502i9njqc05oceatk8cqrh7nl0vj0.webp' },
  { id: 12, category: '小红书爆款', src: '/gallery/小红书爆款/1040g3k831ur55dt33q105ocdh29k18l47eskf38.webp' },
])

// 分类标签
const categories = ref(['全部', '极简法式', '日式晕染', '立体雕花', '小红书爆款'])
const activeCategory = ref('全部')

// 服务与价目表
const services = ref([
  {
    name: '基础护理',
    price: '9.9',
    unit: '起',
    desc: '手部清洁 · 去死皮 · 修型 · 营养护理',
    icon: '✨',
  },
  {
    name: '单色 / 跳色',
    price: '29.9',
    unit: '起',
    desc: '进口甲油胶 · 色泽饱满 · 持久闪耀',
    icon: '💅',
  },
  {
    name: '款式定制',
    price: '面议',
    unit: '',
    desc: '一对一设计 · 手工绘制 · 专属你的美',
    icon: '🎨',
  },
])

// 联系方式（方便后期替换）
const contactInfo = reactive({
  wechatId: 'MUSE_NAIL',
  phone: '13103832320',
  address: '郑州市惠济区绿洲花园 25栋1907',
  businessHours: '10:00 - 20:00',
})

// ==================== 弹窗状态 ====================

const showModal = ref(false)
const copyStatus = ref('一键复制微信号')
const copyBtnDisabled = ref(false)

// ==================== 方法 ====================

function openModal() {
  showModal.value = true
  copyStatus.value = '一键复制微信号'
  copyBtnDisabled.value = false
  // 禁止背景滚动
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  showModal.value = false
  document.body.style.overflow = ''
}

function onOverlayClick(e) {
  if (e.target === e.currentTarget) {
    closeModal()
  }
}

async function copyWechat() {
  const text = contactInfo.wechatId
  copyBtnDisabled.value = true

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      fallbackCopy(text)
    }
  } catch {
    fallbackCopy(text)
  }

  copyStatus.value = '已复制，请打开微信添加'
  // 2 秒后可重新复制
  setTimeout(() => {
    copyBtnDisabled.value = false
    copyStatus.value = '一键复制微信号'
  }, 2500)
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  try {
    document.execCommand('copy')
  } catch {
    // 忽略复制失败
  }
  document.body.removeChild(textarea)
}

function filterGallery(cat) {
  activeCategory.value = cat
}

// 按分类过滤后的作品集
const filteredGallery = computed(() => {
  if (activeCategory.value === '全部') return galleryImages.value
  return galleryImages.value.filter((img) => img.category === activeCategory.value)
})

// ==================== 作品放大灯箱 Lightbox ====================

const showLightbox = ref(false)
const activeIndex = ref(0)
const lightboxImage = computed(() => filteredGallery.value[activeIndex.value])

function openLightbox(index) {
  const len = filteredGallery.value.length
  if (len === 0) return
  activeIndex.value = ((index % len) + len) % len
  showLightbox.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  showLightbox.value = false
  document.body.style.overflow = ''
}

function onLightboxOverlayClick(e) {
  if (e.target === e.currentTarget) closeLightbox()
}

function prevImage() {
  const len = filteredGallery.value.length
  if (len > 1) activeIndex.value = (activeIndex.value - 1 + len) % len
}

function nextImage() {
  const len = filteredGallery.value.length
  if (len > 1) activeIndex.value = (activeIndex.value + 1) % len
}

function onKeydown(e) {
  if (!showLightbox.value) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') prevImage()
  else if (e.key === 'ArrowRight') nextImage()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <!-- ========== PC 端居中容器：手机端全宽，PC 端最大 448px 居中 ========== -->
  <div class="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden">
    <!-- ==================== 1. Hero 首屏 ==================== -->
    <section
      class="relative min-h-screen flex flex-col justify-center items-center text-center px-8 bg-cover bg-center"
      style="background-image: url('/hero-bg.png'); background-color: #c4a59d"
    >
      <!-- 暖色微调层：让照片整体统一在裸粉/米白氛围 -->
      <div class="absolute inset-0 bg-gradient-to-br from-nude-900/30 via-transparent to-nude-800/25"></div>
      <!-- 暗色遮罩：保证白色标题可读 -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/50"></div>

      <!-- 内容区 -->
      <div class="relative z-10 max-w-sm">
        <!-- 品牌标识 -->
        <p class="text-white/80 text-xs tracking-[0.3em] mb-6 font-sans">芊喜 · NAIL ART</p>

        <!-- 主标题 -->
        <h1 class="text-white text-2xl leading-relaxed tracking-wide mb-4 font-serif">
          深耕美甲5年<br />
          <span class="text-nude-300">资深主理人</span>定制
        </h1>

        <!-- 副标题 -->
        <p class="text-white/80 text-sm leading-relaxed mb-10">
          拒绝流水线，只做健康好看的指尖艺术
        </p>

        <!-- 主 CTA 按钮 -->
        <button
          @click="openModal"
          class="inline-flex items-center gap-2 px-10 py-3.5 bg-white/90 hover:bg-white text-nude-700 text-sm font-medium rounded-full transition-all duration-300 active:scale-95"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.691 2.188C3.891 3.348 0 6.266 0 10c0 2.378 1.497 4.511 3.86 5.847.14.126.253.27.337.432l1.174 2.327a.5.5 0 0 0 .707.224l2.207-1.322a6.7 6.7 0 0 1 1.03-.504c.247-.093.508-.163.773-.201a8 8 0 0 0 5.06-2.32C17.534 12.11 19 9.167 19 6c0-3.886-4.04-7.148-9.308-3.812zM9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          </svg>
          立即微信预约
        </button>

        <!-- 向下滚动提示 -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg class="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>

    <!-- ==================== 2. 精选作品集 ==================== -->
    <section class="px-5 py-16">
      <!-- 区域标题 -->
      <div class="mb-8">
        <p class="text-nude-500 text-xs tracking-[0.3em] mb-2">PORTFOLIO</p>
        <h2 class="text-gray-800 text-xl font-serif">精选作品集</h2>
        <p class="text-gray-400 text-sm mt-1">每一双手，都值得被温柔以待</p>
      </div>

      <!-- 分类标签 -- 横向滚动 -->
      <div class="flex gap-2 mb-8 overflow-x-auto pb-1 -mx-5 px-5">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="filterGallery(cat)"
          :class="[
            'shrink-0 px-4 py-1.5 text-xs rounded-full transition-all duration-200 whitespace-nowrap',
            activeCategory === cat
              ? 'bg-nude-500 text-white'
              : 'bg-nude-100 text-nude-700 hover:bg-nude-200',
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <!-- 作品瀑布流（CSS columns-2 实现 Masonry） -->
      <div class="columns-2 gap-4 space-y-4">
        <!-- 注意：columns-2 下需用 break-inside-avoid 防止卡片被截断 -->
        <div
          v-for="(img, index) in filteredGallery"
          :key="img.id"
          class="break-inside-avoid mb-4 rounded-2xl overflow-hidden relative group cursor-pointer"
          @click="openLightbox(index)"
        >
          <img
            :src="img.src"
            :alt="img.category"
            class="w-full h-auto block"
            loading="lazy"
          />

          <!-- hover 遮罩与标签 -->
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end p-3">
            <span class="text-white text-xs bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {{ img.category }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 3. 服务与价目表 ==================== -->
    <section class="px-5 py-12 bg-cream">
      <div class="mb-8">
        <p class="text-nude-500 text-xs tracking-[0.3em] mb-2">SERVICES</p>
        <h2 class="text-gray-800 text-xl font-serif">服务与价目表</h2>
        <p class="text-gray-400 text-sm mt-1">明码标价，透明消费</p>
      </div>

      <!-- 三列服务卡 -->
      <div class="space-y-4">
        <div
          v-for="svc in services"
          :key="svc.name"
          class="bg-white rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 hover:bg-nude-50"
        >
          <!-- 图标 -->
          <div class="w-12 h-12 rounded-xl bg-nude-100 flex items-center justify-center text-xl shrink-0">
            {{ svc.icon }}
          </div>

          <!-- 内容 -->
          <div class="flex-1 min-w-0">
            <h3 class="text-gray-800 text-sm font-medium">{{ svc.name }}</h3>
            <p class="text-gray-400 text-xs mt-0.5">{{ svc.desc }}</p>
          </div>

          <!-- 价格 -->
          <div class="text-right shrink-0">
            <span class="text-nude-600 text-lg font-semibold font-serif">
              <template v-if="svc.price === '面议'">面议</template>
              <template v-else>¥{{ svc.price }}</template>
            </span>
            <span v-if="svc.unit" class="text-gray-400 text-xs ml-0.5">{{ svc.unit }}</span>
          </div>
        </div>
      </div>

      <!-- 底部预约引导 -->
      <button
        @click="openModal"
        class="mt-6 w-full py-3 bg-nude-500 hover:bg-nude-600 text-white text-sm font-medium rounded-full transition-all duration-300 active:scale-[0.98]"
      >
        预约服务 · 了解更多
      </button>
    </section>

    <!-- ==================== 4. 关于主理人 ==================== -->
    <section class="px-5 py-16">
      <div class="mb-8">
        <p class="text-nude-500 text-xs tracking-[0.3em] mb-2">ABOUT</p>
        <h2 class="text-gray-800 text-xl font-serif">关于主理人</h2>
      </div>

      <div class="flex flex-col items-center text-center">
        <!-- 主理人照片 -->
        <div class="w-28 h-28 rounded-full overflow-hidden mb-5 ring-2 ring-nude-200 shadow-md shadow-nude-200/40">
          <img src="/owner.jpg" alt="芊喜主理人" class="w-full h-full object-cover" />
        </div>

        <h3 class="text-gray-800 text-base font-medium mb-1">芊喜 · 主理人</h3>
        <p class="text-nude-500 text-xs mb-4">日本 JNEC 认证美甲师</p>

        <p class="text-gray-500 text-sm leading-relaxed max-w-xs">
          5 年从业经验，曾在东京银座高端沙龙进修。<br />
          懂你的审美，更懂你的指甲健康。<br />
          期待用双手，为你的指尖注入温柔与自信。
        </p>

        <!-- 信任标识 -->
        <div class="flex gap-6 mt-6 text-xs text-gray-400">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4 text-nude-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg>
            5 年经验
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4 text-nude-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg>
            进口甲油胶
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4 text-nude-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/></svg>
            严格消毒
          </span>
        </div>
      </div>
    </section>

    <!-- ==================== 5. 到店指南 ==================== -->
    <section class="px-5 py-12 bg-cream">
      <div class="mb-8">
        <p class="text-nude-500 text-xs tracking-[0.3em] mb-2">VISIT</p>
        <h2 class="text-gray-800 text-xl font-serif">到店指南</h2>
      </div>

      <div class="space-y-4 text-sm">
        <!-- 地址 -->
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-full bg-nude-100 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-nude-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-800 font-medium mb-0.5">店铺地址</p>
            <p class="text-gray-500 leading-relaxed">{{ contactInfo.address }}</p>
          </div>
        </div>

        <!-- 营业时间 -->
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-full bg-nude-100 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-nude-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-800 font-medium mb-0.5">营业时间</p>
            <p class="text-gray-500">{{ contactInfo.businessHours }}</p>
          </div>
        </div>

        <!-- 电话 -->
        <div class="flex items-start gap-3">
          <div class="w-9 h-9 rounded-full bg-nude-100 flex items-center justify-center shrink-0 mt-0.5">
            <svg class="w-4 h-4 text-nude-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-800 font-medium mb-0.5">预约电话</p>
            <a :href="'tel:' + contactInfo.phone" class="text-nude-600 hover:text-nude-700 transition-colors">
              {{ contactInfo.phone }}
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== 6. 页脚 ==================== -->
    <footer class="px-5 py-8 text-center bg-white border-t border-nude-100 pb-24">
      <p class="text-gray-300 text-xs tracking-[0.2em] mb-2">芊喜 · NAIL ART</p>
      <p class="text-gray-400 text-xs">© 2026 芊喜美甲 · 用心做好每一双手</p>
      <p class="text-gray-300 text-[10px] mt-1">拒绝流水线，只做健康好看的指尖艺术</p>
    </footer>

    <!-- ==================== 7. 底部吸底预约按钮 ==================== -->
    <!-- 占位空间，防止内容被底部按钮遮挡 -->
    <div class="h-16"></div>
  </div>

  <!-- 吸底按钮：与主容器同宽，PC 端居中 -->
  <div class="fixed bottom-0 left-0 right-0 z-40 pointer-events-none">
    <div class="max-w-md mx-auto pointer-events-auto px-4 pb-4 pt-2"
      style="background: linear-gradient(to top, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)">
      <button
        @click="openModal"
        class="w-full py-3.5 bg-nude-500 hover:bg-nude-600 active:bg-nude-700 text-white text-sm font-medium rounded-full transition-all duration-300 active:scale-[0.98] shadow-lg shadow-nude-500/25 flex items-center justify-center gap-2"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 3.348 0 6.266 0 10c0 2.378 1.497 4.511 3.86 5.847.14.126.253.27.337.432l1.174 2.327a.5.5 0 0 0 .707.224l2.207-1.322a6.7 6.7 0 0 1 1.03-.504c.247-.093.508-.163.773-.201a8 8 0 0 0 5.06-2.32C17.534 12.11 19 9.167 19 6c0-3.886-4.04-7.148-9.308-3.812zM9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
        微信预约
      </button>
    </div>
  </div>

  <!-- ==================== 8. 预约弹窗 Modal ==================== -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-5"
        @click="onOverlayClick"
      >
        <!-- 遮罩 -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- 弹窗卡片 -->
        <div class="relative bg-white rounded-2xl w-full max-w-xs p-6 shadow-2xl z-10">
          <!-- 关闭按钮 -->
          <button
            @click="closeModal"
            class="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-nude-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- 标题 -->
          <div class="text-center mb-5">
            <p class="text-gray-800 text-base font-serif font-medium">添加微信预约</p>
            <p class="text-gray-400 text-xs mt-1">扫码或复制微信号添加好友</p>
          </div>

          <!-- 微信二维码 -->
          <div class="w-44 h-44 mx-auto mb-5 rounded-2xl overflow-hidden bg-nude-100">
            <img
              src="/qrcode.jpg"
              alt="微信二维码"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- 微信号显示 -->
          <div class="text-center mb-4">
            <p class="text-gray-400 text-[11px] mb-1">微信号</p>
            <p class="text-gray-800 text-sm font-medium font-mono tracking-wide">{{ contactInfo.wechatId }}</p>
          </div>

          <!-- 一键复制按钮 -->
          <button
            @click="copyWechat"
            :disabled="copyBtnDisabled"
            :class="[
              'w-full py-2.5 rounded-full text-sm font-medium transition-all duration-300',
              copyBtnDisabled
                ? 'bg-green-50 text-green-600 cursor-default'
                : 'bg-nude-100 text-nude-700 hover:bg-nude-200 active:scale-[0.98]',
            ]"
          >
            <span class="flex items-center justify-center gap-2">
              <svg v-if="!copyBtnDisabled" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ copyStatus }}
            </span>
          </button>

          <!-- 分割线 -->
          <div class="flex items-center gap-3 my-4">
            <div class="flex-1 h-px bg-nude-100"></div>
            <span class="text-gray-300 text-xs">或</span>
            <div class="flex-1 h-px bg-nude-100"></div>
          </div>

          <!-- 电话直拨 -->
          <a
            :href="'tel:' + contactInfo.phone"
            class="block w-full py-2.5 text-center border border-nude-200 rounded-full text-sm text-nude-600 hover:bg-nude-50 transition-colors"
          >
            📞 直接拨打 {{ contactInfo.phone }}
          </a>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- ==================== 9. 作品放大灯箱 Lightbox ==================== -->
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="showLightbox"
        class="fixed inset-0 z-[60] flex items-center justify-center"
        @click="onLightboxOverlayClick"
      >
        <!-- 遮罩 -->
        <div class="absolute inset-0 bg-black/85 backdrop-blur-sm"></div>

        <!-- 关闭按钮 -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="关闭大图"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- 上一张 -->
        <button
          v-if="filteredGallery.length > 1"
          @click.stop="prevImage"
          class="absolute left-3 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="查看上一张"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- 下一张 -->
        <button
          v-if="filteredGallery.length > 1"
          @click.stop="nextImage"
          class="absolute right-3 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="查看下一张"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- 大图内容 -->
        <div class="relative z-10 w-full max-w-md px-5 flex flex-col items-center">
          <img
            v-if="lightboxImage"
            :src="lightboxImage.src"
            :alt="lightboxImage.category"
            class="max-h-[78vh] max-w-full rounded-2xl shadow-2xl object-contain bg-white/5"
          />
          <div class="mt-4 flex items-center gap-3">
            <span v-if="lightboxImage" class="bg-white/15 backdrop-blur-sm px-3 py-1 rounded-full text-white/90 text-xs">
              {{ lightboxImage.category }}
            </span>
            <span class="text-white/60 text-xs">{{ activeIndex + 1 }} / {{ filteredGallery.length }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}
.modal-leave-to > div:last-child {
  transform: scale(0.92) translateY(20px);
  opacity: 0;
}

/* 灯箱 Lightbox 过渡动画 */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.25s ease;
}
.lightbox-enter-active > div:last-child,
.lightbox-leave-active > div:last-child {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
.lightbox-enter-from > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
.lightbox-leave-to > div:last-child {
  transform: scale(0.95);
  opacity: 0;
}
</style>
