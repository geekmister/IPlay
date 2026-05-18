<template>
  <div class="page-container">
    <div class="adv-header">
      <div>
        <h1 class="page-title">高级玩法</h1>
        <p class="page-subtitle">AI 生图、风格迁移、艺术创作实验区</p>
      </div>
      <div class="adv-header__badges">
        <span class="badge-pill"><i class="fa fa-flask"></i> 实验功能</span>
        <span class="badge-pill badge-pill--vip"><i class="fa fa-star"></i> VIP</span>
      </div>
    </div>

    <!-- 分类选择 -->
    <div class="category-grid">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="category-btn"
        :class="{ 'is-active': selectedCategory === cat.key }"
        @click="selectedCategory = cat.key; uploadedImage = null; resultImage = null"
      >
        <div class="category-btn__inner">
          <i :class="'fa fa-' + cat.icon" class="category-btn__icon"></i>
          <div>
            <p class="category-btn__name">{{ cat.name }}</p>
            <p class="category-btn__desc">{{ cat.desc }}</p>
          </div>
        </div>
      </button>
    </div>

    <!-- 当前分类说明 -->
    <div v-if="currentCategory" class="category-info-card">
      <p class="category-info-card__name">{{ currentCategory.name }}</p>
      <p class="category-info-card__detail">{{ currentCategory.detail }}</p>
    </div>

    <!-- 上传区 -->
    <div class="upload-box" v-if="!uploadedImage" @click="fileInput.click()">
      <i class="fa fa-cloud-upload upload-icon"></i>
      <p>上传图片开始体验</p>
      <p class="upload-hint">支持 JPG、PNG、WEBP</p>
      <input type="file" accept="image/*" @change="handleFileUpload" style="display:none" ref="fileInput" />
    </div>

    <!-- 工作区 -->
    <div v-else class="workspace">
      <div class="task-layout">
        <!-- 功能列表 + 图片预览 -->
        <div class="task-main">
          <div class="task-features">
            <h3 class="section-title">功能列表</h3>
            <div class="task-feature-grid">
              <button
                v-for="feat in currentFeatures"
                :key="feat.key"
                class="task-feature-btn"
                :class="{ 'is-active': selectedFeature === feat.key }"
                @click="selectedFeature = feat.key"
              >
                {{ feat.name }}
              </button>
            </div>
          </div>
          <div class="task-detail" v-if="currentFeatureInfo">
            <p class="task-detail__name">{{ currentFeatureInfo.name }}</p>
            <p class="task-detail__desc">{{ currentFeatureInfo.detail }}</p>
            <button @click="processTask" class="btn btn-vip btn--full" :disabled="processing">
              <i class="fa fa-magic"></i> {{ processing ? '处理中...' : '开始生成' }}
            </button>
          </div>
        </div>

        <!-- 图片预览放置在下方 -->
        <div class="image-preview">
          <img :src="uploadedImage" alt="输入图片" />
        </div>
      </div>

      <div v-if="resultImage" class="result-panel">
        <h3 class="result-panel__title">生成结果</h3>
        <img :src="resultImage" alt="生成结果" />
        <div class="btn-group btn-group--center">
          <button @click="downloadResult" class="btn btn-secondary"><i class="fa fa-download"></i> 下载</button>
        </div>
      </div>

      <div class="action-bar">
        <button @click="deleteImage" class="btn btn-danger"><i class="fa fa-trash"></i> 删除图片</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const uploadedImage = ref(null)
const resultImage = ref(null)
const fileInput = ref(null)
const processing = ref(false)
const selectedCategory = ref('style')
const selectedFeature = ref('')

const categories = [
  { key: 'style', name: '风格迁移', icon: 'paint-brush', desc: '将图片转换为艺术风格', detail: '利用神经网络实现梵高、莫奈、浮世绘等艺术风格迁移，保留图片内容的同时渲染艺术质感。' },
  { key: 'generate', name: 'AI 生图', icon: 'magic', desc: '文本/图片生成创意内容', detail: '基于扩散模型，输入描述词或图片生成高质量创意图像，支持多种分辨率和风格。' },
  { key: 'colorize', name: '图片上色', icon: 'tint', desc: '黑白图片自动上色', detail: '使用 AI 模型对黑白旧照片进行智能上色，参考现实世界颜色分布进行填色，还原真实质感。' },
  { key: 'cartoon', name: '卡通化', icon: 'smile-o', desc: '写实图片转卡通动漫风', detail: '将真实照片转换为卡通或动漫风格，支持多种画风选择。' },
]

