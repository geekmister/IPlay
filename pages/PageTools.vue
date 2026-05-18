<template>
  <div class="page-container">
    <h1 class="text-2xl font-bold mb-6">图片编辑</h1>
    <p class="text-gray-600 mb-4">裁剪、压缩、旋转等基础编辑功能</p>

    <div class="upload-box mb-6" v-if="!uploadedImage" @click="fileInput.click()">
      <i class="fa fa-image text-3xl text-gray-400 mb-2"></i>
      <p class="mb-1">点击或拖拽图片上传</p>
      <p class="text-xs text-gray-500">支持 JPG、PNG、WEBP</p>
      <input type="file" accept="image/*" @change="handleFileUpload" class="hidden" ref="fileInput"/>
    </div>

    <div v-else class="space-y-4">
      <div class="relative bg-gray-100 rounded-xl p-4">
        <img :src="uploadedImage" :style="{ transform: `rotate(${rotation}deg)` }" class="max-w-full mx-auto rounded"/>
        <div class="flex gap-2 justify-center mt-4">
          <button @click="rotateLeft" class="btn btn-secondary">
            <i class="fa fa-undo mr-1"></i>逆时针
          </button>
          <button @click="rotateRight" class="btn btn-secondary">
            <i class="fa fa-repeat mr-1"></i>顺时针
          </button>
          <button @click="deleteImage" class="btn btn-danger">
            <i class="fa fa-trash mr-1"></i>删除
          </button>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <button @click="showCompressPanel = !showCompressPanel" class="btn btn-primary w-full">
          <i class="fa fa-compress mr-1"></i>压缩图片
        </button>
        <button @click="showCropPanel = !showCropPanel" class="btn btn-primary w-full">
          <i class="fa fa-crop mr-1"></i>裁剪图片
        </button>
      </div>

      <div v-if="showCompressPanel" class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 class="font-bold mb-3">压缩设置</h3>
        <div class="space-y-3">
          <div>
            <label class="text-sm text-gray-600">输出格式</label>
            <select v-model="compressFormat" class="w-full border rounded px-3 py-2 mt-1">
              <option value="image/jpeg">JPEG</option>
              <option value="image/webp">WebP</option>
              <option value="image/png">PNG</option>
            </select>
          </div>
          <div>
            <label class="text-sm text-gray-600">压缩质量: {{ compressQuality }}%</label>
            <input v-model.number="compressQuality" type="range" min="10" max="100" class="w-full mt-1"/>
          </div>
          <button @click="compress" class="btn btn-primary w-full">
            <i class="fa fa-download mr-1"></i>压缩并下载
          </button>
        </div>
      </div>

      <div v-if="showCropPanel" class="bg-green-50 border border-green-200 rounded-xl p-4">
        <h3 class="font-bold mb-3">裁剪设置</h3>
        <p class="text-sm text-gray-600 mb-3">功能开发中...</p>
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
  reader.onload = (e) => {
    uploadedImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const rotateLeft = () => {
  rotation.value = (rotation.value - 90) % 360
}

const rotateRight = () => {
  rotation.value = (rotation.value + 90) % 360
}

const deleteImage = () => {
  uploadedImage.value = null
  rotation.value = 0
  if (fileInput.value) fileInput.value.value = ''
}

const compress = () => {
  const canvas = document.createElement('canvas')
  const img = new Image()
  img.onload = () => {
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `compressed.${getExtFromFormat()}`
      a.click()
      URL.revokeObjectURL(url)
    }, compressFormat.value, compressQuality.value / 100)
  }
  img.src = uploadedImage.value
}

const getExtFromFormat = () => {
  const map = {
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/png': 'png'
  }
  return map[compressFormat.value]
}
</script>

<style scoped>
.page-container {
  padding: 32px 20px;
}
</style>
