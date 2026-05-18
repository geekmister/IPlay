<template>
  <div class="page-container">
    <h1 class="page-title">隐私保护</h1>
    <p class="page-subtitle">人脸、车牌、证件打码与 OCR 文字提取</p>

    <div class="upload-box" v-if="!uploadedImage" @click="fileInput.click()">
      <i class="fa fa-shield upload-icon"></i>
      <p>点击或拖拽图片上传</p>
      <p class="upload-hint">支持 JPG、PNG、WEBP</p>
      <input type="file" accept="image/*" @change="handleFileUpload" style="display:none" ref="fileInput" />
    </div>

    <div v-else class="workspace">
      <div class="image-preview">
        <img :src="uploadedImage" alt="上传图片" />
      </div>

      <div class="feature-panel">
        <div>
          <h3 class="section-title">功能选择</h3>
          <div class="feature-list">
            <button
              v-for="feat in features"
              :key="feat.key"
              class="feature-btn"
              :class="{ 'is-active': selectedFeature === feat.key }"
              @click="selectedFeature = feat.key"
            >
              <p class="feature-btn__name">{ feat.name }</p>
              <p class="feature-btn__desc">{ feat.desc }</p>
            </button>
          </div>
        </div>
        <div>
          <h3 class="section-title">当前功能</h3>
          <div class="feature-detail" v-if="currentFeature">
            <p class="feature-detail__name">{ currentFeature.name }</p>
            <p class="feature-detail__desc">{ currentFeature.detail }</p>
            <button @click="processFeature" class="btn btn-primary btn--full" :disabled="processing">
              <i class="fa fa-cogs"></i> { processing ? '处理中...' : '执行' }
            </button>
          </div>
        </div>
      </div>

      <div v-if="ocrResult" class="ocr-result">
        <h3 class="ocr-result__title"><i class="fa fa-file-text-o" style="margin-right:4px"></i>OCR 识别结果</h3>
        <textarea class="form-control" rows="5" readonly :value="ocrResult" style="resize:vertical"></textarea>
        <div class="btn-group" style="margin-top:10px">
          <button @click="copyOcr" class="btn btn-secondary"><i class="fa fa-copy"></i> 复制</button>
        </div>
      </div>

      <div v-if="resultImage" class="result-panel">
        <h3 class="result-panel__title">处理结果</h3>
        <img :src="resultImage" alt="处理结果" />
        <div class="btn-group btn-group--center">
          <button @click="downloadResult" class="btn btn-secondary"><i class="fa fa-download"></i> 下载</button>
        </div>
      </div>

      <div class="action-bar">
        <button @click="resetImage" class="btn btn-secondary"><i class="fa fa-refresh"></i> 恢复原图</button>
        <button @click="deleteImage" class="btn btn-danger"><i class="fa fa-trash"></i> 删除图片</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const uploadedImage = ref(null)
const resultImage = ref(null)
const fileInput = ref(null)
const processing = ref(false)

const features = [
  { key: 'blur_face', name: '人脸打码', desc: '自动识别并模糊人脸', detail: '使用人脸检测模型定位所有人脸区域，应用高斯模糊进行脱敏处理。' },
  { key: 'blur_plate', name: '车牌打码', desc: '自动识别并遮盖车牌', detail: '检测车牌矩形区域，使用马赛克遮盖，保护隐私信息。' },
  { key: 'blur_id', name: '证件打码', desc: '模糊证件号、卡号等', detail: '识别图片中的身份证、银行卡等证件信息，对号码区域进行自动马赛克处理。' },
  { key: 'ocr', name: '文字提取', desc: '识别图片中的文字', detail: '使用 OCR 引擎提取图片中的文字内容，支持中英文混排识别。' },
]

const selectedFeature = ref(features[0]?.key ?? '')
const currentFeature = computed(() => features.find(f => f.key === selectedFeature.value))

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (e) => { uploadedImage.value = e.target.result; resultImage.value = null }
  reader.readAsDataURL(file)
}

const processFeature = async () => {
  processing.value = true
  await new Promise(r => setTimeout(r, 800))
  resultImage.value = uploadedImage.value
  processing.value = false
}

const resetImage = () => { resultImage.value = null }
const deleteImage = () => { uploadedImage.value = null; resultImage.value = null; if (fileInput.value) fileInput.value.value = '' }
const downloadResult = () => {
  const a = Object.assign(document.createElement('a'), { href: resultImage.value, download: 'result.png' })
  a.click()
}

const ocrResult = ref('')
const copyOcr = async () => { await navigator.clipboard.writeText(ocrResult.value); alert('已复制') }

</script>

<style scoped>
.ocr-result { background: var(--color-blue-50); border: 1px solid var(--color-blue-border); border-radius: var(--radius-md); padding: 16px; }
.ocr-result__title { font-weight: 700; margin-bottom: 10px; color: var(--color-gray-800); }
</style>

