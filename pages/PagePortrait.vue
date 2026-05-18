<template>
  <div class="page-container">
    <h1 class="page-title">AI 人像美化</h1>
    <p class="page-subtitle">磨皮、美妆、瘦身、增强，一站式人像处理</p>

    <div class="upload-box" v-if="!uploadedImage" @click="fileInput.click()">
      <i class="fa fa-user-circle-o upload-icon"></i>
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
  { key: 'retouch', name: '磨皮美颜', desc: '智能祛斑、平滑肤质', detail: '使用深度学习模型识别皮肤区域，智能平滑、匀色，保留五官立体感。' },
  { key: 'makeup', name: '数字上妆', desc: '眼影 / 口红 / 腮红 AI 叠加', detail: '根据你选择的妆容风格，AI 对五官精准叠加数字美妆，颜色自然融合。' },
  { key: 'slim', name: '人像瘦身', desc: '微调面部与身形比例', detail: '基于人体关键点检测，对脸部、腰部等部位进行微拉伸，保持整体自然感。' },
  { key: 'enhance', name: '人像增强', desc: '细节修复、光线补偿', detail: '对低光、模糊人像进行智能超分和光线增强处理，还原细节与通透感。' },
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

