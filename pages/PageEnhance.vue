<template>
  <div class="page-container">
    <h1 class="page-title">图片增强</h1>
    <p class="page-subtitle">超分辨率、降噪、锐化、HDR 增强</p>

    <div class="upload-box" v-if="!uploadedImage" @click="fileInput.click()">
      <i class="fa fa-magic upload-icon"></i>
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
  { key: 'upscale', name: '超分辨率', desc: '无损放大 2× / 4×', detail: '基于 Real-ESRGAN 模型，将图片放大 2x 或 4x，智能补全纹理细节。' },
  { key: 'denoise', name: '降噪处理', desc: '去除 ISO 噪点', detail: '识别并去除高 ISO 感光度引起的随机噪点，恢复干净的色彩层次。' },
  { key: 'sharpen', name: '锐化增强', desc: '边缘锐化、细节清晰化', detail: '对模糊图像进行自适应锐化，提升边缘清晰度，同时避免过度锐化伪影。' },
  { key: 'hdr', name: 'HDR 增强', desc: '动态范围提升', detail: '拓展图片的高光和阴影细节，营造 HDR 视觉效果。' },
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

</script>

