<template>
  <div class="page-container">
    <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold mb-2">高级玩法</h1>
        <p class="text-gray-600">进入完整高级工作台，查看全部任务分组</p>
      </div>
      <div class="flex gap-2">
        <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm">任务分组</span>
        <span class="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm">本地处理</span>
      </div>
    </div>

    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
      <button v-for="cat in categories" :key="cat.key"
        @click="selectedCategory = cat.key"
        :class="['p-4 rounded-lg border-2 transition text-left', selectedCategory === cat.key ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200']">
        <div class="flex items-start gap-3">
          <span class="text-xl"><i :class="`fa ${cat.icon}`"></i></span>
          <div>
            <p class="font-bold text-sm">{{ cat.name }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ cat.desc }}</p>
          </div>
        </div>
      </button>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white/70 p-4 mb-6">
      <p class="text-base font-semibold">{{ currentCategoryName }}</p>
      <p class="text-sm text-gray-600 mt-1">{{ currentCategoryDesc }}</p>
    </div>

    <div class="space-y-6">
      <!-- 上传区域 -->
      <div class="upload-box" v-if="!uploadedImage">
        <i class="fa fa-picture-o text-3xl text-gray-400 mb-2"></i>
        <p class="mb-1">上传主画布图片</p>
        <p class="text-xs text-gray-500">当前这一类任务会基于同一张图片持续处理</p>
        <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" ref="fileInput"/>
      </div>

      <div v-if="uploadedImage" class="space-y-6">
        <div class="text-center bg-gray-100 rounded-xl p-4">
          <img :src="uploadedImage" class="max-w-full mx-auto rounded" alt="上传图片"/>
        </div>

        <div class="grid xl:grid-cols-[1.8fr_1fr] gap-4">
          <div class="p-4 rounded-lg border border-gray-200 bg-gray-50">
            <div class="mb-3">
              <p class="text-sm text-gray-600">当前任务</p>
              <p class="text-base font-semibold mt-1">{{ currentFeatureName }}</p>
            </div>
            <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
              <button v-for="feature in currentCategoryFeatures" :key="feature.key"
                @click="selectedFeature = feature.key"
                :class="['p-3 rounded border transition text-left text-xs', selectedFeature === feature.key ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200']">
                <p class="font-medium">{{ feature.name }}</p>
                <p class="text-gray-600 mt-1">{{ feature.desc }}</p>
              </button>
            </div>
          </div>

          <div class="p-4 rounded-lg border border-gray-200 bg-white/70">
            <p class="text-sm text-gray-600">任务说明</p>
            <p class="text-sm text-gray-700 leading-6 mt-2">{{ currentFeatureDesc }}</p>
            <button @click="executeTask" class="btn btn-primary w-full mt-4">
              <i class="fa fa-magic mr-1"></i>执行当前任务
            </button>
          </div>
        </div>

        <!-- 结果 -->
        <div v-if="resultImage" class="text-center bg-gray-100 rounded-xl p-4">
          <h3 class="font-bold mb-2">处理结果</h3>
          <img :src="resultImage" class="max-w-full mx-auto rounded"/>
          <div class="flex gap-2 mt-4 justify-center">
            <button @click="downloadResult" class="btn btn-secondary">
              <i class="fa fa-download mr-1"></i>下载
            </button>
            <button @click="clearResult" class="btn btn-secondary">
              <i class="fa fa-refresh mr-1"></i>清除结果
            </button>
          </div>
        </div>

        <div class="flex gap-2 justify-center">
          <button @click="resetImage" class="btn btn-secondary">
            <i class="fa fa-undo mr-1"></i>恢复上传原图
          </button>
          <button @click="deleteImage" class="btn btn-danger">
            <i class="fa fa-trash mr-1"></i>删除图片
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const uploadedImage = ref(null)
const resultImage = ref(null)
const fileInput = ref(null)
const selectedCategory = ref('portrait')
const selectedFeature = ref('cutout')