const featureMap = {
  style: [
    { key: 'vangogh', name: '梵高风格', detail: '模拟梵高螺旋状笔触和浓厚油彩感。' },
    { key: 'monet', name: '莫奈印象', detail: '模拟莫奈柔和色彩和光影印象派风格。' },
    { key: 'ukiyoe', name: '浮世绘', detail: '日式传统浮世绘线条与配色风格。' },
    { key: 'watercolor', name: '水彩画', detail: '模拟手工水彩流畅晕染效果。' },
  ],
  generate: [
    { key: 'txt2img', name: '文本生图', detail: '输入描述词，AI 自动生成匹配图像。' },
    { key: 'img2img', name: '图片重绘', detail: '以上传图片为底图进行 AI 风格重绘。' },
    { key: 'inpaint', name: '局部重绘', detail: '框选区域进行 AI 局部内容替换。' },
  ],
  colorize: [
    { key: 'auto', name: '自动上色', detail: '全图智能上色，参考真实场景颜色。' },
    { key: 'portrait', name: '人像上色', detail: '专为人像优化的肤色和服饰上色模型。' },
  ],
  cartoon: [
    { key: 'anime', name: '动漫风', detail: '日式动漫线稿+赛璐璐风格上色。' },
    { key: 'pixar', name: '皮克斯风', detail: '3D 卡通渲染，圆润质感。' },
    { key: 'chibi', name: 'Q 版卡通', detail: '夸张可爱的 Q 版风格。' },
  ],
}

const currentCategory = computed(() => categories.find(c => c.key === selectedCategory.value))
const currentFeatures = computed(() => featureMap[selectedCategory.value] ?? [])
const currentFeatureInfo = computed(() => currentFeatures.value.find(f => f.key === selectedFeature.value) ?? currentFeatures.value[0])

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (!selectedFeature.value) selectedFeature.value = currentFeatures.value[0]?.key ?? ''
  const reader = new FileReader()
  reader.onload = (e) => { uploadedImage.value = e.target.result; resultImage.value = null }
  reader.readAsDataURL(file)
}

const processTask = async () => {
  processing.value = true
  await new Promise(r => setTimeout(r, 900))
  resultImage.value = uploadedImage.value
  processing.value = false
}

const deleteImage = () => { uploadedImage.value = null; resultImage.value = null; if (fileInput.value) fileInput.value.value = '' }
const downloadResult = () => {
  const a = Object.assign(document.createElement('a'), { href: resultImage.value, download: 'advanced-result.png' })
  a.click()
}
</script>

<style scoped>
.adv-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
.adv-header__badges { display: flex; gap: 8px; flex-shrink: 0; }
.badge-pill { padding: 4px 12px; border-radius: var(--radius-full); background: var(--color-primary-bg); color: var(--color-primary-dark); font-size: var(--font-sm); }
.badge-pill--vip { background: linear-gradient(135deg, #fef3c7, #fce7f3); color: #b45309; }

.category-info-card { border: 1px solid var(--color-gray-200); border-radius: var(--radius-md); background: rgba(255,255,255,0.75); padding: 14px 16px; margin-bottom: 24px; }
.category-info-card__name { font-weight: 700; color: var(--color-gray-900); margin-bottom: 6px; }
.category-info-card__detail { font-size: var(--font-sm); color: var(--color-gray-600); }

.task-layout { display: flex; flex-direction: column; gap: 16px; }
.task-main { display: grid; grid-template-columns: 1.8fr 1fr; gap: 16px; }
@media (max-width: 1023px) { .task-main { grid-template-columns: 1fr; } }

.task-features { background: var(--color-gray-50); border: 1px solid var(--color-gray-200); border-radius: var(--radius-md); padding: 16px; }
.task-feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
@media (min-width: 1280px) { .task-feature-grid { grid-template-columns: repeat(3, 1fr); } }
.task-feature-btn { padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid var(--color-gray-200); background: #fff; cursor: pointer; text-align: left; font-size: var(--font-sm); transition: var(--transition); }
.task-feature-btn:hover { border-color: var(--color-primary-light); }
.task-feature-btn.is-active { border-color: var(--color-primary-dark); background: var(--color-primary-bg); font-weight: 500; }

.task-detail { background: rgba(255,255,255,0.75); border: 1px solid var(--color-gray-200); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.task-detail__name { font-weight: 600; color: var(--color-gray-900); }
.task-detail__desc { font-size: var(--font-sm); color: var(--color-gray-600); line-height: 1.65; }
</style>
