<template>
  <div class="page-container">
    <h1 class="text-2xl font-bold mb-6">批量与输出</h1>
    <p class="text-gray-600 mb-4">批处理、拼图海报、图像与 PDF 工作流</p>

    <div class="grid lg:grid-cols-2 gap-6">
      <!-- 批量压缩与水印 -->
      <div class="border rounded-lg p-6">
        <h3 class="font-bold mb-4 flex items-center gap-2">
          <i class="fa fa-files-o"></i>批量压缩与水印
        </h3>
        <div class="upload-box mb-4" @click="batchInput.click()">
          <p class="text-sm mb-1">选择或拖拽批量图片</p>
          <p class="text-xs text-gray-500">适合批量压缩、统一加水印后逐张下载</p>
          <input type="file" accept="image/*" multiple @change="handleBatchUpload" class="hidden" ref="batchInput"/>
        </div>
        <input v-model="batchMark" type="text" value="IPlay" class="w-full border rounded px-3 py-2 mb-3" placeholder="水印文字"/>
        <label class="text-sm text-gray-600 block mb-3">压缩质量: {{ batchQuality }}</label>
        <input v-model.number="batchQuality" type="range" min="0.3" max="0.95" step="0.05" class="w-full mb-3"/>
        <button @click="processBatch" class="btn btn-primary w-full">
          <i class="fa fa-magic mr-1"></i>开始批处理
        </button>
      </div>

      <!-- 拼图海报 -->
      <div class="border rounded-lg p-6">
        <h3 class="font-bold mb-4 flex items-center gap-2">
          <i class="fa fa-th-large"></i>拼图海报
        </h3>
        <div class="upload-box mb-4" @click="collageInput.click()">
          <p class="text-sm mb-1">选择或拖拽拼图图片</p>
          <p class="text-xs text-gray-500">2-9 张图片适合制作封面和海报</p>
          <input type="file" accept="image/*" multiple @change="handleCollageUpload" class="hidden" ref="collageInput"/>
        </div>
        <div class="grid grid-cols-2 gap-3 mb-3">
          <select v-model="collageGrid" class="border rounded px-3 py-2">
            <option value="2">2x2</option>
            <option value="3">3x3</option>
          </select>
          <input v-model="collageTitle" type="text" value="IPlay Collage" class="border rounded px-3 py-2" placeholder="海报标题"/>
        </div>
        <div class="flex gap-3">
          <button @click="renderCollage" class="btn btn-secondary flex-1">
            <i class="fa fa-picture-o mr-1"></i>生成
          </button>
          <button v-if="collageResult" @click="downloadCollage" class="btn btn-secondary flex-1">
            <i class="fa fa-download mr-1"></i>下载
          </button>
        </div>
      </div>
    </div>

    <!-- 图像与 PDF 工作流 -->
    <div class="mt-6 grid md:grid-cols-2 gap-6">
      <div class="border rounded-lg p-6">
        <h3 class="font-bold mb-4">
          <i class="fa fa-file-image-o mr-1"></i>图像转 PDF
        </h3>
        <div class="upload-box mb-4" @click="imagesToPdfInput.click()">
          <p class="text-sm mb-1">选择或拖拽图片</p>
          <p class="text-xs text-gray-500">用于整理成 PDF</p>
          <input type="file" accept="image/*" multiple @change="handleImagesToConvert" class="hidden" ref="imagesToPdfInput"/>
        </div>
        <button @click="convertImagesToPdf" class="btn btn-primary w-full">
          <i class="fa fa-download mr-1"></i>转为 PDF
        </button>
      </div>

      <div class="border rounded-lg p-6">
        <h3 class="font-bold mb-4">
          <i class="fa fa-file-pdf-o mr-1"></i>PDF 转图像
        </h3>
        <div class="upload-box mb-4" @click="pdfToImageInput.click()">
          <p class="text-sm mb-1">选择或拖拽 PDF</p>
          <p class="text-xs text-gray-500">用于拆分导出图片</p>
          <input type="file" accept="application/pdf" @change="handlePdfToConvert" class="hidden" ref="pdfToImageInput"/>
        </div>
        <button @click="convertPdfToImages" class="btn btn-primary w-full">
          <i class="fa fa-download mr-1"></i>转为图片
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const batchInput = ref(null)
const collageInput = ref(null)
const imagesToPdfInput = ref(null)
const pdfToImageInput = ref(null)

const batchMark = ref('IPlay')
const batchQuality = ref(0.75)
const collageGrid = ref('2')
const collageTitle = ref('IPlay Collage')
const collageResult = ref(null)

const handleBatchUpload = (event) => {
  const files = Array.from(event.target.files)
  console.log(`选择了 ${files.length} 张图片进行批处理`)
}

const processBatch = () => {
  alert('批处理功能开发中...')
}

const handleCollageUpload = (event) => {
  const files = Array.from(event.target.files)
  console.log(`选择了 ${files.length} 张图片用于拼图`)
}

const renderCollage = () => {
  alert('拼图生成功能开发中...')
  collageResult.value = true
}

const downloadCollage = () => {
  alert('拼图下载功能开发中...')
}

const handleImagesToConvert = (event) => {
  const files = Array.from(event.target.files)
  console.log(`选择了 ${files.length} 张图片用于转 PDF`)
}

const convertImagesToPdf = () => {
  alert('图像转 PDF 功能开发中...')
}

const handlePdfToConvert = (event) => {
  const file = event.target.files[0]
  console.log(`选择了 PDF 文件：${file?.name}`)
}

const convertPdfToImages = () => {
  alert('PDF 转图像功能开发中...')
}
</script>

<style scoped>
.page-container {
  padding: 32px 20px;
}
</style>
