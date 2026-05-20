<template>
    <div class="page-container">
        <!-- upload section -->
        <div class="upload-box" v-if="!uploadedImage" @click="fileInput.click()">
            <i class="fa fa-cloud-upload upload-icon"></i>
            <p>点击或拖拽图片上传</p>
            <p class="upload-hint">支持 JPG、PNG、WEBP</p>
        </div>

        <div v-else class="workspace">
            <div class="image-preview">
                <img :src="uploadedImage" alt="上传图片" />
            </div>

            <p class="tip-text">
                <i
                    class="fa fa-info-circle"
                    style="margin-right: 4px; color: var(--color-primary)"
                ></i>
                在图片上拖拽框选要移除的水印区域
            </p>

            <div class="action-bar">
                <button @click="processRemoval" class="btn btn-primary" :disabled="!hasSelection">
                    <i class="fa fa-magic"></i>
                    AI去除水印
                </button>
                <button v-if="processedImage" @click="downloadResult" class="btn btn-secondary">
                    <i class="fa fa-download"></i>
                    下载结果
                </button>
                <button @click="deleteImage" class="btn btn-danger">
                    <i class="fa fa-trash"></i>
                    删除
                </button>
            </div>

            <div v-if="processedImage" class="result-panel">
                <h3 class="result-panel__title">处理结果</h3>
                <img :src="processedImage" alt="处理结果" />
            </div>
        </div>

        <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            style="display: none"
            ref="fileInput"
        />

        <div class="brush-sidebar-mask" v-if="showBrushSidebar" @click="closeBrushSidebar"></div>

        <div :class="['brush-sidebar', { 'is-open': showBrushSidebar }]">
            <div class="brush-sidebar__header">
                <div>
                    <p class="brush-sidebar__title">画笔粗细</p>
                    <p class="brush-sidebar__subtitle">拖动滑块调整涂抹范围</p>
                </div>
                <button type="button" class="icon-button" @click="closeBrushSidebar">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="brush-sidebar__content">
                <div class="brush-sidebar__preview">
                    <span>当前粗细：</span>
                    <strong>{{ brushSize }} px</strong>
                </div>
                <input
                    type="range"
                    class="range-input"
                    min="1"
                    max="80"
                    v-model.number="brushSize"
                />
                <p class="brush-sidebar__hint">拖动滑块可实时调整画笔粗细，值越大覆盖范围越广。</p>
            </div>
        </div>

        <div class="operation-panel">
            <button
                type="button"
                class="btn panel-btn"
                :class="{ 'btn-primary': activeTool === 'brush', 'btn-secondary': activeTool !== 'brush' }"
                @click="toggleBrushSidebar"
            >
                <i class="fa fa-paint-brush"></i>
                涂抹选项
            </button>
            <button
                type="button"
                class="btn panel-btn"
                :class="{ 'btn-primary': activeTool === 'frame', 'btn-secondary': activeTool !== 'frame' }"
                @click="selectMode('frame')"
            >
                <i class="fa fa-square-o"></i>
                框选选项
            </button>
            <button type="button" class="btn panel-btn btn-warning" @click="resetOperation">
                <i class="fa fa-refresh"></i>
                重置
            </button>
            <button type="button" class="btn panel-btn btn-danger" @click="deleteImage">
                <i class="fa fa-trash"></i>
                删除
            </button>
            <button type="button" class="btn panel-btn btn-primary" @click="fileInput.click()">
                <i class="fa fa-repeat"></i>
                重选
            </button>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    const uploadedImage = ref(null);
    const processedImage = ref(null);
    const fileInput = ref(null);
    const hasSelection = ref(false);

    const showBrushSidebar = ref(false);
    const brushSize = ref(28);
    const activeTool = ref('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.value = e.target.result;
            processedImage.value = null;
            hasSelection.value = false;
        };
        reader.readAsDataURL(file);
    };

    const deleteImage = () => {
        uploadedImage.value = null;
        processedImage.value = null;
        hasSelection.value = false;
        if (fileInput.value) fileInput.value.value = '';
        closeBrushSidebar();
    };

    const processRemoval = () => {
        alert('水印移除功能开发中...');
        processedImage.value = uploadedImage.value;
    };

    const downloadResult = () => {
        const a = Object.assign(document.createElement('a'), {
            href: processedImage.value,
            download: 'removed-watermark.png',
        });
        a.click();
    };

    const toggleBrushSidebar = () => {
        showBrushSidebar.value = !showBrushSidebar.value;
        activeTool.value = showBrushSidebar.value ? 'brush' : '';
    };

    const closeBrushSidebar = () => {
        showBrushSidebar.value = false;
    };

    const selectMode = (mode) => {
        activeTool.value = mode;
        if (mode === 'frame') {
            closeBrushSidebar();
        }
    };

    const resetOperation = () => {
        activeTool.value = '';
        brushSize.value = 28;
        hasSelection.value = false;
        processedImage.value = null;
        closeBrushSidebar();
    };
