<template>
  <div class="page-container">
    <h1 class="text-2xl font-bold mb-6">人像与创作</h1>
    <p class="text-gray-600 mb-4">抠图、证件照、美化、风格化、表情包</p>

    <div class="space-y-6">
      <div class="upload-box" v-if="!uploadedImage" @click="fileInput.click()">
        <i class="fa fa-picture-o text-3xl text-gray-400 mb-2"></i>
        <p class="mb-1">上传主画布图片</p>
        <p class="text-xs text-gray-500">当前功能会基于同一张图片持续处理</p>
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
const selectedFeature = ref('cutout')

const features = [
  { key: 'cutout', name: '智能抠图与换背景', desc: '快速替换底色或背景' },
  { key: 'idphoto', name: '一键证件照', desc: '按证件比例输出，支持切换底色' },
  { key: 'beauty', name: '人像美化', desc: '轻量磨皮提亮，适合自拍和人物照' },
  { key: 'style', name: '风格化', desc: '漫画、素描、油画三种风格快速转化' },
  { key: 'meme', name: '表情包工厂', desc: '给图片加上下文案，适合做梗图输出' }
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
  a.download = `portrait-${selectedFeature.value}-result.png`
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
  padding: 32px 20px;
}
</style>
