<template>
    <div class="page-container">
        <!-- upload section -->
        <div class="upload-box" v-if="!uploadedImage" @click="fileInput.click()">
            <i class="fa fa-cloud-upload upload-icon"></i>
            <p>点击或拖拽图片上传</p>
            <p class="upload-hint">支持 JPG、PNG、WEBP</p>
        </div>
        <div v-else class="workspace">
            <div class="image-preview" ref="previewBox">
                <div class="preview-transform" :style="previewTransformStyle">
                    <img :src="processedImage || uploadedImage" alt="上传图片" />
                    <canvas
                        ref="overlayCanvas"
                        class="overlay-canvas"
                        :class="{
                            'is-active': activeTool,
                            'is-brush': activeTool === 'brush',
                            'is-frame': activeTool === 'frame',
                            'is-pan': isSpaceDown
                        }"
                        @pointerdown="onCanvasPointerDown"
                        @pointermove="onCanvasPointerMove"
                        @pointerup="onCanvasPointerUp"
                        @pointercancel="onCanvasPointerUp"
                        @wheel="onCanvasWheel"
                    />
                    <div
                        v-if="frameRect"
                        class="frame-overlay"
                        :style="frameStyle"
                        @pointerdown.stop="onFramePointerDown('body', $event)"
                        @pointermove.stop="onFramePointerMove"
                        @pointerup.stop="onFramePointerUp"
                        @pointercancel.stop="onFramePointerUp"
                    >
                    <button
                        type="button"
                        class="frame-close"
                        @click.stop="closeFrame"
                        title="取消框选"
                    >
                        <i class="fa fa-times"></i>
                    </button>
                    <div class="frame-handle frame-handle--nw" @pointerdown.stop="onFramePointerDown('nw', $event)"></div>
                    <div class="frame-handle frame-handle--n" @pointerdown.stop="onFramePointerDown('n', $event)"></div>
                    <div class="frame-handle frame-handle--ne" @pointerdown.stop="onFramePointerDown('ne', $event)"></div>
                    <div class="frame-handle frame-handle--w" @pointerdown.stop="onFramePointerDown('w', $event)"></div>
                    <div class="frame-handle frame-handle--e" @pointerdown.stop="onFramePointerDown('e', $event)"></div>
                    <div class="frame-handle frame-handle--sw" @pointerdown.stop="onFramePointerDown('sw', $event)"></div>
                    <div class="frame-handle frame-handle--s" @pointerdown.stop="onFramePointerDown('s', $event)"></div>
                    <div class="frame-handle frame-handle--se" @pointerdown.stop="onFramePointerDown('se', $event)"></div>
                </div>
                </div>
                <div class="view-controls">
                    <button type="button" class="view-btn" @click="zoomOut" title="缩小">
                        <i class="fa fa-minus"></i>
                    </button>
                    <button type="button" class="view-reset" @click="resetView" title="重置视图">
                        {{ zoomText }}
                    </button>
                    <button type="button" class="view-btn" @click="zoomIn" title="放大">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>
                <div class="view-tip">Ctrl/Cmd + 滚轮缩放 · 空格拖动平移 · Ctrl/Cmd + 0 重置</div>
            </div>
        </div>

        <div :class="['execution-logs-panel', { 'is-open': showExecutionLogs }]">
            <div class="execution-logs-panel__header">
                <span class="execution-logs-panel__title">执行日志</span>
                <button type="button" class="icon-button" @click="clearExecutionLogs" title="清空日志">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
            <div class="execution-logs-panel__content">
                <div v-if="executionLogs.length === 0" class="execution-logs-empty">
                    暂无日志
                </div>
                <div v-else class="execution-logs-list">
                    <div v-for="(log, index) in executionLogs" :key="index" :class="['execution-log-item', `log-${log.type}`]">
                        <span class="log-time">{{ log.time }}</span>
                        <span class="log-message">{{ log.message }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="config-dialog-mask" v-if="showConfigDialog" @click="closeConfigDialog"></div>
        <div :class="['config-dialog', { 'is-open': showConfigDialog }]">
            <div class="config-dialog__header">
                <div>
                    <div class="config-dialog__title">COS 配置</div>
                    <div class="config-dialog__subtitle">用于上传原图和遮罩到 COS</div>
                </div>
                <button type="button" class="icon-button" @click="closeConfigDialog">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="config-fields">
                <label><span>ServiceId</span><input v-model="serviceId" placeholder="服务 ID，例如 x009gmgp8p" /></label>
                <label><span>Bucket</span><input v-model="cosBucket" placeholder="COS 桶名（例如 bucket-APPID）" /></label>
                <label><span>Region</span><input v-model="cosRegion" placeholder="COS 存储桶地域，例如 ap-beijing" /></label>
                <label><span>SecretId</span><input v-model="cosSecretId" placeholder="COS SecretId" /></label>
                <label><span>SecretKey</span><input v-model="cosSecretKey" placeholder="COS SecretKey" type="password" /></label>
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
            <div class="operation-group operation-group--tools">
                <button
                    type="button"
                    class="btn tool-btn log-toggle-btn"
                    :class="{ 'is-active': showExecutionLogs }"
                    @click="toggleExecutionLogs"
                    title="展开/收起执行日志"
                >
                    <i class="fa fa-list"></i>
                    {{ showExecutionLogs ? '隐藏' : '显示' }}日志
                </button>
                <button
                    type="button"
                    class="btn tool-btn brush-tool-btn"
                    :class="{ 'is-active': activeTool === 'brush' }"
                    @click="selectMode('brush')"
                >
                    <i class="fa fa-paint-brush"></i>
                    涂抹
                    <span class="tool-size-trigger" title="调整画笔大小" @click.stop="toggleBrushSidebar">
                        <i class="fa fa-sliders-h"></i>
                    </span>
                </button>
                <button
                    type="button"
                    class="btn tool-btn"
                    :class="{ 'is-active': activeTool === 'frame' }"
                    @click="selectMode('frame')"
                >
                    <i class="fa fa-square-o"></i>
                    框选
                </button>
            </div>

            <div class="operation-group operation-group--primary">
                <button
                    type="button"
                    class="btn btn-primary main-btn"
                    :disabled="!uploadedImage"
                    @click="processRemoval"
                >
                    <i class="fa fa-play"></i>
                    开始消除
                </button>
                <button type="button" class="btn btn-secondary" @click="resetOperation">
                    <i class="fa fa-refresh"></i>
                    重置
                </button>
            </div>

            <div class="operation-group operation-group--settings">
                <button type="button" class="btn btn-outline" @click="openConfigDialog('cos')">
                    <i class="fa fa-cloud"></i>
                    COS 配置
                </button>
            </div>
            <div class="operation-group operation-group--secondary">
                <button type="button" class="btn btn-outline" @click="fileInput.click()">
                    <i class="fa fa-repeat"></i>
                    重选
                </button>
                <button type="button" class="btn btn-danger" @click="deleteImage">
                    <i class="fa fa-trash"></i>
                    删除
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';

    const uploadedImage = ref(null);
    const processedImage = ref(null);
    const selectedFile = ref(null);
    const fileInput = ref(null);
    const previewBox = ref(null);
    const overlayCanvas = ref(null);

    const cosBucket = ref('');
    const cosRegion = ref('');
    const cosSecretId = ref('');
    const cosSecretKey = ref('');
    const serviceId = ref('');

    const showExecutionLogs = ref(false);
    const executionLogs = ref([]);

    const addLog = (message, type = 'info') => {
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        executionLogs.value.push({ message, type, time: timeStr });
        if (!showExecutionLogs.value) {
            showExecutionLogs.value = true;
        }
    };

    const clearExecutionLogs = () => {
        executionLogs.value = [];
    };

    const toggleExecutionLogs = () => {
        showExecutionLogs.value = !showExecutionLogs.value;
    };

    const showBrushSidebar = ref(false);
    const showConfigDialog = ref('');
    const configLoaded = ref(false);
    const brushSize = ref(28);
    const activeTool = ref('');
    const hasSelection = ref(false);

    const drawing = ref(false);
    const currentStroke = ref([]);
    const brushPaths = ref([]);
    const frameRect = ref(null);
    const frameStart = ref(null);
    const frameAction = ref('');
    const frameHandle = ref('');
    const frameInitialRect = ref(null);
    const frameMoveStart = ref(null);
    const frameDragging = ref(false);
    const minFrameSize = 24;

    const zoomLevel = ref(1);
    const minZoom = 0.5;
    const maxZoom = 3;
    const zoomStep = 0.1;
    const panX = ref(0);
    const panY = ref(0);
    const isSpaceDown = ref(false);
    const isPanning = ref(false);
    const panStart = ref(null);

    const frameStyle = computed(() => {
        if (!frameRect.value) return {};
        return {
            left: `${frameRect.value.x}px`,
            top: `${frameRect.value.y}px`,
            width: `${frameRect.value.w}px`,
            height: `${frameRect.value.h}px`,
        };
    });

    const previewTransformStyle = computed(() => ({
        transform: `translate3d(${panX.value}px, ${panY.value}px, 0) scale(${zoomLevel.value})`,
        transformOrigin: '0 0',
    }));

    const zoomText = computed(() => `${Math.round(zoomLevel.value * 100)}%`);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        selectedFile.value = file;
        const reader = new FileReader();
        reader.onload = async (e) => {
            uploadedImage.value = e.target.result;
            processedImage.value = null;
            clearOverlay();
            activeTool.value = '';
            closeBrushSidebar();
            resetView();
            await nextTick();
            syncCanvasSize();
        };
        reader.readAsDataURL(file);
    };

    const deleteImage = () => {
        uploadedImage.value = null;
        processedImage.value = null;
        if (fileInput.value) fileInput.value.value = '';
        resetOperation();
    };

    const processRemoval = async () => {
        try {
            executionLogs.value = [];
            showExecutionLogs.value = true;
            addLog('开始处理图像...', 'info');
            
            if (!selectedFile.value) {
                throw new Error('请先选择需要上传的图片');
            }
            if (!hasSelection.value && !frameRect.value) {
                throw new Error('请先使用涂抹或框选标记要去除的区域');
            }
            
            addLog('正在上传原图到 COS...', 'info');
            const originalUrl = await uploadFileToCos(selectedFile.value, 'original');
            addLog('原图上传成功', 'success');

            addLog('正在生成遮罩图片...', 'info');
            const maskBlob = await generateMaskBlob();
            if (!maskBlob) {
                throw new Error('未检测到可用遮罩区域');
            }
            const maskFile = new File([maskBlob], `mask-${Date.now()}.png`, { type: 'image/png' });
            addLog('正在上传遮罩图片到 COS...', 'info');
            const maskUrl = await uploadFileToCos(maskFile, 'mask');
            addLog('遮罩图片上传成功', 'success');

            if (!serviceId.value) {
                throw new Error('请先填写 ServiceId');
            }
            addLog(`已使用 ServiceId: ${serviceId.value}`, 'info');
            addLog('正在调用 veImageX 图像修复接口...', 'info');
            const resultUrl = await callImageErase(originalUrl, maskUrl);
            processedImage.value = resultUrl;
            addLog('去水印成功！', 'success');
        } catch (error) {
            const errMsg = error.message || '处理失败，请检查配置和网络';
            addLog(errMsg, 'error');
        }
    };

    const drawStroke = (ctx, path) => {
        if (!path.points || path.points.length < 2) return;
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.78)';
        ctx.lineWidth = path.width;
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);
        path.points.slice(1).forEach((point) => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        ctx.restore();
    };

    const loadConfigFile = async () => {
        if (configLoaded.value) return;
        try {
            const response = await fetch('/config-txt');
            if (!response.ok) {
                throw new Error('无法读取 config.txt');
            }
            const data = await response.json();
            if (data.success && data.data) {
                const config = data.data;
                serviceId.value = config.ServiceId || serviceId.value;
                cosBucket.value = config.Bucket || cosBucket.value;
                cosRegion.value = config.Region || cosRegion.value;
                cosSecretId.value = config.SecretId || cosSecretId.value;
                cosSecretKey.value = config.SecretKey || cosSecretKey.value;
                configLoaded.value = true;
                addLog('已从 config.txt 自动加载 COS 配置', 'success');
            } else {
                throw new Error(data.error || 'config.txt 内容解析失败');
            }
        } catch (err) {
            addLog(`config.txt 加载失败：${err.message || err}`, 'error');
        }
    };

    const openConfigDialog = async () => {
        showConfigDialog.value = 'cos';
        await loadConfigFile();
    };

    const closeConfigDialog = () => {
        showConfigDialog.value = '';
    };

    const generateMaskBlob = async () => {
        const imageElement = previewBox.value?.querySelector('img');
        if (!imageElement) return null;
        const naturalWidth = imageElement.naturalWidth;
        const naturalHeight = imageElement.naturalHeight;
        if (!naturalWidth || !naturalHeight) return null;

        const displayWidth = imageElement.clientWidth;
        const displayHeight = imageElement.clientHeight;
        const scaleX = naturalWidth / displayWidth;
        const scaleY = naturalHeight / displayHeight;

        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = naturalWidth;
        maskCanvas.height = naturalHeight;
        const ctx = maskCanvas.getContext('2d');
        if (!ctx) return null;

        // veImageX mask 规则：黑色表示保留，非黑色表示待修复
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, naturalWidth, naturalHeight);
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (brushPaths.value.length || currentStroke.value.length > 1) {
            const nextPaths = [...brushPaths.value];
            if (currentStroke.value.length > 1) {
                nextPaths.push({ width: brushSize.value, points: [...currentStroke.value] });
            }
            nextPaths.forEach((path) => {
                if (!path.points || path.points.length < 2) return;
                ctx.lineWidth = path.width * Math.max(scaleX, scaleY);
                ctx.beginPath();
                ctx.moveTo(path.points[0].x * scaleX, path.points[0].y * scaleY);
                path.points.slice(1).forEach((point) => {
                    ctx.lineTo(point.x * scaleX, point.y * scaleY);
                });
                ctx.stroke();
                ctx.fill();
            });
        } else if (frameRect.value) {
            const rect = frameRect.value;
            ctx.fillRect(rect.x * scaleX, rect.y * scaleY, rect.w * scaleX, rect.h * scaleY);
        } else {
            return null;
        }

        return new Promise((resolve) => {
            maskCanvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/png');
        });
    };

    const uploadFileToCos = async (file, prefix) => {
        if (!cosBucket.value || !cosRegion.value || !cosSecretId.value || !cosSecretKey.value) {
            throw new Error('请先填写完整 COS 配置');
        }
        const COS = (await import('cos-js-sdk-v5')).default;
        const cos = new COS({ SecretId: cosSecretId.value, SecretKey: cosSecretKey.value });
        const key = `${prefix}/${Date.now()}-${file.name}`;
        return new Promise((resolve, reject) => {
            cos.putObject(
                {
                    Bucket: cosBucket.value,
                    Region: cosRegion.value,
                    Key: key,
                    Body: file,
                },
                (err, data) => {
                    if (err) {
                        reject(new Error(`COS 上传失败：${err.message || JSON.stringify(err)}`));
                        return;
                    }
                    resolve(`https://${cosBucket.value}.cos.${cosRegion.value}.myqcloud.com/${encodeURIComponent(key)}`);
                }
            );
        });
    };

    const callImageErase = async (imageUrl, maskUrl) => {
        const body = {
            ServiceId: serviceId.value,
            StoreUri: imageUrl,
            Model: 'eraser_model_imagex_0.1.0',
            MaskUri: maskUrl,
        };
        const response = await fetch('/veimagex', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`veImageX 请求失败：${response.status} ${text}`);
        }
        const result = await response.json();
        if (result.Result?.ResUri) {
            const host = result.ResponseMetadata?.Region === 'ap-southeast-1'
                ? 'https://imagex.ap-southeast-1.volcengineapi.com'
                : 'https://imagex.volcengineapi.com';
            return `${host}/${result.Result.ResUri}`;
        }
        throw new Error(`veImageX 返回格式异常：${JSON.stringify(result)}`);
    };

    const drawFrame = (ctx, rect) => {
        if (!rect || rect.w < 2 || rect.h < 2) return;
        ctx.save();
        ctx.strokeStyle = 'rgba(248, 113, 33, 0.9)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 6]);
        ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
        ctx.restore();
    };

    const getRelativePoint = (event) => {
        const canvas = overlayCanvas.value;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left - panX.value) / zoomLevel.value;
        const y = (event.clientY - rect.top - panY.value) / zoomLevel.value;
        return {
            x: Math.max(0, Math.min(x, rect.width / zoomLevel.value)),
            y: Math.max(0, Math.min(y, rect.height / zoomLevel.value)),
        };
    };

    const drawOverlay = () => {
        const canvas = overlayCanvas.value;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        brushPaths.value.forEach((path) => drawStroke(ctx, path));
        if (currentStroke.value.length > 1) {
            drawStroke(ctx, { width: brushSize.value, points: currentStroke.value });
        }
    };

    const syncCanvasSize = () => {
        const canvas = overlayCanvas.value;
        const box = previewBox.value;
        if (!canvas || !box) return;
        const rect = box.getBoundingClientRect();
        const ratio = window.devicePixelRatio || 1;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        canvas.width = Math.round(rect.width * ratio);
        canvas.height = Math.round(rect.height * ratio);
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        drawOverlay();
    };

    const clearBrush = () => {
        brushPaths.value = [];
        currentStroke.value = [];
    };

    const clearFrame = () => {
        frameRect.value = null;
        frameStart.value = null;
        frameAction.value = '';
        frameHandle.value = '';
        frameInitialRect.value = null;
        frameMoveStart.value = null;
        hasSelection.value = false;
    };

    const closeFrame = () => {
        clearFrame();
        drawOverlay();
    };

    const clearOverlay = () => {
        clearBrush();
        clearFrame();
        drawOverlay();
    };

    const toggleBrushSidebar = () => {
        if (showBrushSidebar.value) {
            closeBrushSidebar();
        } else {
            openBrushSidebar();
        }
    };

    const openBrushSidebar = () => {
        if (activeTool.value !== 'brush') {
            selectMode('brush');
        }
        showBrushSidebar.value = true;
    };

    const closeBrushSidebar = () => {
        showBrushSidebar.value = false;
    };

    const selectMode = (mode) => {
        if (mode === 'brush') {
            clearFrame();
            activeTool.value = 'brush';
            closeBrushSidebar();
        } else if (mode === 'frame') {
            clearBrush();
            activeTool.value = 'frame';
            closeBrushSidebar();
        }
        drawOverlay();
    };

    const resetOperation = () => {
        activeTool.value = '';
        brushSize.value = 28;
        processedImage.value = null;
        clearOverlay();
        closeBrushSidebar();
        resetView();
    };

    const zoomIn = () => {
        setZoom(zoomLevel.value + zoomStep);
    };

    const zoomOut = () => {
        setZoom(zoomLevel.value - zoomStep);
    };

    const resetView = () => {
        zoomLevel.value = 1;
        panX.value = 0;
        panY.value = 0;
    };

    const setZoom = (nextZoom, center) => {
        const zoom = Math.min(maxZoom, Math.max(minZoom, nextZoom));
        if (!overlayCanvas.value || zoom === zoomLevel.value) {
            zoomLevel.value = zoom;
            return;
        }

        if (center) {
            const rect = overlayCanvas.value.getBoundingClientRect();
            const offsetX = center.x - rect.left;
            const offsetY = center.y - rect.top;
            const logicalX = (offsetX - panX.value) / zoomLevel.value;
            const logicalY = (offsetY - panY.value) / zoomLevel.value;
            panX.value = offsetX - logicalX * zoom;
            panY.value = offsetY - logicalY * zoom;
        }

        zoomLevel.value = zoom;
    };

    const onCanvasWheel = (event) => {
        if (!uploadedImage.value || !(event.ctrlKey || event.metaKey)) return;
        event.preventDefault();
        const delta = event.deltaY > 0 ? -zoomStep : zoomStep;
        setZoom(zoomLevel.value + delta, { x: event.clientX, y: event.clientY });
    };

    const onKeyDown = (event) => {
        if (event.code === 'Space') {
            isSpaceDown.value = true;
        }

        if (event.metaKey || event.ctrlKey) {
            if (event.key === '+' || event.key === '=' ) {
                event.preventDefault();
                zoomIn();
            }
            if (event.key === '-' || event.key === '_') {
                event.preventDefault();
                zoomOut();
            }
            if (event.key === '0') {
                event.preventDefault();
                resetView();
            }
        }

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;
            event.preventDefault();
            const step = event.shiftKey ? 20 : 10;
            switch (event.key) {
                case 'ArrowUp':
                    panY.value += step;
                    break;
                case 'ArrowDown':
                    panY.value -= step;
                    break;
                case 'ArrowLeft':
                    panX.value += step;
                    break;
                case 'ArrowRight':
                    panX.value -= step;
                    break;
            }
        }

        if (event.key === 'Escape') {
            if (showBrushSidebar.value) closeBrushSidebar();
            isSpaceDown.value = false;
            isPanning.value = false;
        }
    };

    const onKeyUp = (event) => {
        if (event.code === 'Space') {
            isSpaceDown.value = false;
        }
    };

    const clampRect = (rect) => {
        const canvas = overlayCanvas.value;
        if (!canvas) return rect;
        const bounds = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.x, bounds.width - minFrameSize));
        const y = Math.max(0, Math.min(rect.y, bounds.height - minFrameSize));
        const w = Math.min(Math.max(rect.w, minFrameSize), bounds.width - x);
        const h = Math.min(Math.max(rect.h, minFrameSize), bounds.height - y);
        return { x, y, w, h };
    };

    const onFramePointerMove = (event) => {
        if (!frameDragging.value || !frameAction.value || !frameInitialRect.value || !frameMoveStart.value) return;
        const point = getRelativePoint(event);
        const dx = point.x - frameMoveStart.value.x;
        const dy = point.y - frameMoveStart.value.y;
        const initial = frameInitialRect.value;
        let next = { ...initial };

        if (frameAction.value === 'move') {
            next.x = initial.x + dx;
            next.y = initial.y + dy;
        } else {
            switch (frameHandle.value) {
                case 'nw':
                    next.x = initial.x + dx;
                    next.y = initial.y + dy;
                    next.w = initial.w - dx;
                    next.h = initial.h - dy;
                    break;
                case 'n':
                    next.y = initial.y + dy;
                    next.h = initial.h - dy;
                    break;
                case 'ne':
                    next.y = initial.y + dy;
                    next.w = initial.w + dx;
                    next.h = initial.h - dy;
                    break;
                case 'e':
                    next.w = initial.w + dx;
                    break;
                case 'se':
                    next.w = initial.w + dx;
                    next.h = initial.h + dy;
                    break;
                case 's':
                    next.h = initial.h + dy;
                    break;
                case 'sw':
                    next.x = initial.x + dx;
                    next.w = initial.w - dx;
                    next.h = initial.h + dy;
                    break;
                case 'w':
                    next.x = initial.x + dx;
                    next.w = initial.w - dx;
                    break;
            }
        }

        frameRect.value = clampRect(next);
    };

    const onFramePointerUp = () => {
        if (!frameDragging.value) return;
        drawing.value = false;
        frameDragging.value = false;
        frameAction.value = '';
        frameHandle.value = '';
        frameInitialRect.value = null;
        frameMoveStart.value = null;
    };

    const onCanvasPointerDown = (event) => {
        if (!uploadedImage.value) return;
        if (isSpaceDown.value) {
            isPanning.value = true;
            panStart.value = {
                x: event.clientX,
                y: event.clientY,
                panX: panX.value,
                panY: panY.value,
            };
            try {
                event.target.setPointerCapture(event.pointerId);
            } catch (err) {
                // ignore
            }
            return;
        }

        if (!activeTool.value) return;
        drawing.value = true;
        event.target.setPointerCapture(event.pointerId);
        const point = getRelativePoint(event);

        if (activeTool.value === 'brush') {
            clearFrame();
            currentStroke.value = [{ ...point }];
        } else if (activeTool.value === 'frame') {
            clearBrush();
            frameStart.value = point;
            frameRect.value = { x: point.x, y: point.y, w: 0, h: 0 };
        }
        drawOverlay();
    };

    const onFramePointerDown = (part, event) => {
        if (!frameRect.value) return;
        event.preventDefault();
        drawing.value = true;
        frameDragging.value = true;
        frameAction.value = part === 'body' ? 'move' : 'resize';
        frameHandle.value = part;
        frameMoveStart.value = getRelativePoint(event);
        frameInitialRect.value = { ...frameRect.value };
        try {
            event.currentTarget.setPointerCapture(event.pointerId);
        } catch (err) {
            // ignore
        }
    };

    const onCanvasPointerMove = (event) => {
        if (isPanning.value && panStart.value) {
            panX.value = panStart.value.panX + (event.clientX - panStart.value.x);
            panY.value = panStart.value.panY + (event.clientY - panStart.value.y);
            return;
        }
        if (!drawing.value || !activeTool.value || frameDragging.value) return;
        const point = getRelativePoint(event);
        if (activeTool.value === 'brush') {
            currentStroke.value.push(point);
        } else if (activeTool.value === 'frame') {
            const start = frameStart.value;
            if (!start) return;
            const x = Math.min(start.x, point.x);
            const y = Math.min(start.y, point.y);
            const w = Math.abs(point.x - start.x);
            const h = Math.abs(point.y - start.y);
            frameRect.value = { x, y, w, h };
        }
        drawOverlay();
    };

    const onCanvasPointerUp = (event) => {
        if (isPanning.value) {
            isPanning.value = false;
            panStart.value = null;
            try {
                event.target.releasePointerCapture(event.pointerId);
            } catch (err) {
                // ignore
            }
            return;
        }

        if (!drawing.value) return;
        drawing.value = false;
        try {
            event.target.releasePointerCapture(event.pointerId);
        } catch (err) {
            // ignore if pointer capture is not active
        }

        if (activeTool.value === 'brush') {
            if (currentStroke.value.length > 1) {
                brushPaths.value.push({ width: brushSize.value, points: [...currentStroke.value] });
                hasSelection.value = true;
            }
            currentStroke.value = [];
        } else if (activeTool.value === 'frame') {
            if (frameRect.value && frameRect.value.w > 4 && frameRect.value.h > 4) {
                hasSelection.value = true;
            } else {
                clearFrame();
            }
        }
        drawOverlay();
    };

    const onWindowPointerMove = (event) => {
        if (!frameDragging.value) return;
        onFramePointerMove(event);
        drawOverlay();
    };

    const onWindowPointerUp = () => {
        onFramePointerUp();
        drawOverlay();
    };

    const handleResize = () => {
        syncCanvasSize();
        if (frameRect.value) {
            frameRect.value = clampRect(frameRect.value);
        }
    };

    onMounted(() => {
        window.addEventListener('resize', handleResize);
        window.addEventListener('pointermove', onWindowPointerMove);
        window.addEventListener('pointerup', onWindowPointerUp);
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        syncCanvasSize();
    });

    onBeforeUnmount(() => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('pointermove', onWindowPointerMove);
        window.removeEventListener('pointerup', onWindowPointerUp);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
    });
