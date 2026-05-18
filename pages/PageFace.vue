<template>
  <div class="page-container">
    <h1 class="text-2xl font-bold mb-6">AI 换脸</h1>
    <p class="text-gray-600 mb-4">本地合成人像并拖拽微调位置</p>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- 源人脸 -->
      <div class="space-y-4">
        <h3 class="font-semibold">源人脸</h3>
        <div class="upload-box" v-if="!sourceFace" @click="sourceInput.click()">
          <i class="fa fa-user-circle-o text-3xl text-gray-400 mb-2"></i>
          <p class="mb-1">上传源人脸</p>
          <p class="text-xs text-gray-500">建议使用正脸清晰照片</p>
          <input type="file" accept="image/*" @change="handleSourceUpload" class="hidden" ref="sourceInput"/>
        </div>
        <div v-else class="bg-gray-100 rounded-xl p-4 text-center">
          <img :src="sourceFace" class="max-w-full mx-auto rounded"/>
          <button @click="clearSourceFace" class="btn btn-secondary mt-3 w-full">清除</button>
        </div>
      </div>

      <!-- 目标图片 -->
      <div class="space-y-4">
        <h3 class="font-semibold">目标图片</h3>
        <div class="upload-box" v-if="!targetImage" @click="targetInput.click()">
          <i class="fa fa-picture-o text-3xl text-gray-400 mb-2"></i>
          <p class="mb-1">上传目标图片</p>
          <p class="text-xs text-gray-500">支持人物海报、自拍、场景图</p>
          <input type="file" accept="image/*" @change="handleTargetUpload" class="hidden" ref="targetInput"/>
        </div>
        <div v-else class="bg-gray-100 rounded-xl p-4 text-center">
          <img :src="targetImage" class="max-w-full mx-auto rounded"/>
          <button @click="clearTargetImage" class="btn btn-secondary mt-3 w-full">清除</button>
        </div>
      </div>
    </div>

    <!-- 参数调整 -->
    <div v-if="sourceFace && targetImage" class="mt-6 grid md:grid-cols-3 gap-4">
      <label class="block p-4 rounded-2xl border border-gray-200 bg-white/70">
        <div class="flex justify-between text-sm mb-2">
          <span>脸部尺寸</span>
          <span>{{ faceScale }}%</span>
        </div>
        <input v-model.number="faceScale" type="range" min="35" max="120" class="w-full"/>
      </label>
      <label class="block p-4 rounded-2xl border border-gray-200 bg-white/70">
        <div class="flex justify-between text-sm mb-2">
          <span>融合强度</span>
          <span>{{ faceBlend }}%</span>
        </div>
        <input v-model.number="faceBlend" type="range" min="40" max="100" class="w-full"/>
      </label>
      <label class="block p-4 rounded-2xl border border-gray-200 bg-white/70">
        <div class="flex justify-between text-sm mb-2">
          <span>羽化柔和</span>
          <span>{{ faceFeather }}px</span>
        </div>
        <input v-model.number="faceFeather" type="range" min="8" max="40" class="w-full"/>
      </label>
    </div>

    <!-- 同意条款 -->
    <label v-if="sourceFace && targetImage" class="mt-5 flex items-start gap-3 text-sm text-gray-600">
      <input v-model="consent" type="checkbox" class="mt-1"/>
      <span>我确认已获得图像中人物授权，仅用于合法、合规的本地编辑与预览。</span>
    </label>

    <!-- 操作按钮 -->
    <div v-if="sourceFace && targetImage" class="flex flex-wrap justify-center gap-4 mt-6">
      <button @click="processFaceSwap" class="btn btn-primary" :disabled="!consent">
        <i class="fa fa-user-secret mr-1"></i>开始换脸
      </button>
      <button @click="resetFace" class="btn btn-secondary">
        <i class="fa fa-refresh mr-1"></i>重置位置
      </button>
      <button v-if="resultImage" @click="downloadResult" class="btn btn-secondary">
        <i class="fa fa-download mr-1"></i>下载结果
      </button>
    </div>

    <!-- 结果 -->
    <div v-if="resultImage" class="mt-8 text-center bg-gray-100 rounded-xl p-6">
      <h3 class="font-bold mb-4">处理结果</h3>
      <img :src="resultImage" class="max-w-full mx-auto rounded"/>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const sourceFace = ref(null)
const targetImage = ref(null)
const resultImage = ref(null)
const sourceInput = ref(null)
const targetInput = ref(null)

const faceScale = ref(70)
const faceBlend = ref(82)
const faceFeather = ref(18)
const consent = ref(false)

const handleSourceUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    sourceFace.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleTargetUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    targetImage.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearSourceFace = () => {
  sourceFace.value = null
  if (sourceInput.value) sourceInput.value.value = ''
}

const clearTargetImage = () => {
  targetImage.value = null
  if (targetInput.value) targetInput.value.value = ''
  resultImage.value = null
}

const processFaceSwap = () => {
  alert('换脸功能开发中...')
  resultImage.value = targetImage.value
}

const resetFace = () => {
  faceScale.value = 70
  faceBlend.value = 82
  faceFeather.value = 18
}

const downloadResult = () => {
  const a = document.createElement('a')
  a.href = resultImage.value
  a.download = 'face-swap-result.png'
  a.click()
}
</script>

<style scoped>
.page-container {
  padding: 32px 20px;
}
</style>
