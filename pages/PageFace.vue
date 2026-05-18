<template>
  <div class="page-container">
    <h1 class="page-title">AI 换脸</h1>
    <p class="page-subtitle">本地合成人像并拖拽微调位置</p>

    <div class="grid-2">
      <!-- 源人脸 -->
      <div class="face-col">
        <h3 class="section-title">源人脸</h3>
        <div class="upload-box" v-if="!sourceFace" @click="sourceInput.click()">
          <i class="fa fa-user-circle-o upload-icon"></i>
          <p>上传源人脸</p>
          <p class="upload-hint">建议使用正脸清晰照片</p>
          <input type="file" accept="image/*" @change="handleSourceUpload" style="display:none" ref="sourceInput" />
        </div>
        <div v-else class="face-preview">
          <img :src="sourceFace" alt="源人脸" />
          <button @click="clearSourceFace" class="btn btn-secondary btn--full" style="margin-top:12px">清除</button>
        </div>
      </div>

      <!-- 目标图片 -->
      <div class="face-col">
        <h3 class="section-title">目标图片</h3>
        <div class="upload-box" v-if="!targetImage" @click="targetInput.click()">
          <i class="fa fa-picture-o upload-icon"></i>
          <p>上传目标图片</p>
          <p class="upload-hint">支持人物海报、自拍、场景图</p>
          <input type="file" accept="image/*" @change="handleTargetUpload" style="display:none" ref="targetInput" />
        </div>
        <div v-else class="face-preview">
          <img :src="targetImage" alt="目标图片" />
          <button @click="clearTargetImage" class="btn btn-secondary btn--full" style="margin-top:12px">清除</button>
        </div>
      </div>
    </div>

    <!-- 参数调整 -->
    <div v-if="sourceFace && targetImage" class="slider-grid">
      <label class="slider-card">
        <div class="slider-card__header">
          <span>脸部尺寸</span><span>{{ faceScale }}%</span>
        </div>
        <input v-model.number="faceScale" type="range" min="35" max="120" class="range-input" />
      </label>
      <label class="slider-card">
        <div class="slider-card__header">
          <span>融合强度</span><span>{{ faceBlend }}%</span>
        </div>
        <input v-model.number="faceBlend" type="range" min="40" max="100" class="range-input" />
      </label>
      <label class="slider-card">
        <div class="slider-card__header">
          <span>羽化柔和</span><span>{{ faceFeather }}px</span>
        </div>
        <input v-model.number="faceFeather" type="range" min="8" max="40" class="range-input" />
      </label>
    </div>

    <!-- 同意条款 -->
    <label v-if="sourceFace && targetImage" class="consent-check">
      <input v-model="consent" type="checkbox" />
      <span>我确认已获得图像中人物授权，仅用于合法、合规的本地编辑与预览。</span>
    </label>

    <!-- 操作按钮 -->
    <div v-if="sourceFace && targetImage" class="action-bar" style="margin-top:24px">
      <button @click="processFaceSwap" class="btn btn-primary" :disabled="!consent">
        <i class="fa fa-user-secret"></i> 开始换脸
      </button>
      <button @click="resetFace" class="btn btn-secondary">
        <i class="fa fa-refresh"></i> 重置位置
      </button>
      <button v-if="resultImage" @click="downloadResult" class="btn btn-secondary">
        <i class="fa fa-download"></i> 下载结果
      </button>
    </div>

    <!-- 结果 -->
    <div v-if="resultImage" class="result-panel" style="margin-top:32px">
      <h3 class="result-panel__title">处理结果</h3>
      <img :src="resultImage" alt="换脸结果" />
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

const readFile = (file, cb) => { const r = new FileReader(); r.onload = (e) => cb(e.target.result); r.readAsDataURL(file) }
const handleSourceUpload = (e) => { if (e.target.files[0]) readFile(e.target.files[0], v => { sourceFace.value = v }) }
const handleTargetUpload = (e) => { if (e.target.files[0]) readFile(e.target.files[0], v => { targetImage.value = v }) }
const clearSourceFace = () => { sourceFace.value = null; if (sourceInput.value) sourceInput.value.value = '' }
const clearTargetImage = () => { targetImage.value = null; if (targetInput.value) targetInput.value.value = '' }
const processFaceSwap = () => { alert('换脸功能开发中...'); resultImage.value = targetImage.value }
const resetFace = () => { resultImage.value = null }
const downloadResult = () => {
  const a = Object.assign(document.createElement('a'), { href: resultImage.value, download: 'face-swap.png' })
  a.click()
}
</script>

<style scoped>
.face-col { display: flex; flex-direction: column; }
.face-preview { background: var(--color-gray-100); border-radius: var(--radius-xl); padding: 16px; text-align: center; }
.face-preview img { max-width: 100%; border-radius: var(--radius-md); margin: 0 auto; }

.slider-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }
@media (max-width: 767px) { .slider-grid { grid-template-columns: 1fr; } }

.slider-card {
  display: block;
  padding: 16px;
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-gray-200);
  background: rgba(255,255,255,0.7);
  cursor: default;
}
.slider-card__header {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-sm);
  margin-bottom: 8px;
  color: var(--color-gray-700);
}
.range-input { width: 100%; }

.consent-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: var(--font-sm);
  color: var(--color-gray-600);
  margin-top: 20px;
  cursor: pointer;
}
.consent-check input { margin-top: 3px; flex-shrink: 0; }
</style>
