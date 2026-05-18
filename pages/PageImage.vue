<template>
  <div class="page-container">
    <h1 class="text-2xl font-bold mb-6">AI 去水印</h1>
    <p class="text-gray-600 mb-4">去除水印与画面中的干扰元素</p>

    <div class="upload-box mb-6" v-if="!uploadedImage">
      <i class="fa fa-cloud-upload text-3xl text-gray-400 mb-2"></i>
      <p class="mb-1">点击或拖拽图片上传</p>
      <p class="text-xs text-gray-500">支持JPG、PNG、WEBP</p>
      <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" ref="fileInput"/>
    </div>

    <div v-else class="space-y-6">
      <div class="text-center bg-gray-100 rounded-xl p-4">
        <img :src="uploadedImage" class="max-w-full mx-auto rounded" alt="上传图片"/>
      </div>

      <div class="text-sm text-gray-600">
        <p class="mb-2"><i class="fa fa-info-circle mr-1 text-indigo-600"></i>在图片上拖拽框选要移除的水印区域</p>
      </div>

      <div class="flex gap-3 justify-center flex-wrap">
        <button @click="processRemoval" class="btn btn-primary" :disabled="!hasSelection">
          <i class="fa fa-magic mr-1"></i>AI去除水印
        </button>
        <button v-if="processedImage" @click="downloadResult" class="btn btn-secondary">
          <i class="fa fa-download mr-1"></i>下载结果
        </button>
        <button @click="deleteImage" class="btn btn-danger">
          <i class="fa fa-trash mr-1"></i>删除
        </button>
      </div>

      <div v-if="processedImage" class="text-center bg-gray-100 rounded-xl p-4">
        <h3 class="font-bold mb-2">处理结果</h3>
        <img :src="processedImage" class="max-w-full mx-auto rounded" alt="处理结果"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const uploadedImage = ref(null)
const processedImage = ref(null)
const fileInput = ref(null)
const hasSelection = ref(false)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    uploadedImage.value = e.target.result
    processedImage.value = null
  }
  reader.readAsDataURL(file)
}

const deleteImage = () => {
  uploadedImage.value = null
  processedImage.value = null
  if (fileInput.value) fileInput.value.value = ''
}

const processRemoval = () => {
  alert('水印移除功能开发中...')
  processedImage.value = uploadedImage.value
}

const downloadResult = () => {
  const a = document.createElement('a')
  a.href = processedImage.value
  a.download = 'removed-watermark.png'
  a.click()
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

.btn-primary:hover:not(:disabled) {
  background-color: #4f46e5;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