</script>

<style scoped>
    .page-container {
        position: relative;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 112px;
    }

    .upload-box {
        flex: 1;
        min-height: 360px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 14px;
    }

    .upload-box .upload-icon {
        font-size: 2rem;
    }

    .upload-hint {
        color: var(--color-gray-500);
        font-size: var(--font-sm);
    }

    .brush-sidebar-mask {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.28);
        backdrop-filter: blur(4px);
        z-index: 18;
    }

    .brush-sidebar {
        position: absolute;
        left: 50%;
        bottom: 92px;
        transform: translateX(-50%) translateY(24px);
        width: min(540px, calc(100% - 32px));
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid rgba(99, 102, 241, 0.15);
        border-radius: 24px;
        box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
        opacity: 0;
        pointer-events: none;
        transition: transform 0.28s ease, opacity 0.28s ease;
        z-index: 20;
    }

    .brush-sidebar.is-open {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
        pointer-events: auto;
    }

    .brush-sidebar__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px 12px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.08));
        border-bottom: 1px solid rgba(219, 226, 237, 0.95);
    }

    .brush-sidebar__title {
        font-size: 1rem;
        font-weight: 700;
        color: var(--color-gray-900);
        margin-bottom: 6px;
    }

    .brush-sidebar__subtitle {
        font-size: 0.85rem;
        color: var(--color-gray-600);
    }

    .icon-button {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        border: 1px solid rgba(219, 226, 237, 0.95);
        background: #fff;
        color: var(--color-gray-700);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .brush-sidebar__content {
        padding: 18px 20px 20px;
        display: grid;
        gap: 14px;
    }

    .brush-sidebar__preview {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        font-size: 0.95rem;
        color: var(--color-gray-700);
    }

    .brush-sidebar__preview strong {
        color: var(--color-primary-dark);
    }

    .range-input {
        width: 100%;
        accent-color: var(--color-primary);
    }

    .brush-sidebar__hint {
        font-size: 0.85rem;
        color: var(--color-gray-500);
        line-height: 1.5;
    }

    .operation-panel {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 15;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 12px;
        padding: 0 24px 16px;
        background: transparent;
        border-top: none;
        box-shadow: none;
    }

    .panel-btn {
        min-width: 116px;
        padding: 12px 18px;
        border-radius: 14px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: var(--transition);
        background: #ffffff;
        box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
        border: 1px solid rgba(226, 232, 240, 0.9);
    }

    .panel-btn.btn-secondary {
        background: #f8fafc;
        color: var(--color-gray-700);
    }

    .panel-btn.btn-warning {
        background: #f97316;
        color: #fff;
    }

    .panel-btn.btn-danger {
        background: var(--color-red-500);
        color: #fff;
    }

    .panel-btn.btn-primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
    }

    .panel-btn:hover {
        opacity: 0.92;
    }

    .page-title,
    .page-subtitle,
    .upload-box,
    .workspace,
    .action-bar,
    .result-panel {
        margin-bottom: 16px;
    }
</style>