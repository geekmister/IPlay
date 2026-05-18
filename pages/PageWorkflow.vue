<template>
  <div class="page-container">
    <h1 class="page-title">批量与输出</h1>
    <p class="page-subtitle">批量压缩 / 水印 / 拼图 / PDF 转换</p>

    <div class="workflow-grid">

      <!-- 批量压缩 -->
      <div class="workflow-card">
        <h3 class="workflow-card__title">
          <i class="fa fa-compress" style="color:var(--color-primary)"></i>批量压缩
        </h3>
        <div class="upload-box" @click="batchCompressInput.click()">
          <i class="fa fa-folder-open upload-icon"></i>
          <p>点击选择多张图片</p>
          <p class="upload-hint">支持 JPG / PNG / WEBP</p>
          <input type="file" accept="image/*" multiple @change="setBatchCompress" style="display:none" ref="batchCompressInput" />
        </div>
        <p v-if="batchCompressFiles.length" class="workflow-file-count">
          已选 {{ batchCompressFiles.length }} 张
        </p>
        <div class="workflow-form">
          <div class="form-group">
            <label class="form-label">压缩质量: {{ compressQuality }}%</label>
            <input v-model.number="compressQuality" type="range" min="10" max="100" />
          </div>
          <button @click="runBatchCompress" class="btn btn-primary btn--full" :disabled="!batchCompressFiles.length">
            <i class="fa fa-play"></i> 开始压缩
          </button>
        </div>
      </div>

      <!-- 批量水印 -->
      <div class="workflow-card">
        <h3 class="workflow-card__title">
          <i class="fa fa-copyright" style="color:var(--color-primary)"></i>批量水印
        </h3>
        <div class="upload-box" @click="batchWatermarkInput.click()">
          <i class="fa fa-folder-open upload-icon"></i>
          <p>点击选择多张图片</p>
          <p class="upload-hint">支持 JPG / PNG / WEBP</p>
          <input type="file" accept="image/*" multiple @change="setBatchWatermark" style="display:none" ref="batchWatermarkInput" />
        </div>
        <p v-if="batchWatermarkFiles.length" class="workflow-file-count">
          已选 {{ batchWatermarkFiles.length }} 张
        </p>
        <div class="workflow-form">
          <div class="form-group">
            <label class="form-label">水印文字</label>
            <input v-model="watermarkText" class="form-control" placeholder="请输入水印文字" />
          </div>
          <button @click="runBatchWatermark" class="btn btn-primary btn--full" :disabled="!batchWatermarkFiles.length || !watermarkText">
            <i class="fa fa-play"></i> 开始打水印
          </button>
        </div>
      </div>

      <!-- 图片拼图 -->
      <div class="workflow-card">
        <h3 class="workflow-card__title">
          <i class="fa fa-th" style="color:var(--color-primary)"></i>图片拼图
        </h3>
        <div class="upload-box" @click="collageInput.click()">
          <i class="fa fa-folder-open upload-icon"></i>
          <p>点击选择多张图片</p>
          <p class="upload-hint">最少 2 张，最多 9 张</p>
          <input type="file" accept="image/*" multiple @change="setCollage" style="display:none" ref="collageInput" />
        </div>
        <p v-if="collageFiles.length" class="workflow-file-count">
          已选 {{ collageFiles.length }} 张
        </p>
        <div class="workflow-form">
          <div class="form-group">
            <label class="form-label">排列方式</label>
            <select v-model="collageLayout" class="form-control">
              <option value="grid">网格</option>
              <option value="horizontal">横向</option>
              <option value="vertical">纵向</option>
            </select>
          </div>
          <button @click="runCollage" class="btn btn-primary btn--full" :disabled="collageFiles.length < 2">
            <i class="fa fa-play"></i> 生成拼图
          </button>
        </div>
      </div>

      <!-- 图片转 PDF -->
      <div class="workflow-card">
        <h3 class="workflow-card__title">
          <i class="fa fa-file-pdf-o" style="color:var(--color-primary)"></i>图片 → PDF
        </h3>
        <div class="upload-box" @click="pdfInput.click()">
          <i class="fa fa-folder-open upload-icon"></i>
          <p>点击选择多张图片</p>
          <p class="upload-hint">按选择顺序合并为 PDF</p>
          <input type="file" accept="image/*" multiple @change="setPdfImages" style="display:none" ref="pdfInput" />
        </div>
        <p v-if="pdfImages.length" class="workflow-file-count">
          已选 {{ pdfImages.length }} 张
        </p>
        <div class="workflow-form">
          <div class="form-group">
            <label class="form-label">页面尺寸</label>
            <select v-model="pdfPageSize" class="form-control">
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="fit">适应图片</option>
            </select>
          </div>
          <button @click="runImagesToPdf" class="btn btn-primary btn--full" :disabled="!pdfImages.length">
            <i class="fa fa-play"></i> 生成 PDF
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const batchCompressInput = ref(null)
const batchCompressFiles = ref([])
const compressQuality = ref(75)

const batchWatermarkInput = ref(null)
const batchWatermarkFiles = ref([])
const watermarkText = ref('')

const collageInput = ref(null)
const collageFiles = ref([])
const collageLayout = ref('grid')

const pdfInput = ref(null)
const pdfImages = ref([])
const pdfPageSize = ref('A4')

const setBatchCompress = (e) => { batchCompressFiles.value = Array.from(e.target.files) }
const setBatchWatermark = (e) => { batchWatermarkFiles.value = Array.from(e.target.files) }
const setCollage = (e) => { collageFiles.value = Array.from(e.target.files) }
const setPdfImages = (e) => { pdfImages.value = Array.from(e.target.files) }

const runBatchCompress = () => alert('批量压缩功能开发中...')
const runBatchWatermark = () => alert('批量水印功能开发中...')
const runCollage = () => alert('拼图功能开发中...')
const runImagesToPdf = () => alert('图片转PDF功能开发中...')
</script>

<style scoped>
.workflow-file-count { font-size: var(--font-sm); color: var(--color-primary); margin: 8px 0; }
</style>
