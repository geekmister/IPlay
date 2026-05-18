<template>
  <div class="page-container">
    <h1 class="page-title">图片编辑</h1>
    <p class="page-subtitle">裁剪、压缩、旋转等基础编辑功能</p>

    <div class="upload-box" v-if="!uploadedImage" @click="fileInput.click()">
      <i class="fa fa-image upload-icon"></i>
      <p>点击或拖拽图片上传</p>
      <p class="upload-hint">支持 JPG、PNG、WEBP</p>
      <input type="file" accept="image/*" @change="handleFileUpload" style="display:none" ref="fileInput" />
    </div>

    <div v-else class="workspace">
      <div class="image-preview">
        <img :src="uploadedImage" :style="{ transform: `rotate(${rotation}deg)` }" alt="编辑图片" />
        <div class="btn-group btn-group--center" style="margin-top:16px">
          <button @click="rotateLeft" class="btn btn-secondary"><i class="fa fa-undo"></i> 逆时针</button>
          <button @click="rotateRight" class="btn btn-secondary"><i class="fa fa-repeat"></i> 顺时针</button>
          <button @click="deleteImage" class="btn btn-danger"><i class="fa fa-trash"></i> 删除</button>
        </div>
      </div>

      <div class="grid-2">
        <button @click="showCompressPanel = !showCompressPanel" class="btn btn-primary btn--full">
          <i class="fa fa-compress"></i> 压缩图片
        </button>
        <button @click="showCropPanel = !showCropPanel" class="btn btn-primary btn--full">
          <i class="fa fa-crop"></i> 裁剪图片
        </button>
      </div>

      <div v-if="showCompressPanel" class="compress-panel">
        <h3 class="section-title">压缩设置</h3>
        <div class="compress-form">
          <div class="form-group">
            <label class="form-label">输出格式</label>
            <select v-model="compressFormat" class="form-control">
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
              <option value="image/png">PNG</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">压缩质量: {{ compressQuality }}%</label>
            <input v-model.number="compressQuality" type="range" min="10" max="100" class="range-input" />
          </div>
          <button @click="compress" class="btn btn-primary btn--full">
            <i class="fa fa-download"></i> 压缩并下载
          </button>
        </div>
      </div>

      <div v-if="showCropPanel" class="crop-panel">
        <h3 class="section-title">裁剪设置</h3>
        <p class="crop-panel__desc">功能开发中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const uploadedImage = ref(null)
const fileInput = ref(null)
const rotation = ref(0)
const showCompressPanel = ref(false)
const showCropPanel = ref(false)
const compressFormat = ref('image/jpeg')
const compressQuality = ref(75)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => { uploadedImage.value = e.target.result }
  reader.readAsDataURL(file)
}

const rotateLeft = () => { rotation.value = (rotation.value - 90) % 360 }
const rotateRight = () => { rotation.value = (rotation.value + 90) % 360 }
const deleteImage = () => { uploadedImage.value = null; rotation.value = 0; if (fileInput.value) fileInput.value.value = '' }

const getExtFromFormat = () => ({ 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/png': 'png' }[compressFormat.value] || 'jpg')

const compress = () => {
  const canvas = document.createElement('canvas')
  const img = new Image()
  img.onload = () => {
    canvas.width = img.width; canvas.height = img.height
    canvas.getContext('2d').drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `compressed.${getExtFromFormat()}` })
      a.click(); URL.revokeObjectURL(a.href)
    }, compressFormat.value, compressQuality.value / 100)
  }
  img.src = uploadedImage.value
}
</script>

<style scoped>
.compress-panel {
  background: var(--color-blue-50);
  border: 1px solid var(--color-blue-border);
  border-radius: var(--radius-xl);
  padding: 16px;
}
.compress-form { display: flex; flex-direction: column; gap: 12px; }
.range-input { width: 100%; margin-top: 4px; }
.crop-panel {
  background: var(--color-green-50);
  border: 1px solid var(--color-green-border);
  border-radius: var(--radius-xl);
  padding: 16px;
}
.crop-panel__desc { font-size: var(--font-sm); color: var(--color-gray-600); }
</style>
