<template>
  <div class="page-container">
    <div class="info-card">

      <!-- 顶部操作区 -->
      <div class="info-card__header">
        <h3 class="section-title">
          <i class="fa fa-info-circle" style="margin-right:6px;color:var(--color-primary)"></i>图片信息总览
        </h3>
        <p class="info-card__subtitle">上传图片后查看完整元数据。</p>

        <div class="info-action-grid">
          <div class="info-action-panel info-action-panel--indigo">
            <div class="info-action-panel__header">
              <p class="info-action-panel__title">
                <i class="fa fa-database" style="margin-right:4px"></i>完整信息操作
              </p>
              <span class="info-action-panel__badge">可选字段</span>
            </div>
            <p class="info-action-panel__desc">用于归档、排查和完整数据导出。</p>
            <div class="btn-group">
              <button @click="copyAllInfo" class="btn btn-primary">
                <i class="fa fa-copy"></i>复制全部信息
              </button>
              <button @click="exportJson" class="btn btn-secondary">
                <i class="fa fa-download"></i>导出 JSON
              </button>
            </div>
          </div>

          <div class="info-action-panel info-action-panel--emerald">
            <div class="info-action-panel__header">
              <p class="info-action-panel__title">
                <i class="fa fa-shield" style="margin-right:4px"></i>摘要/脱敏操作
              </p>
              <span class="info-action-panel__badge">固定安全字段</span>
            </div>
            <p class="info-action-panel__desc">用于分享或外发，默认忽略路径、GPS、哈希等敏感信息。</p>
            <div class="btn-group">
              <button @click="copySummary" class="btn btn-primary">
                <i class="fa fa-file-text-o"></i>复制摘要版
              </button>
              <button @click="exportMasked" class="btn btn-secondary">
                <i class="fa fa-shield"></i>脱敏导出
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 上传 + 数据展示区 -->
      <div class="info-card__body">
        <div class="upload-wrapper">
          <div
            class="upload-box"
            :class="{ 'upload-box--filled': currentImage }"
            style="min-height:180px; position:relative;"
            @click="!currentImage && fileInput.click()"
          >
            <div v-if="!currentImage" class="upload-box__placeholder">
              <i class="fa fa-photo upload-icon"></i>
              <p>上传图片用于信息分析</p>
              <p class="upload-hint">支持 JPG、PNG、WEBP</p>
            </div>
            <div v-else class="upload-box__preview">
              <img :src="currentImage" class="preview-img" alt="信息预览图" />
            </div>
            <input
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              style="display:none"
              ref="fileInput"
            />
          </div>
          <div v-if="currentImage" class="delete-btn-wrap">
            <button @click.stop="deleteImage" type="button" title="删除图片" class="btn-icon-delete">
              <i class="fa fa-times"></i>
            </button>
          </div>
        </div>

        <!-- 空状态提示 -->
        <p v-if="!currentImage" class="empty-hint">
          <i class="fa fa-image" style="margin-right:4px;color:var(--color-primary)"></i>暂无图片，请先上传图片。
        </p>

        <!-- 元数据展示 -->
        <div v-else class="info-data">
          <div class="info-row-2">
            <div class="info-cell">
              <p class="info-cell__label">文件名</p>
              <p class="info-cell__value">{{ imageInfo.name || '-' }}</p>
            </div>
            <div class="info-cell">
              <p class="info-cell__label">大小</p>
              <p class="info-cell__value">{{ imageInfo.size || '-' }}</p>
            </div>
          </div>

          <div class="info-row-4">
            <div class="info-cell">
              <p class="info-cell__label">像素尺寸</p>
              <p class="info-cell__value">{{ imageInfo.dimensions || '-' }}</p>
            </div>
            <div class="info-cell">
              <p class="info-cell__label">纵横比</p>
              <p class="info-cell__value">{{ imageInfo.aspectRatio || '-' }}</p>
            </div>
            <div class="info-cell">
              <p class="info-cell__label">百万像素</p>
              <p class="info-cell__value">{{ imageInfo.megapixels || '-' }}</p>
            </div>
            <div class="info-cell">
              <p class="info-cell__label">总像素</p>
              <p class="info-cell__value info-cell__value--accent">{{ imageInfo.totalPixels || '-' }}</p>
            </div>
          </div>

          <div class="info-cell info-cell--primary">
            <p class="info-cell__label">SHA-256 指纹</p>
            <p class="info-cell__value--hash">{{ imageInfo.hash || '计算中...' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentImage = ref(null)
const fileInput = ref(null)
const imageInfo = ref({ name: '', size: '', dimensions: '', aspectRatio: '', megapixels: '', totalPixels: '', hash: '' })

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  imageInfo.value.name = file.name
  imageInfo.value.size = formatFileSize(file.size)
  const reader = new FileReader()
  reader.onload = (e) => { currentImage.value = e.target.result; analyzeImage(file) }
  reader.readAsDataURL(file)
}

const analyzeImage = (file) => {
  const img = new Image()
  img.onload = () => {
    const { width, height } = img
    const totalPixels = width * height
    imageInfo.value.dimensions = `${width} × ${height}`
    imageInfo.value.aspectRatio = (width / height).toFixed(2)
    imageInfo.value.megapixels = (totalPixels / 1e6).toFixed(2)
    imageInfo.value.totalPixels = totalPixels.toLocaleString()
  }
  img.src = URL.createObjectURL(file)
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024, sizes = ['B','KB','MB','GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`
}

const copyAllInfo = async () => {
  const t = `文件名: ${imageInfo.value.name}\n尺寸: ${imageInfo.value.dimensions}\n纵横比: ${imageInfo.value.aspectRatio}\n总像素: ${imageInfo.value.totalPixels}`
  await navigator.clipboard.writeText(t)
  alert('已复制到剪贴板')
}
const copySummary = async () => {
  await navigator.clipboard.writeText(`尺寸: ${imageInfo.value.dimensions}\n百万像素: ${imageInfo.value.megapixels}`)
  alert('已复制摘要版到剪贴板')
}
const exportJson = () => downloadText(JSON.stringify(imageInfo.value, null, 2), 'image-info.json')
const exportMasked = () => downloadText(JSON.stringify({ dimensions: imageInfo.value.dimensions, megapixels: imageInfo.value.megapixels }, null, 2), 'image-info-masked.json')
const downloadText = (text, filename) => {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([text])), download: filename })
  a.click(); URL.revokeObjectURL(a.href)
}
const deleteImage = () => {
  currentImage.value = null
  imageInfo.value = { name:'', size:'', dimensions:'', aspectRatio:'', megapixels:'', totalPixels:'', hash:'' }
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.info-card {
  max-width: 960px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-2xl);
  background: rgba(255,255,255,0.75);
  box-shadow: var(--shadow-sm);
}

