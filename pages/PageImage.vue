<template>
  <div class="page-container">
    <h1 class="page-title">AI 去水印</h1>
    <p class="page-subtitle">去除水印与画面中的干扰元素</p>

    <div class="upload-box" v-if="!uploadedImage" @click="fileInput.click()">
      <i class="fa fa-cloud-upload upload-icon"></i>
      <p>点击或拖拽图片上传</p>
      <p class="upload-hint">支持 JPG、PNG、WEBP</p>
      <input type="file" accept="image/*" @change="handleFileUpload" style="display:none" ref="fileInput" />
    </div>

    <div v-else class="workspace">
      <div class="image-preview">
        <img :src="uploadedImage" alt="上传图片" />
      </div>

      <p class="tip-text">
        <i class="fa fa-info-circle" style="margin-right:4px;color:var(--color-primary)"></i>
        在图片上拖拽框选要移除的水印区域
      </p>

      <div class="action-bar">
        <button @click="processRemoval" class="btn btn-primary" :disabled="!hasSelection">
          <i class="fa fa-magic"></i> AI去除水印
        </button>
        <button v-if="processedImage" @click="downloadResult" class="btn btn-secondary">
          <i class="fa fa-download"></i> 下载结果
        </button>
        <button @click="deleteImage" class="btn btn-danger">
          <i class="fa fa-trash"></i> 删除
        </button>
      </div>

      <div v-if="processedImage" class="result-panel">
        <h3 class="result-panel__title">处理结果</h3>
        <img :src="processedImage" alt="处理结果" />
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
  reader.onload = (e) => { uploadedImage.value = e.target.result; processedImage.value = null }
  reader.readAsDataURL(file)
}

const deleteImage = () => { uploadedImage.value = null; processedImage.value = null; if (fileInput.value) fileInput.value.value = '' }
const processRemoval = () => { alert('水印移除功能开发中...'); processedImage.value = uploadedImage.value }
const downloadResult = () => {
  const a = Object.assign(document.createElement('a'), { href: processedImage.value, download: 'removed-watermark.png' })
  a.click()
}
</script>

<style scoped>
.tip-text { font-size: var(--font-sm); color: var(--color-gray-600); }
</style>
