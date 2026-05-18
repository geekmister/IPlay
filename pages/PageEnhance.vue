<template>
  <div class="page-container">
    <h1 class="text-2xl font-bold mb-6">修复与增强</h1>
    <p class="text-gray-600 mb-4">老照片修复、物体移除、扩图、清晰增强、调色</p>

    <div class="space-y-6">
      <div class="upload-box" v-if="!uploadedImage">
        <i class="fa fa-picture-o text-3xl text-gray-400 mb-2"></i>
        <p class="mb-1">上传主画布图片</p>
        <p class="text-xs text-gray-500">支持多种格式的修复和增强</p>
        <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" ref="fileInput"/>
      </div>

      <div v-else class="space-y-6">
        <div class="text-center bg-gray-100 rounded-xl p-4">
          <img :src="uploadedImage" class="max-w-full mx-auto rounded" alt="上传图片"/>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <h3 class="font-bold mb-3">功能选择</h3>
            <div class="space-y-2">
              <button v-for="feature in features" :key="feature.key" 
                @click="selectedFeature = feature.key"
                :class="['w-full text-left p-3 rounded border transition', selectedFeature === feature.key ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200']">
                <p class="font-medium text-sm">{{ feature.name }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ feature.desc }}</p>
              </button>
            </div>
          </div>

          <div>
            <h3 class="font-bold mb-3">当前功能</h3>
            <div class="bg-gray-50 border rounded-lg p-4">
              <p class="font-semibold">{{ currentFeatureName }}</p>
              <p class="text-sm text-gray-600 mt-2">{{ currentFeatureDesc }}</p>
              <button @click="processFeature" class="btn btn-primary w-full mt-4">
                <i class="fa fa-magic mr-1"></i>执行当前功能
              </button>
            </div>
          </div>
        </div>

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
const selectedFeature = ref('restore')

const features = [
  { key: 'restore', name: '老照片修复', desc: '改善褪色、泛黄和轻微模糊感' },
  { key: 'remove', name: '物体移除', desc: '框选后自动修补，适合去除画面杂物' },
  { key: 'outpaint', name: 'AI 扩图', desc: '向外扩展画面边缘，适合做封面留白' },
  { key: 'upscale', name: '清晰度增强', desc: '输出 2 倍尺寸并提升整体锐利感' },
  { key: 'lut', name: '智能调色 LUT', desc: '胶片、日系、赛博三种氛围色调' }
]

const currentFeatureName = computed(() => {
  const feature = features.find(f => f.key === selectedFeature.value)
  return feature?.name || '未知功能'
})

const currentFeatureDesc = computed(() => {
  const feature = features.find(f => f.key === selectedFeature.value)
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

const processFeature = () => {
  alert(`功能 "${currentFeatureName.value}" 开发中...`)
  resultImage.value = uploadedImage.value
}

const downloadResult = () => {
  const a = document.createElement('a')
  a.href = resultImage.value
  a.download = `enhance-${selectedFeature.value}-result.png`
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