</script>

<style scoped>
    .page-container {
        position: relative;
        height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding-bottom: 112px;
        overflow: hidden;
    }

    .upload-box {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 14px;
        min-height: 0;
        overflow: hidden;
    }

    .upload-box .upload-icon {
        font-size: 2rem;
    }

    .upload-hint {
        color: var(--color-gray-500);
        font-size: var(--font-sm);
    }

    .workspace {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-height: 0;
        overflow: hidden;
    }

    .image-preview {
        position: relative;
        flex: 1;
        min-height: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
        border: 1px solid rgba(226, 232, 240, 0.8);
        overflow: hidden;
    }

    .image-preview img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
        display: block;
        user-select: none;
        pointer-events: none;
    }

    .overlay-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        display: block;
        background: transparent;
        border-radius: inherit;
        pointer-events: none;
        touch-action: none;
    }

    .overlay-canvas.is-active,
    .overlay-canvas.is-pan {
        pointer-events: auto;
    }

    .overlay-canvas.is-pan {
        cursor: grab;
    }

    .overlay-canvas.is-pan:active {
        cursor: grabbing;
    }

    .preview-transform {
        position: absolute;
        inset: 0;
        transform-origin: 0 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .preview-transform img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        user-drag: none;
        user-select: none;
        pointer-events: none;
    }

    .view-controls {
        position: absolute;
        right: 18px;
        top: 18px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.96);
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 18px;
        padding: 8px 10px;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
        z-index: 20;
    }

    .view-btn,
    .view-reset {
        border: none;
        background: transparent;
        color: var(--color-gray-900);
        min-width: 34px;
        height: 34px;
        border-radius: 12px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
    }

    .view-btn {
        background: var(--color-gray-50);
        border: 1px solid rgba(226, 232, 240, 0.95);
    }

    .view-reset {
        min-width: 64px;
        padding: 0 10px;
        font-size: 0.9rem;
        font-weight: 600;
        background: var(--color-primary-bg);
        color: var(--color-primary-dark);
        border: 1px solid rgba(99, 102, 241, 0.25);
    }

    .view-btn:hover,
    .view-reset:hover {
        background: rgba(99, 102, 241, 0.12);
    }

    .view-tip {
        position: absolute;
        right: 18px;
        top: calc(100% + 10px);
        font-size: 0.82rem;
        color: var(--color-gray-500);
        z-index: 20;
        white-space: nowrap;
    }

    .overlay-canvas.is-brush {
        cursor: crosshair;
    }

    .overlay-canvas.is-frame {
        cursor: crosshair;
    }

    .frame-overlay {
        position: absolute;
        box-sizing: border-box;
        border: 2px dashed var(--color-primary);
        background: rgba(99, 102, 241, 0.12);
        border-radius: 16px;
        pointer-events: auto;
        touch-action: none;
        cursor: grab;
        box-shadow: inset 0 0 0 1px rgba(99, 102, 241, 0.12);
        z-index: 10;
    }

    .frame-overlay:active {
        cursor: grabbing;
    }

    .frame-close {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: none;
        background: var(--color-primary);
        color: #fff;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 10px 20px rgba(99, 102, 241, 0.18);
        transition: var(--transition);
    }

    .frame-close:hover {
        transform: translateY(-1px);
        background: var(--color-primary-dark);
    }

    .frame-handle {
        position: absolute;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: #fff;
        border: 2px solid var(--color-primary);
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.14);
        transition: transform 0.18s ease, box-shadow 0.18s ease;
    }

    .frame-handle:hover {
        transform: scale(1.1);
        box-shadow: 0 0 0 6px rgba(99, 102, 241, 0.18);
    }

    .frame-handle--nw {
        top: -8px;
        left: -8px;
        cursor: nwse-resize;
    }

    .frame-handle--n {
        top: -8px;
        left: calc(50% - 8px);
        cursor: ns-resize;
    }

    .frame-handle--ne {
        top: -8px;
        right: -8px;
        cursor: nesw-resize;
    }

    .frame-handle--e {
        top: calc(50% - 8px);
        right: -8px;
        cursor: ew-resize;
    }

    .frame-handle--se {
        bottom: -8px;
        right: -8px;
        cursor: nwse-resize;
    }

    .frame-handle--s {
        bottom: -8px;
        left: calc(50% - 8px);
        cursor: ns-resize;
    }

    .frame-handle--sw {
        bottom: -8px;
        left: -8px;
        cursor: nesw-resize;
    }

    .frame-handle--w {
        top: calc(50% - 8px);
        left: -8px;
        cursor: ew-resize;
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

    .config-panel {
        display: grid;
        gap: 16px;
        margin-top: 18px;
        padding: 14px 0;
    }

    .config-dialog-mask {
        position: absolute;
        inset: 0;
        background: rgba(15, 23, 42, 0.32);
        z-index: 18;
    }

    .config-dialog {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        width: min(560px, calc(100% - 40px));
        max-height: 80vh;
        overflow-y: auto;
        background: #ffffff;
        border-radius: 24px;
        box-shadow: 0 30px 80px rgba(15, 23, 42, 0.18);
        padding: 22px;
        opacity: 0;
        pointer-events: none;
        transition: transform 0.22s ease, opacity 0.22s ease;
        z-index: 19;
    }

    .config-dialog.is-open {
        opacity: 1;
        pointer-events: auto;
        transform: translate(-50%, -50%) scale(1);
    }

    .config-dialog__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 16px;
    }

    .config-dialog__title {
        font-size: 1.05rem;
        font-weight: 700;
        color: var(--color-gray-900);
    }

    .config-dialog__subtitle {
        font-size: 0.9rem;
        color: var(--color-gray-600);
        margin-top: 4px;
    }

    .config-card {
        display: grid;
        gap: 12px;
        padding: 18px 20px;
        border-radius: 20px;
        background: #f8fafc;
        border: 1px solid rgba(226, 232, 240, 0.95);
    }

    .config-card__title {
        font-weight: 700;
        color: var(--color-gray-900);
        font-size: 1rem;
    }

    .config-fields {
        display: grid;
        gap: 10px;
    }

    .config-fields label {
        display: flex;
        flex-direction: column;
        gap: 6px;
        font-size: 0.92rem;
        color: var(--color-gray-700);
    }

    .config-fields input {
        height: 38px;
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 12px;
        padding: 0 12px;
        background: #fff;
        color: var(--color-gray-900);
    }

    .process-status {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        align-items: center;
        padding: 12px 16px;
        border-radius: 16px;
        background: rgba(59, 130, 246, 0.08);
        color: var(--color-gray-700);
        border: 1px solid rgba(59, 130, 246, 0.18);
        margin-top: 14px;
    }

    .status-error {
        color: var(--color-red-500);
    }

    .url-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 12px;
        width: 100%;
    }

    .url-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 0.92rem;
    }

    .url-item span {
        color: var(--color-gray-700);
        font-weight: 600;
    }

    .url-item a {
        word-break: break-all;
        color: var(--color-primary-dark);
    }

    .operation-panel {
        position: absolute;
        left: 20px;
        right: 20px;
        bottom: 18px;
        z-index: 15;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 14px 20px;
        background: rgba(255, 255, 255, 0.98);
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 22px;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.08);
        backdrop-filter: blur(10px);
        max-width: none;
        margin: 0;
        pointer-events: auto;
    }

    .operation-group {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    .operation-group--tools {
        flex: 1 1 auto;
        min-width: 260px;
    }

    .operation-group--primary,
    .operation-group--secondary {
        flex: 0 0 auto;
        display: flex;
        gap: 10px;
    }

    .btn {
        min-width: auto;
        padding: 12px 18px;
        border-radius: 18px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: var(--transition);
        border: 1px solid rgba(226, 232, 240, 0.95);
        background: #fff;
        color: var(--color-gray-900);
    }

    .btn.btn-primary {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
        border-color: transparent;
        box-shadow: 0 14px 28px rgba(99, 102, 241, 0.18);
    }

    .btn.btn-secondary {
        background: #eff3ff;
        color: var(--color-primary-dark);
        border-color: transparent;
    }

    .btn.btn-danger {
        background: var(--color-red-500);
        color: #fff;
        border-color: transparent;
    }

    .btn.btn-outline {
        background: #fff;
        color: var(--color-gray-900);
        border-color: rgba(226, 232, 240, 0.95);
    }

    .tool-btn {
        background: #fff;
        color: var(--color-gray-900);
        border-color: rgba(226, 232, 240, 0.95);
    }

    .tool-btn.is-active {
        background: var(--color-primary-bg);
        color: var(--color-primary-dark);
        border-color: rgba(99, 102, 241, 0.4);
        box-shadow: 0 10px 24px rgba(99, 102, 241, 0.12);
    }

    .btn:hover {
        opacity: 0.98;
        transform: translateY(-1px);
    }

    .tool-size-trigger {
        display: inline-flex;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #fff;
        border: 1px solid rgba(226, 232, 240, 0.95);
        color: var(--color-primary);
        align-items: center;
        justify-content: center;
        margin-left: 6px;
        cursor: pointer;
        transition: var(--transition);
    }

    .tool-size-trigger:hover {
        background: #f8fafc;
    }

    .panel-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        box-shadow: none;
    }

    .execution-logs-panel {
        position: fixed;
        right: 20px;
        bottom: calc(112px + 20px);
        width: min(420px, calc(100% - 40px));
        max-height: 0;
        overflow: hidden;
        background: #ffffff;
        border: 1px solid rgba(226, 232, 240, 0.95);
        border-radius: 16px;
        box-shadow: 0 20px 50px rgba(15, 23, 42, 0.1);
        transition: max-height 0.3s ease, opacity 0.3s ease;
        opacity: 0;
        pointer-events: none;
        z-index: 14;
    }

    .execution-logs-panel.is-open {
        max-height: 320px;
        opacity: 1;
        pointer-events: auto;
    }

    .execution-logs-panel__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.06));
        border-bottom: 1px solid rgba(219, 226, 237, 0.95);
        flex-shrink: 0;
    }

    .execution-logs-panel__title {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--color-gray-900);
    }

    .execution-logs-panel__content {
        padding: 0;
        max-height: 280px;
        overflow-y: auto;
    }

    .execution-logs-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80px;
        color: var(--color-gray-500);
        font-size: 0.9rem;
    }

    .execution-logs-list {
        display: flex;
        flex-direction: column;
    }

    .execution-log-item {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 16px;
        border-bottom: 1px solid rgba(226, 232, 240, 0.6);
        font-size: 0.88rem;
        line-height: 1.5;
    }

    .execution-log-item:last-child {
        border-bottom: none;
    }

    .execution-log-item.log-info {
        color: var(--color-gray-700);
        background: rgba(99, 102, 241, 0.04);
    }

    .execution-log-item.log-success {
        color: var(--color-green-600);
        background: rgba(16, 185, 129, 0.04);
    }

    .execution-log-item.log-error {
        color: var(--color-red-500);
        background: rgba(239, 68, 68, 0.04);
    }

    .log-time {
        color: var(--color-gray-500);
        font-weight: 600;
        flex-shrink: 0;
        font-size: 0.8rem;
    }

    .log-message {
        flex: 1;
        word-break: break-word;
    }

    .log-toggle-btn {
        min-width: 90px;
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