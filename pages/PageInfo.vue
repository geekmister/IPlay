<template>
  <div class="page-container">
    <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-900/40 shadow-sm max-w-5xl mx-auto">
      <div class="px-5 pt-5 pb-3 border-b border-gray-100 dark:border-gray-800">
        <h3 class="text-lg font-semibold"><i class="fa fa-info-circle mr-1 text-primary"></i>图片信息总览</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">上传图片后查看完整元数据。</p>
        <div class="mt-4 grid gap-3 md:grid-cols-2">
          <div class="rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/70 dark:bg-indigo-500/10 p-3">
            <div class="flex items-center justify-between gap-2 mb-2">
              <p class="text-sm font-semibold text-indigo-700 dark:text-indigo-200">
                <i class="fa fa-database mr-1"></i>完整信息操作
              </p>
              <span class="text-[11px] px-2 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/40 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-500/30">可选字段</span>
            </div>
            <p class="text-xs text-indigo-700/80 dark:text-indigo-100/80 mb-3">用于归档、排查和完整数据导出。</p>
            <div class="flex flex-wrap gap-2">
              <button @click="copyAllInfo" class="btn btn-primary text-sm inline-flex items-center justify-center min-w-[138px]">
                <i class="fa fa-copy mr-1"></i>复制全部信息
              </button>
              <button @click="exportJson" class="btn btn-secondary text-sm inline-flex items-center justify-center min-w-[138px]">
                <i class="fa fa-download mr-1"></i>导出 JSON
              </button>
            </div>
          </div>

          <div class="rounded-xl border border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/70 dark:bg-emerald-500/10 p-3">
            <div class="flex items-center justify-between gap-2 mb-2">
              <p class="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                <i class="fa fa-shield mr-1"></i>摘要/脱敏操作
              </p>
              <span class="text-[11px] px-2 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/40 text-emerald-700 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-500/30">固定安全字段</span>
            </div>
            <p class="text-xs text-emerald-700/80 dark:text-emerald-100/80 mb-3">用于分享或外发，默认忽略路径、GPS、哈希等敏感信息。</p>
            <div class="flex flex-wrap gap-2">
              <button @click="copySummary" class="btn btn-primary text-sm inline-flex items-center justify-center min-w-[138px]">
                <i class="fa fa-file-text-o mr-1"></i>复制摘要版
              </button>
              <button @click="exportMasked" class="btn btn-secondary text-sm inline-flex items-center justify-center min-w-[138px]">
                <i class="fa fa-shield mr-1"></i>脱敏导出
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="p-5">
        <div class="upload-box mb-4 relative" style="min-height:180px">
          <div v-if="!currentImage" class="flex flex-col items-center justify-center py-4">
            <i class="fa fa-photo text-3xl text-gray-400 mb-2"></i>
            <p class="mb-1">上传图片用于信息分析</p>
            <p class="text-xs text-gray-500">支持 JPG、PNG、WEBP</p>
          </div>
          <div v-else class="relative mx-auto flex items-center justify-center bg-transparent">
            <div class="relative inline-block">
              <img :src="currentImage" class="max-w-full mx-auto rounded-xl border border-gray-200 dark:border-gray-700" alt="信息预览图"/>
            </div>
          </div>
          <div v-if="currentImage" class="absolute right-2 top-2 z-20 flex flex-col gap-2">
            <button @click="deleteImage" type="button" title="删除图片"
              class="bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all">
              <i class="fa fa-times"></i>
            </button>
          </div>
          <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" ref="fileInput"/>
        </div>

        <div v-if="!currentImage" class="text-sm text-gray-500 dark:text-gray-400 leading-6">
          <p><i class="fa fa-image mr-1 text-primary"></i>暂无图片，请先上传图片。</p>
        </div>

        <div v-else class="space-y-4 text-sm">
          <div class="grid md:grid-cols-2 gap-2">
            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 px-3 py-2">
              <p class="text-xs text-gray-500">文件名</p>
              <p class="font-medium break-all">{{ imageInfo.name || '-' }}</p>
            </div>
            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 px-3 py-2">
              <p class="text-xs text-gray-500">大小</p>
              <p class="font-medium">{{ imageInfo.size || '-' }}</p>
            </div>
          </div>

          <div class="grid md:grid-cols-4 gap-2">
            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 px-3 py-2">
              <p class="text-xs text-gray-500">像素尺寸</p>
              <p class="font-medium">{{ imageInfo.dimensions || '-' }}</p>
            </div>
            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 px-3 py-2">
              <p class="text-xs text-gray-500">纵横比</p>
              <p class="font-medium">{{ imageInfo.aspectRatio || '-' }}</p>
            </div>
            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 px-3 py-2">
              <p class="text-xs text-gray-500">百万像素</p>
              <p class="font-medium">{{ imageInfo.megapixels || '-' }}</p>
            </div>
            <div class="rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 px-3 py-2">
              <p class="text-xs text-gray-500">总像素</p>
              <p class="font-semibold text-primary">{{ imageInfo.totalPixels || '-' }}</p>
            </div>
          </div>

          <div class="rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-3 py-2">
            <p class="text-xs text-gray-500">SHA-256 指纹</p>
            <p class="font-mono text-xs break-all text-primary">{{ imageInfo.hash || '计算中...' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentImage = ref(null)
const fileInput = ref(null)
const imageInfo = ref({
  name: '',
  size: '',
  dimensions: '',
  aspectRatio: '',
  megapixels: '',
  totalPixels: '',
  hash: ''
})

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  imageInfo.value.name = file.name
  imageInfo.value.size = formatFileSize(file.size)

  const reader = new FileReader()
  reader.onload = (e) => {
    currentImage.value = e.target.result
    analyzeImage(file)
  }
  reader.readAsDataURL(file)
}

const analyzeImage = (file) => {
  const img = new Image()
  img.onload = () => {
    const width = img.width
    const height = img.height
    const totalPixels = width * height
    const megapixels = (totalPixels / 1000000).toFixed(2)
    const aspectRatio = (width / height).toFixed(2)

    imageInfo.value.dimensions = `${width} × ${height}`
    imageInfo.value.aspectRatio = aspectRatio
    imageInfo.value.megapixels = megapixels
    imageInfo.value.totalPixels = totalPixels.toLocaleString()
  }
  img.src = URL.createObjectURL(file)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const copyAllInfo = async () => {
  const info = `文件名: ${imageInfo.value.name}\n尺寸: ${imageInfo.value.dimensions}\n纵横比: ${imageInfo.value.aspectRatio}\n总像素: ${imageInfo.value.totalPixels}`
  await navigator.clipboard.writeText(info)
  alert('已复制到剪贴板')
}

const copySummary = async () => {
  const info = `尺寸: ${imageInfo.value.dimensions}\n百万像素: ${imageInfo.value.megapixels}`
  await navigator.clipboard.writeText(info)
  alert('已复制摘要版到剪贴板')
}

const exportJson = () => {
  const json = JSON.stringify(imageInfo.value, null, 2)
  downloadText(json, 'image-info.json')
}

const exportMasked = () => {
  const masked = {
    dimensions: imageInfo.value.dimensions,
    megapixels: imageInfo.value.megapixels
  }
  const json = JSON.stringify(masked, null, 2)
  downloadText(json, 'image-info-masked.json')
}

const downloadText = (text, filename) => {
  const blob = new Blob([text], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

const deleteImage = () => {
  currentImage.value = null
  imageInfo.value = {
    name: '',
    size: '',
    dimensions: '',
    aspectRatio: '',
    megapixels: '',
    totalPixels: '',
    hash: ''
  }
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

.text-primary {
  color: #6366f1;
}
</style>