const categories = [
  { key: 'portrait', name: '人像与创作', desc: '抠图、证件照、美化', icon: 'fa-user' },
  { key: 'enhance', name: '修复与增强', desc: '老照片修复、移除、扩图', icon: 'fa-wrench' },
  { key: 'text', name: '识别与隐私', desc: 'OCR、翻译、隐私保护', icon: 'fa-eye' },
  { key: 'workflow', name: '批量与输出', desc: '批处理、拼图海报、PDF', icon: 'fa-files-o' }
]

const portraitFeatures = [
  { key: 'cutout', name: '智能抠图与换背景', desc: '快速替换底色或背景' },
  { key: 'idphoto', name: '一键证件照', desc: '按证件比例输出' },
  { key: 'beauty', name: '人像美化', desc: '轻量磨皮提亮' },
  { key: 'style', name: '风格化', desc: '漫画、素描、油画' },
  { key: 'meme', name: '表情包工厂', desc: '给图片加上下文案' }
]

const enhanceFeatures = [
  { key: 'restore', name: '老照片修复', desc: '改善褪色、泛黄' },
  { key: 'remove', name: '物体移除', desc: '框选后自动修补' },
  { key: 'outpaint', name: 'AI 扩图', desc: '向外扩展画面边缘' },
  { key: 'upscale', name: '清晰度增强', desc: '输出 2 倍尺寸' },
  { key: 'lut', name: '智能调色 LUT', desc: '胶片、日系、赛博风格' }
]

const textFeatures = [
  { key: 'ocr', name: 'OCR 识别与翻译', desc: '识别图片文字' },
  { key: 'privacy', name: '图片隐私保护', desc: '自动或手动马赛克' }
]

const workflowFeatures = [
  { key: 'batch', name: '批量压缩与水印', desc: '批处理逐张下载' },
  { key: 'collage', name: '拼图海报', desc: '2x2/3x3 拼图' },
  { key: 'images_to_pdf', name: '图像转 PDF', desc: '整理成 PDF' },
  { key: 'pdf_to_images', name: 'PDF 转图像', desc: '拆分导出图片' }
]

const currentCategoryName = computed(() => {
  const cat = categories.find(c => c.key === selectedCategory.value)
  return cat?.name || ''
})

const currentCategoryDesc = computed(() => {
  const cat = categories.find(c => c.key === selectedCategory.value)
  return cat?.desc || ''
})

const currentCategoryFeatures = computed(() => {
  const featureMap = {
    portrait: portraitFeatures,
    enhance: enhanceFeatures,
    text: textFeatures,
    workflow: workflowFeatures
  }
  return featureMap[selectedCategory.value] || []
})

const currentFeatureName = computed(() => {
  const feature = currentCategoryFeatures.value.find(f => f.key === selectedFeature.value)
  return feature?.name || '未知功能'
})

const currentFeatureDesc = computed(() => {
  const feature = currentCategoryFeatures.value.find(f => f.key === selectedFeature.value)
  return feature?.desc || ''
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target.result
    resultImage.value = null
  }
  reader.readAsDataURL(file)
}

const executeTask = () => {
  alert(`功能 "${currentFeatureName.value}" 开发中...`)
  resultImage.value = uploadedImage.value
}

const downloadResult = () => {
  const a = document.createElement('a')
  a.href = resultImage.value
  a.download = `advanced-${selectedFeature.value}-result.png`
  a.click()
}

const clearResult = () => {
  resultImage.value = null
}

const resetImage = () => {
  resultImage.value = null
}

const deleteImage = () => {
  uploadedImage.value = null
  resultImage.value = null
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.page-container {
  max-width: 6xl;
  margin: 0 auto;
  padding: 32px 20px;
}

.upload-box {
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-box:hover {
  border-color: #6366f1;
  background-color: #f0f4ff;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #6366f1;
  color: white;
}

.btn-primary:hover {
  background-color: #4f46e5;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover {
  background-color: #dc2626;
}
</style>