.info-card__header {
  padding: 20px 20px 14px;
  border-bottom: 1px solid var(--color-gray-100);
}

.info-card__subtitle {
  font-size: var(--font-sm);
  color: var(--color-gray-500);
  margin-bottom: 16px;
  margin-top: 4px;
}

/* 操作面板双列 */
.info-action-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 767px) { .info-action-grid { grid-template-columns: 1fr; } }

.info-action-panel {
  border-radius: var(--radius-lg);
  border: 1px solid;
  padding: 12px;
}
.info-action-panel--indigo {
  background: rgba(238,242,255,0.7);
  border-color: var(--color-indigo-border);
}
.info-action-panel--emerald {
  background: rgba(236,253,245,0.7);
  border-color: var(--color-emerald-border);
}

.info-action-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.info-action-panel__title {
  font-size: var(--font-sm);
  font-weight: 600;
}
.info-action-panel--indigo .info-action-panel__title { color: var(--color-indigo-text); }
.info-action-panel--emerald .info-action-panel__title { color: var(--color-emerald-text); }

.info-action-panel__badge {
  font-size: 0.6875rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  border: 1px solid;
  white-space: nowrap;
}
.info-action-panel--indigo .info-action-panel__badge {
  background: rgba(255,255,255,0.9);
  color: var(--color-indigo-text);
  border-color: var(--color-indigo-border);
}
.info-action-panel--emerald .info-action-panel__badge {
  background: rgba(255,255,255,0.9);
  color: var(--color-emerald-text);
  border-color: var(--color-emerald-border);
}

.info-action-panel__desc {
  font-size: var(--font-xs);
  margin-bottom: 12px;
}
.info-action-panel--indigo .info-action-panel__desc { color: rgba(67,56,202,0.8); }
.info-action-panel--emerald .info-action-panel__desc { color: rgba(4,120,87,0.8); }

/* 卡片主体 */
.info-card__body { padding: 20px; }

.upload-wrapper { position: relative; margin-bottom: 16px; }

.upload-box__placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px; }
.upload-box__preview { padding: 12px; }
.preview-img { max-width: 100%; border-radius: var(--radius-lg); border: 1px solid var(--color-gray-200); margin: 0 auto; }

.delete-btn-wrap {
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 10;
}
.btn-icon-delete {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-red-500);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: var(--shadow-md);
  transition: var(--transition);
}
.btn-icon-delete:hover { background: var(--color-red-600); }

.empty-hint { font-size: var(--font-sm); color: var(--color-gray-500); line-height: 1.65; }

/* 元数据表格 */
.info-data { display: flex; flex-direction: column; gap: 12px; }

.info-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
@media (max-width: 767px) { .info-row-2 { grid-template-columns: 1fr; } }

.info-row-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
@media (max-width: 767px) { .info-row-4 { grid-template-columns: repeat(2, 1fr); } }

.info-cell { background: var(--color-gray-50); border: 1px solid var(--color-gray-100); border-radius: var(--radius-lg); padding: 8px 12px; }
.info-cell--primary { background: var(--color-indigo-50); border-color: var(--color-indigo-border); }

.info-cell__label { font-size: var(--font-xs); color: var(--color-gray-500); margin-bottom: 2px; }
.info-cell__value { font-weight: 500; word-break: break-all; }
.info-cell__value--accent { font-weight: 600; color: var(--color-primary); }
.info-cell__value--hash { font-family: monospace; font-size: var(--font-xs); word-break: break-all; color: var(--color-primary); }
</style>
