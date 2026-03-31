
console.log('app.js loaded: start');
const LANG_STORAGE_KEY = 'iplay_lang';
let currentLang = (localStorage.getItem(LANG_STORAGE_KEY) || '').toLowerCase();
if (!['zh', 'en'].includes(currentLang)) {
  currentLang = 'zh';
}

function syncContentCenterLinkTheme() {
  const link = document.getElementById('nav_content_center')
  if (!link) return
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  const lang = (currentLang === 'en') ? 'en' : 'zh'
  link.setAttribute('href', `content/index.html?theme=${currentTheme}&lang=${lang}`)
}

// 主题切换
document.getElementById('toggleTheme').onclick = () => {
  document.documentElement.classList.toggle('dark')
  syncContentCenterLinkTheme()
}
syncContentCenterLinkTheme()

const MESSAGE_TRANSLATIONS = {
  '图片信息已复制到剪贴板': 'Image information copied to clipboard.',
  '图片摘要已复制到剪贴板': 'Image summary copied to clipboard.',
  '复制失败，请重试': 'Copy failed, please try again.',
  '图片信息模块加载失败，请重试': 'Image info module failed to load, please try again.',
  '源脸已加载，请再上传目标图并开始换脸预览。': 'Source face loaded. Upload target image to start preview.',
  '目标图已加载，可开始拖拽调整脸部位置。': 'Target image loaded. You can drag to adjust face position.',
  '源脸加载失败，请更换图片重试。': 'Failed to load source face image. Please try another one.',
  '目标图加载失败，请更换图片重试。': 'Failed to load target image. Please try another one.',
  '位置已重置，可继续拖拽微调。': 'Position has been reset. Continue drag fine-tuning.',
  '请先上传源脸和目标图。': 'Please upload both source face and target image first.',
  '开始换脸前，请先确认已获得图像授权。': 'Please confirm image authorization before face swapping.',
  '换脸预览已生成。可拖拽位置、调节参数后继续下载。': 'Face swap preview generated. Adjust position/params then download.',
  '请先上传主画布图片。': 'Please upload the main canvas image first.',
  '请在画布上框选要移除的物体区域。': 'Select the object region on canvas to remove.',
  '区域已框选，点击“执行当前任务”进行物体移除。': 'Area selected. Click "Run current task" to remove object.',
  '请先框选一个有效区域。': 'Please select a valid area first.',
  '物体移除完成。': 'Object removal complete.',
  'OCR 识别中，请稍候...': 'Running OCR, please wait...',
  'OCR 识别完成。': 'OCR completed.',
  '没有可翻译内容。': 'No content available for translation.',
  '简易翻译完成。': 'Quick translation completed.',
  '未检测到明显隐私区域，可改用手动刷抹。': 'No obvious privacy region detected. Try manual brush mode.',
  '自动隐私马赛克已完成。': 'Automatic privacy mosaic completed.',
  '手动刷抹模式已开启，请在画布上拖动鼠标。': 'Manual brush mode enabled. Drag on canvas to apply.',
  '请先选择批量图片。': 'Please select batch images first.',
  '批量压缩与批量水印完成，共 ': 'Batch compression and watermark finished: ',
  ' 张。': ' images.',
  '拼图海报至少需要 2 张图片。': 'Collage requires at least 2 images.',
  '拼图海报生成完成。': 'Collage generated successfully.',
  '请先生成拼图海报。': 'Please generate the collage first.',
  '请选择要转 PDF 的图片。': 'Please select images to convert to PDF.',
  'jsPDF 加载失败，请检查网络后重试。': 'Failed to load jsPDF. Check network and retry.',
  '图像转 PDF 完成。': 'Image to PDF conversion completed.',
  '请选择 PDF 文件。': 'Please select a PDF file.',
  'PDF 转图片完成。': 'PDF to image conversion completed.',
  '请先上传主图。': 'Please upload the main image first.',
  '已恢复上传原图。': 'Original uploaded image restored.',
}

function t(zhText, enText) {
  return currentLang === 'en' ? enText : zhText
}

function translateMessage(message) {
  if (currentLang !== 'en' || typeof message !== 'string') return message
  if (MESSAGE_TRANSLATIONS[message]) return MESSAGE_TRANSLATIONS[message]
  return message
    .replace(/批量压缩与批量水印完成，共\s*(\d+)\s*张。/, 'Batch compression and watermark finished: $1 images.')
}

function setButtonTextWithIcon(selector, text) {
  const el = document.querySelector(selector)
  if (!el) return
  const icon = el.querySelector('i')
  if (!icon) {
    el.textContent = text
    return
  }
  const iconClone = icon.cloneNode(true)
  el.innerHTML = ''
  el.appendChild(iconClone)
  el.appendChild(document.createTextNode(' ' + text))
}

function applyStaticTranslations() {
  document.title = STATIC_TRANSLATIONS.title[currentLang]
  document.documentElement.lang = currentLang === 'en' ? 'en' : 'zh-CN'

  const brand = document.querySelector('nav .text-lg')
  if (brand) {
    const icon = brand.querySelector('i')
    if (icon) {
      const iconClone = icon.cloneNode(true)
      brand.innerHTML = ''
      brand.appendChild(iconClone)
      brand.appendChild(document.createTextNode(STATIC_TRANSLATIONS.brand[currentLang]))
    }
  }

  const navTitles = Array.from(document.querySelectorAll('.main-nav-title'))
  const navDescs = Array.from(document.querySelectorAll('.main-nav-desc'))
  const titleList = STATIC_TRANSLATIONS.nav[currentLang]
  const descList = STATIC_TRANSLATIONS.navDesc[currentLang]
  navTitles.forEach((node, index) => {
    if (titleList[index]) node.textContent = titleList[index]
  })
  navDescs.forEach((node, index) => {
    if (descList[index]) node.textContent = descList[index]
  })

  const heroTitle = document.querySelector('main h1')
  if (heroTitle) heroTitle.textContent = t('图像 AI 趣玩工具箱', 'IPlay AI Image Toolbox')
  const heroMain = document.querySelector('.hero-highlight')
  if (heroMain) heroMain.textContent = t('图片信息、编辑修复、创意处理，一站式本地完成', 'Image info, editing, and creative workflows in one local-first workspace')
  const heroSub = document.querySelector('.hero-subtle')
  if (heroSub) heroSub.textContent = t(' · 隐私安全 · 无需上传', ' · Privacy First · No Upload Required')

  setButtonTextWithIcon('#nav_content_center', t('内容中心', 'Content'))
  setButtonTextWithIcon('#nav_vip_top', t('会员升级', 'Upgrade'))
  setButtonTextWithIcon('#toggleTheme', t('切换模式', 'Theme'))
  setButtonTextWithIcon('#btn_img_go', t('AI去除水印', 'Remove Watermark'))
  setButtonTextWithIcon('#btn_img_down', t('下载图片', 'Download'))
  setButtonTextWithIcon('#btn_face_go', t('开始换脸', 'Start Face Swap'))
  setButtonTextWithIcon('#btn_face_reset', t('重置位置', 'Reset Position'))
  setButtonTextWithIcon('#btn_face_down', t('下载结果', 'Download Result'))

  const advJumpTitle = document.querySelector('#tab_adv_jump .main-nav-title')
  const advJumpDesc = document.querySelector('#tab_adv_jump .main-nav-desc')
  if (advJumpTitle) advJumpTitle.textContent = titleList[8] || t('高级玩法', 'Advanced Studio')
  if (advJumpDesc) advJumpDesc.textContent = descList[8] || t('进入完整高级工作台，查看全部任务分组', 'Open full advanced workspace with all task groups')
}

function updateLanguageToggleUI() {
  setButtonTextWithIcon('#toggleLang', currentLang === 'en' ? '中文' : 'EN')
}

function applyLanguage(lang) {
  currentLang = lang === 'en' ? 'en' : 'zh'
  localStorage.setItem(LANG_STORAGE_KEY, currentLang)
  updateLanguageToggleUI()
  applyStaticTranslations()
  syncContentCenterLinkTheme()
  if (typeof setAdvCategory === 'function') {
    setAdvCategory(advCurrentCategory || 'portrait')
  }
  if (typeof _updateCropRatioHint === 'function') {
    _updateCropRatioHint()
  }
}

const toggleLangBtn = document.getElementById('toggleLang')
if (toggleLangBtn) {
  toggleLangBtn.addEventListener('click', () => {
    applyLanguage(currentLang === 'en' ? 'zh' : 'en')
  })
}

function getCurrentPositionAsync(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation || typeof navigator.geolocation.getCurrentPosition !== 'function') {
      reject(new Error('geolocation-unavailable'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

const THEME_SUN_CACHE_KEY = 'iplay_theme_sun_cache_v1'
const THEME_SUN_CACHE_TTL_MS = 20 * 60 * 1000

function readSunThemeCache() {
  try {
    const raw = localStorage.getItem(THEME_SUN_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch (_) {
    return null
  }
}

function writeSunThemeCache(payload) {
  try {
    localStorage.setItem(THEME_SUN_CACHE_KEY, JSON.stringify(payload))
  } catch (_) {
    // localStorage 不可用时静默降级
  }
}

function computeNightBySunriseSunset(sunriseIso, sunsetIso, now = new Date()) {
  const sunrise = new Date(sunriseIso)
  const sunset = new Date(sunsetIso)
  if (Number.isNaN(sunrise.getTime()) || Number.isNaN(sunset.getTime())) return null
  return now < sunrise || now >= sunset
}

async function applyAutoThemeBySunCycle() {
  const root = document.documentElement
  const now = Date.now()
  const cache = readSunThemeCache()
  if (cache && cache.sunrise && cache.sunset && cache.fetchedAt && (now - Number(cache.fetchedAt) <= THEME_SUN_CACHE_TTL_MS)) {
    const isNightFromCache = computeNightBySunriseSunset(cache.sunrise, cache.sunset, new Date(now))
    if (typeof isNightFromCache === 'boolean') {
      root.classList.toggle('dark', isNightFromCache)
      return
    }
  }

  try {
    const position = await getCurrentPositionAsync({
      enableHighAccuracy: false,
      timeout: 7000,
      maximumAge: 10 * 60 * 1000,
    })
    const lat = position.coords && Number(position.coords.latitude)
    const lng = position.coords && Number(position.coords.longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      root.classList.remove('dark')
      return
    }

    const response = await fetch(
      `https://api.sunrise-sunset.org/json?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&formatted=0`
    )
    if (!response.ok) {
      root.classList.remove('dark')
      return
    }
    const data = await response.json()
    const sunriseIso = data && data.results ? data.results.sunrise : ''
    const sunsetIso = data && data.results ? data.results.sunset : ''
    const isNight = computeNightBySunriseSunset(sunriseIso, sunsetIso, new Date(now))
    if (typeof isNight !== 'boolean') {
      root.classList.remove('dark')
      return
    }
    root.classList.toggle('dark', isNight)
    writeSunThemeCache({
      sunrise: sunriseIso,
      sunset: sunsetIso,
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4)),
      fetchedAt: now,
    })
  } catch (_) {
    root.classList.remove('dark')
  }
}

applyAutoThemeBySunCycle().finally(() => {
  syncContentCenterLinkTheme()
})

function setMainNavActive(activeButton) {
  const navButtons = Array.from(document.querySelectorAll('.main-nav-card')).filter(Boolean)
  navButtons.forEach((btn) => {
    btn.classList.remove('is-active')
    btn.setAttribute('aria-pressed', 'false')
  })
  if (activeButton) {
    activeButton.classList.add('is-active')
    activeButton.setAttribute('aria-pressed', 'true')
  }
}

function toggleToolsWorkspace(mode = 'basic') {
  const basicWorkspace = document.getElementById('tools_basic_workspace')
  const advancedWorkspace = document.getElementById('advanced_workspace')
  if (basicWorkspace) basicWorkspace.classList.toggle('hidden', mode !== 'basic')
  if (advancedWorkspace) advancedWorkspace.classList.toggle('hidden', mode !== 'advanced')
}

function showMainPane(tabKey, activeButton, options = {}) {
  console.log(`[ShowMainPane] Called with tabKey="${tabKey}"`)
  document.querySelectorAll('.tab-pane').forEach((pane) => pane.classList.add('hidden'))
  const target = document.getElementById('tab_' + tabKey)
  console.log(`[ShowMainPane] Target element: ${ target ? 'found' : 'not found'} for #tab_${tabKey}`)
  if (target) target.classList.remove('hidden')
  setMainNavActive(activeButton || null)
  if (tabKey === 'tools') {
    toggleToolsWorkspace(options.toolsMode || 'basic')
  } else {
    toggleToolsWorkspace('none')
  }
  console.log(`[ShowMainPane] Complete`)
}

// 选项卡切换
document.querySelectorAll('.tab-btn').forEach(b => {
  b.onclick = () => {
    const tabKey = b.getAttribute('tab')
    console.log(`[Tab Click] tab-btn clicked: ${tabKey}`)
    showMainPane(tabKey, b, { toolsMode: 'basic' })
  }
})

document.getElementById('tab_adv_jump').onclick = () => {
  const target = document.getElementById('advanced_workspace')
  showMainPane('tools', document.getElementById('tab_adv_jump'), { toolsMode: 'advanced' })
  if (target) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }
}

function openAdvancedCategory(categoryKey, activeButton) {
  const target = document.getElementById('advanced_workspace')
  showMainPane('tools', activeButton || document.getElementById('tab_adv_jump'), { toolsMode: 'advanced' })
  if (typeof setAdvCategory === 'function') {
    setAdvCategory(categoryKey)
  }
  if (target) {
    setTimeout(() => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }
}

document.querySelectorAll('.main-nav-adv-link').forEach((button) => {
  button.onclick = () => openAdvancedCategory(button.dataset.advCategory, button)
})

document.getElementById('nav_vip_top').onclick = () => {
  showMainPane('vip', null)
}

const uploadImgArea = document.getElementById('upload_img_area');
const fileImg = document.getElementById('file_img');
const imgPreviewWrap = document.getElementById('img_preview_wrap');
const imgStage = document.getElementById('img_stage');
const imgPreview = document.getElementById('img_preview');
const imgCanvas = document.getElementById('img_canvas');
const btnImgGo = document.getElementById('btn_img_go');
const btnImgDown = document.getElementById('btn_img_down');
const imgStatus = document.getElementById('img_status');
const imgProgress = document.getElementById('img_progress');
const ctx = imgCanvas.getContext('2d');
const uploadEditArea = document.getElementById('upload_edit_area');
const fileEdit = document.getElementById('file_edit');
const btnEditUndo = document.getElementById('btn_edit_undo');
const btnEditRedo = document.getElementById('btn_edit_redo');
const cropAspectSelect = document.getElementById('crop_aspect_ratio');
const cropAspectTrigger = document.getElementById('crop_aspect_trigger');
const cropAspectTriggerIcon = document.getElementById('crop_aspect_trigger_icon');
const cropAspectTriggerText = document.getElementById('crop_aspect_trigger_text');
const cropAspectMenu = document.getElementById('crop_aspect_menu');
const cropRatioGroup = document.getElementById('crop_ratio_group');
const cropRatioHint = document.getElementById('crop_ratio_hint');
const toastContainer = document.getElementById('toast_container');
const uploadInfoArea = document.getElementById('upload_info_area');
const fileInfo = document.getElementById('file_info');
const infoPreviewWrap = document.getElementById('info_preview_wrap');
const infoPreview = document.getElementById('info_preview');
const infoSideControls = document.getElementById('info_side_controls');
const infoUploadPrompt = document.getElementById('info_upload_prompt');
const btnInfoDelete = document.getElementById('btn_info_delete');
// const fileVideo = document.getElementById('file_video'); // 视频去水印已移除
const uploadFaceSourceArea = document.getElementById('upload_face_source_area');
const uploadFaceTargetArea = document.getElementById('upload_face_target_area');
const fileFaceSource = document.getElementById('file_face_source');
const fileFaceTarget = document.getElementById('file_face_target');
const faceSourcePreview = document.getElementById('face_source_preview');
const faceSourceEmpty = document.getElementById('face_source_empty');
const faceTargetEmpty = document.getElementById('face_target_empty');
const faceStageWrap = document.getElementById('face_stage_wrap');
const faceStage = document.getElementById('face_stage');
const faceCanvas = document.getElementById('face_canvas');
const faceCtx = faceCanvas.getContext('2d');
const faceScale = document.getElementById('face_scale');
const faceBlend = document.getElementById('face_blend');
const faceFeather = document.getElementById('face_feather');
const faceScaleText = document.getElementById('face_scale_text');
const faceBlendText = document.getElementById('face_blend_text');
const faceFeatherText = document.getElementById('face_feather_text');
const faceConsent = document.getElementById('face_consent');
const faceStatus = document.getElementById('face_status');
const btnFaceGo = document.getElementById('btn_face_go');
const btnFaceReset = document.getElementById('btn_face_reset');
const btnFaceDown = document.getElementById('btn_face_down');
const advUploadArea = document.getElementById('adv_upload_area');
const fileAdv = document.getElementById('file_adv');
const advStageWrap = document.getElementById('adv_stage_wrap');
const advStage = document.getElementById('adv_stage');
const advCanvas = document.getElementById('adv_canvas');
const advOverlay = document.getElementById('adv_overlay');
const advCtx = advCanvas.getContext('2d', { willReadFrequently: true });
const advOverlayCtx = advOverlay.getContext('2d');
const advFeature = document.getElementById('adv_feature');
const advRun = document.getElementById('adv_run');
const advPanels = Array.from(document.querySelectorAll('.adv-panel'));
const advStatus = document.getElementById('adv_status');
const advBgColor = document.getElementById('adv_bg_color');
const advIdRatio = document.getElementById('adv_id_ratio');
const advIdBg = document.getElementById('adv_id_bg');
const advStyleType = document.getElementById('adv_style_type');
const advBeautyLevel = document.getElementById('adv_beauty_level');
const advMemeTop = document.getElementById('adv_meme_top');
const advMemeBottom = document.getElementById('adv_meme_bottom');
const advOcrLang = document.getElementById('adv_ocr_lang');
const advOcrRun = document.getElementById('adv_ocr_run');
const advOcrTranslate = document.getElementById('adv_ocr_translate');
const advOcrOutput = document.getElementById('adv_ocr_output');
const advLutType = document.getElementById('adv_lut_type');
const advPrivacyAuto = document.getElementById('adv_privacy_auto');
const advPrivacyBrush = document.getElementById('adv_privacy_brush');
const advReset = document.getElementById('adv_reset');
const advDownload = document.getElementById('adv_download');
const advBatchFiles = document.getElementById('adv_batch_files');
const advBatchDrop = document.getElementById('adv_batch_drop');
const advBatchMark = document.getElementById('adv_batch_mark');
const advBatchQuality = document.getElementById('adv_batch_quality');
const advBatchRun = document.getElementById('adv_batch_run');
const advCollageFiles = document.getElementById('adv_collage_files');
const advCollageDrop = document.getElementById('adv_collage_drop');
const advCollageGrid = document.getElementById('adv_collage_grid');
const advCollageTitle = document.getElementById('adv_collage_title');
const advCollageRender = document.getElementById('adv_collage_render');
const advCollageDownload = document.getElementById('adv_collage_download');
const advCollageCanvas = document.getElementById('adv_collage_canvas');
const advCollageCtx = advCollageCanvas.getContext('2d');
const advPdfImages = document.getElementById('adv_pdf_images');
const advPdfImagesDrop = document.getElementById('adv_pdf_images_drop');
const advToPdf = document.getElementById('adv_to_pdf');
const advPdfFile = document.getElementById('adv_pdf_file');
const advPdfFileDrop = document.getElementById('adv_pdf_file_drop');
const advPdfToImg = document.getElementById('adv_pdf_to_img');
const advSingleImageWorkspace = document.getElementById('adv_single_image_workspace');
const advWorkflowWorkspace = document.getElementById('adv_workflow_workspace');
const advCategoryTitle = document.getElementById('adv_category_title');
const advCategoryDesc = document.getElementById('adv_category_desc');
const advFeatureSummary = document.getElementById('adv_feature_summary');
const advFeatureDesc = document.getElementById('adv_feature_desc');
const advPanelEmpty = document.getElementById('adv_panel_empty');
const advCategoryButtons = Array.from(document.querySelectorAll('.adv-category-btn'));
const advFeatureCards = Array.from(document.querySelectorAll('.adv-feature-card'));

let isDraw = false;
let startX = 0, startY = 0;
let lastX = 0, lastY = 0;
let selectedRect = null;
let processedImageUrl = null;
let sourceFaceImage = null;
let targetFaceImage = null;
let faceOutputUrl = null;
let facePlacement = { x: 0, y: 0, size: 0 };
let faceDragging = false;
let faceDragOffsetX = 0;
let faceDragOffsetY = 0;
let advOriginalDataUrl = null;
let advBaseImage = null;
let advSelection = null;
let advDrawing = false;
let advDragStart = { x: 0, y: 0 };
let advMode = 'none';
let advPdfLib = null;
let advCurrentCategory = 'portrait';

const ADV_CATEGORY_META = {
  portrait: {
    title: '人像与创作',
    desc: '以单张图片为主，适合做人像优化、风格化输出和轻创作。',
    defaultFeature: 'cutout',
  },
  enhance: {
    title: '修复与增强',
    desc: '围绕旧图修复、干扰物清理、扩图和清晰增强等质量提升任务。',
    defaultFeature: 'restore',
  },
  text: {
    title: '识别与隐私',
    desc: '用于提取图片中的文字，或对隐私区域做自动和手动保护。',
    defaultFeature: 'ocr',
  },
  workflow: {
    title: '批量与输出',
    desc: '面向多图、多文件和文档转换的流程型任务，不再混在单图编辑里。',
    defaultFeature: null,
  },
};

const ADV_FEATURE_META = {
  cutout: { title: '智能抠图与换背景', desc: '快速替换底色或背景，适合商品图和人像抠图。' },
  idphoto: { title: '一键证件照', desc: '按证件比例输出，并支持切换底色。' },
  beauty: { title: '人像美化', desc: '轻量磨皮提亮，适合自拍和人物照优化。' },
  style: { title: '风格化', desc: '漫画、素描、油画三种风格快速转化。' },
  meme: { title: '表情包工厂', desc: '给图片加上下文案，适合做梗图输出。' },
  restore: { title: '老照片修复', desc: '改善泛黄、轻微模糊和旧照的整体观感。' },
  remove: { title: '物体移除', desc: '框选后修补干扰元素，适合清理杂物或瑕疵。' },
  outpaint: { title: 'AI 扩图', desc: '扩展画面边缘，为封面、海报和横版留白。' },
  upscale: { title: '清晰度增强', desc: '输出 2 倍尺寸并提升整体锐利感。' },
  lut: { title: '智能调色 LUT', desc: '用胶片、日系、赛博等色调快速建立氛围。' },
  ocr: { title: 'OCR 识别与翻译', desc: '识别图片文字并进行简易翻译与整理。' },
  privacy: { title: '图片隐私保护', desc: '自动识别或手动画刷马赛克，保护敏感区域。' },
};

function getCanvasPoint(e) {
  const rect = imgCanvas.getBoundingClientRect();
  const scaleX = imgCanvas.width / rect.width;
  const scaleY = imgCanvas.height / rect.height;

  const rawX = (e.clientX - rect.left) * scaleX;
  const rawY = (e.clientY - rect.top) * scaleY;
  return {
    x: clamp(rawX, 0, imgCanvas.width),
    y: clamp(rawY, 0, imgCanvas.height)
  };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function setImgStatus(message, isError = false) {
  if (!imgStatus) return;
  imgStatus.classList.remove('hidden');
  imgStatus.className = 'mt-4 text-center text-sm ' + (isError ? 'text-red-500 dark:text-red-300' : 'text-gray-500 dark:text-gray-300');
  imgStatus.textContent = translateMessage(message);
}

function updateWatermarkGuidePulse() {
  if (!btnImgGo || !imgPreview) return;
  const hasLoadedImage = Boolean(imgPreview.src && imgPreview.naturalWidth && imgPreview.naturalHeight);
  const hasSelection = Boolean(selectedRect && selectedRect.w >= 2 && selectedRect.h >= 2);
  const hasProcessedResult = Boolean(processedImageUrl && imgPreview.src === processedImageUrl);
  const shouldGuide = hasLoadedImage && !hasProcessedResult && !hasSelection && !btnImgGo.disabled;
  btnImgGo.classList.toggle('btn-guide-pulse', shouldGuide);
}

function setFaceStatus(message, isError = false) {
  faceStatus.classList.remove('hidden');
  faceStatus.className = 'mt-4 text-sm';
  faceStatus.classList.add(isError ? 'text-red-500' : 'text-gray-500');
  faceStatus.classList.add(isError ? 'dark:text-red-300' : 'dark:text-gray-300');
  faceStatus.textContent = translateMessage(message);
}

function showToast(message, type = 'info') {
  if (!toastContainer) return;
  const normalizedType = ['info', 'success', 'warning', 'error'].includes(type) ? type : 'info';
  const iconMap = {
    info: 'fa-info',
    success: 'fa-check',
    warning: 'fa-exclamation',
    error: 'fa-times',
  };
  const durationMap = {
    info: 2400,
    success: 2200,
    warning: 3000,
    error: 3600,
  };
  const duration = durationMap[normalizedType] || 2400;
  const node = document.createElement('div');
  node.className = 'toast-item ' + normalizedType;
  node.style.setProperty('--toast-duration', duration + 'ms');
  node.setAttribute('role', normalizedType === 'error' ? 'alert' : 'status');

  const iconWrap = document.createElement('span');
  iconWrap.className = 'toast-icon';
  const icon = document.createElement('i');
  icon.className = 'fa ' + iconMap[normalizedType];
  iconWrap.appendChild(icon);

  const text = document.createElement('span');
  text.className = 'toast-text';
  text.textContent = translateMessage(message);

  const progress = document.createElement('span');
  progress.className = 'toast-progress';

  node.appendChild(iconWrap);
  node.appendChild(text);
  node.appendChild(progress);
  toastContainer.appendChild(node);
  requestAnimationFrame(() => node.classList.add('show'));
  setTimeout(() => {
    node.classList.remove('show');
    setTimeout(() => node.remove(), 220);
  }, duration);
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = reject;
    img.src = url;
  });
}

function updateFaceControlTexts() {
  faceScaleText.textContent = faceScale.value + '%';
  faceBlendText.textContent = faceBlend.value + '%';
  faceFeatherText.textContent = faceFeather.value + 'px';
}

function getDefaultFacePlacement() {
  if (!targetFaceImage) return { x: 0, y: 0, size: 0 };
  const size = Math.round(Math.min(targetFaceImage.width, targetFaceImage.height) * (Number(faceScale.value) / 100) * 0.45);
  return {
    size,
    x: Math.round(targetFaceImage.width / 2),
    y: Math.round(targetFaceImage.height * 0.42)
  };
}

function getFaceStageDisplaySize() {
  if (!targetFaceImage) return { width: 0, height: 0 };

  const naturalWidth = targetFaceImage.width;
  const naturalHeight = targetFaceImage.height;
  const availableWidth = Math.max(320, Math.min(faceStageWrap.clientWidth || naturalWidth, 560));
  const maxHeight = 420;
  const scale = Math.min(availableWidth / naturalWidth, maxHeight / naturalHeight, 1);

  return {
    width: Math.round(naturalWidth * scale),
    height: Math.round(naturalHeight * scale)
  };
}

function getAverageColorFromRegion(image, sx, sy, sw, sh) {
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = 24;
  sampleCanvas.height = 24;
  const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  sampleCtx.drawImage(image, sx, sy, sw, sh, 0, 0, sampleCanvas.width, sampleCanvas.height);
  const pixels = sampleCtx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;

  let red = 0;
  let green = 0;
  let blue = 0;
  let count = 0;

  for (let index = 0; index < pixels.length; index += 4) {
    if (pixels[index + 3] === 0) continue;
    red += pixels[index];
    green += pixels[index + 1];
    blue += pixels[index + 2];
    count++;
  }

  if (!count) {
    return { red: 128, green: 128, blue: 128 };
  }

  return {
    red: red / count,
    green: green / count,
    blue: blue / count
  };
}

function smoothStep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function getSourceFaceCrop() {
  const naturalWidth = sourceFaceImage.width;
  const naturalHeight = sourceFaceImage.height;
  const cropSize = Math.min(naturalWidth * 0.82, naturalHeight * 0.82);
  const sx = Math.max(0, (naturalWidth - cropSize) / 2);
  const sy = clamp(naturalHeight * 0.12, 0, naturalHeight - cropSize);

  return {
    sx,
    sy,
    sSize: cropSize
  };
}

function getSkinConfidence(red, green, blue) {
  const maxChannel = Math.max(red, green, blue);
  const minChannel = Math.min(red, green, blue);
  const rgDiff = Math.abs(red - green);
  const rgbRule = red > 92 && green > 40 && blue > 20 && rgDiff > 10 && maxChannel - minChannel > 15 && red > green && red > blue;
  const cb = 128 - 0.168736 * red - 0.331264 * green + 0.5 * blue;
  const cr = 128 + 0.5 * red - 0.418688 * green - 0.081312 * blue;
  const ycbcrRule = cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;

  if (rgbRule && ycbcrRule) return 1;
  if (rgbRule || ycbcrRule) return 0.65;
  return 0.22;
}

function refineFaceLayerAlpha(layerCtx, size) {
  const faceLayerData = layerCtx.getImageData(0, 0, size, size);
  const pixels = faceLayerData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const index = (y * size + x) * 4;
      const red = pixels[index];
      const green = pixels[index + 1];
      const blue = pixels[index + 2];
      const nx = x / size;
      const ny = y / size;
      const dx = (nx - 0.5) / 0.31;
      const dy = (ny - 0.55) / 0.40;
      const faceDistance = Math.sqrt(dx * dx + dy * dy);
      const geometryAlpha = 1 - smoothStep(0.76, 1.06, faceDistance);
      const foreheadFade = smoothStep(0.14, 0.30, ny);
      const chinFade = 1 - smoothStep(0.90, 1.02, ny);
      const skinAlpha = getSkinConfidence(red, green, blue);
      const alpha = pixels[index + 3] * geometryAlpha * foreheadFade * chinFade * skinAlpha;
      pixels[index + 3] = clamp(alpha, 0, 255);
    }
  }

  layerCtx.putImageData(faceLayerData, 0, 0);
}

function createBlendedFaceLayer(size, left, top) {
  const layerCanvas = document.createElement('canvas');
  layerCanvas.width = size;
  layerCanvas.height = size;
  const layerCtx = layerCanvas.getContext('2d', { willReadFrequently: true });
  const sourceCrop = getSourceFaceCrop();

  layerCtx.filter = 'saturate(1.03) contrast(1.02)';
  layerCtx.drawImage(
    sourceFaceImage,
    sourceCrop.sx,
    sourceCrop.sy,
    sourceCrop.sSize,
    sourceCrop.sSize,
    0,
    0,
    size,
    size
  );
  layerCtx.filter = 'none';

  const sourceAvg = getAverageColorFromRegion(
    sourceFaceImage,
    sourceCrop.sx,
    sourceCrop.sy,
    sourceCrop.sSize,
    sourceCrop.sSize
  );
  const targetAvg = getAverageColorFromRegion(targetFaceImage, left, top, size, size);
  const layerData = layerCtx.getImageData(0, 0, size, size);
  const data = layerData.data;

  const ratioRed = clamp(targetAvg.red / Math.max(sourceAvg.red, 1), 0.72, 1.28);
  const ratioGreen = clamp(targetAvg.green / Math.max(sourceAvg.green, 1), 0.72, 1.28);
  const ratioBlue = clamp(targetAvg.blue / Math.max(sourceAvg.blue, 1), 0.72, 1.28);

  for (let index = 0; index < data.length; index += 4) {
    data[index] = clamp(data[index] * ratioRed, 0, 255);
    data[index + 1] = clamp(data[index + 1] * ratioGreen, 0, 255);
    data[index + 2] = clamp(data[index + 2] * ratioBlue, 0, 255);
  }

  layerCtx.putImageData(layerData, 0, 0);
  refineFaceLayerAlpha(layerCtx, size);

  const mask = layerCtx.createRadialGradient(
    size / 2,
    size * 0.56,
    size * 0.12,
    size / 2,
    size * 0.56,
    size * 0.56
  );
  mask.addColorStop(0, 'rgba(255,255,255,1)');
  mask.addColorStop(0.66, 'rgba(255,255,255,0.92)');
  mask.addColorStop(1, 'rgba(255,255,255,0)');

  layerCtx.save();
  layerCtx.globalCompositeOperation = 'destination-in';
  layerCtx.beginPath();
  layerCtx.ellipse(size / 2, size * 0.56, size * 0.34, size * 0.40, 0, 0, Math.PI * 2);
  layerCtx.clip();
  layerCtx.fillStyle = mask;
  layerCtx.fillRect(0, 0, size, size);
  layerCtx.restore();

  return layerCanvas;
}

function getFaceDrawBox() {
  if (!targetFaceImage || !sourceFaceImage || !facePlacement.size) return null;

  const maxSize = Math.min(faceCanvas.width, faceCanvas.height);
  const size = clamp(facePlacement.size, 40, maxSize);
  const half = size / 2;
  const centerX = clamp(facePlacement.x, half, faceCanvas.width - half);
  const centerY = clamp(facePlacement.y, half, faceCanvas.height - half);

  facePlacement.x = centerX;
  facePlacement.y = centerY;
  facePlacement.size = size;

  return {
    size,
    left: centerX - half,
    top: centerY - half,
    centerX,
    centerY
  };
}

function drawFaceCanvasPreview(showGuide = true) {
  if (!targetFaceImage) return;

  faceCanvas.width = targetFaceImage.width;
  faceCanvas.height = targetFaceImage.height;
  const displaySize = getFaceStageDisplaySize();
  faceStage.style.width = displaySize.width + 'px';
  faceStage.style.height = displaySize.height + 'px';
  faceCanvas.style.width = displaySize.width + 'px';
  faceCanvas.style.height = displaySize.height + 'px';
  faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
  faceCtx.drawImage(targetFaceImage, 0, 0);

  const box = getFaceDrawBox();
  if (!box) return;

  const { size, left, top, centerX, centerY } = box;
  const feather = Number(faceFeather.value);
  const faceLayer = createBlendedFaceLayer(size, left, top);

  faceCtx.save();
  faceCtx.globalAlpha = Number(faceBlend.value) / 100;
  faceCtx.filter = 'blur(0.6px)';
  faceCtx.drawImage(faceLayer, left, top, size, size);
  faceCtx.restore();

  // 回叠目标脸部细节，保留头型、发际线和原始光影。
  faceCtx.save();
  faceCtx.globalAlpha = 0.16;
  faceCtx.globalCompositeOperation = 'soft-light';
  faceCtx.beginPath();
  faceCtx.ellipse(centerX, centerY, size * 0.41, size * 0.49, 0, 0, Math.PI * 2);
  faceCtx.clip();
  faceCtx.drawImage(targetFaceImage, left, top, size, size, left, top, size, size);
  faceCtx.restore();

  const gradient = faceCtx.createRadialGradient(
    centerX,
    centerY,
    size * 0.16,
    centerX,
    centerY,
    size * 0.54
  );
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(clamp((size * 0.5 - feather) / (size * 0.54), 0.45, 0.9), 'rgba(0, 0, 0, 0)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.12)');

  faceCtx.save();
  faceCtx.globalCompositeOperation = 'soft-light';
  faceCtx.fillStyle = gradient;
  faceCtx.beginPath();
  faceCtx.ellipse(centerX, centerY, size * 0.42, size * 0.5, 0, 0, Math.PI * 2);
  faceCtx.fill();
  faceCtx.restore();

  if (!showGuide) return;

  faceCtx.save();
  faceCtx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  faceCtx.lineWidth = Math.max(2, size * 0.012);
  faceCtx.strokeRect(left, top, size, size);
  faceCtx.setLineDash([10, 6]);
  faceCtx.strokeStyle = '#4f46e5';
  faceCtx.lineWidth = Math.max(2, size * 0.008);
  faceCtx.strokeRect(left, top, size, size);
  faceCtx.restore();
}

function refreshFaceButtonState() {
  const ready = Boolean(sourceFaceImage && targetFaceImage);
  btnFaceGo.disabled = !ready;
  btnFaceReset.disabled = !ready;
}

async function loadFaceSource() {
  const file = fileFaceSource.files[0];
  if (!file) return;

  const { img, url } = await readImageFile(file);
  sourceFaceImage = img;
  faceOutputUrl = null;
  btnFaceDown.classList.add('hidden');
  faceSourcePreview.src = url;
  faceSourcePreview.classList.remove('hidden');
  faceSourceEmpty.classList.add('hidden');
  refreshFaceButtonState();
  setFaceStatus('源脸已加载，请再上传目标图并开始换脸预览。');
  if (targetFaceImage) {
    facePlacement = getDefaultFacePlacement();
    drawFaceCanvasPreview();
  }
}

async function loadFaceTarget() {
  const file = fileFaceTarget.files[0];
  if (!file) return;

  const { img } = await readImageFile(file);
  targetFaceImage = img;
  faceOutputUrl = null;
  btnFaceDown.classList.add('hidden');
  faceDragging = false;
  faceStageWrap.classList.remove('hidden');
  faceTargetEmpty.classList.add('hidden');
  facePlacement = getDefaultFacePlacement();
  drawFaceCanvasPreview();
  refreshFaceButtonState();
  setFaceStatus('目标图已加载，可开始拖拽调整脸部位置。');
}

function exportFaceResult() {
  drawFaceCanvasPreview(false);
  faceOutputUrl = faceCanvas.toDataURL('image/png');
  drawFaceCanvasPreview(true);
  btnFaceDown.classList.remove('hidden');
}

function getFaceCanvasPoint(e) {
  const rect = faceCanvas.getBoundingClientRect();
  const scaleX = faceCanvas.width / rect.width;
  const scaleY = faceCanvas.height / rect.height;
  return {
    x: clamp((e.clientX - rect.left) * scaleX, 0, faceCanvas.width),
    y: clamp((e.clientY - rect.top) * scaleY, 0, faceCanvas.height)
  };
}

function removeWatermarkRegion(context, rx, ry, rw, rh) {
  const width = context.canvas.width;
  const height = context.canvas.height;
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;

  const x0 = clamp(Math.floor(rx), 1, width - 2);
  const y0 = clamp(Math.floor(ry), 1, height - 2);
  const x1 = clamp(Math.ceil(rx + rw), x0 + 1, width - 2);
  const y1 = clamp(Math.ceil(ry + rh), y0 + 1, height - 2);

  const getIndex = (x, y) => (y * width + x) * 4;

  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const lIdx = getIndex(x0 - 1, y);
      const rIdx = getIndex(x1, y);
      const tIdx = getIndex(x, y0 - 1);
      const bIdx = getIndex(x, y1);
      const idx = getIndex(x, y);

      const wl = 1 / (x - x0 + 1);
      const wr = 1 / (x1 - x + 1);
      const wt = 1 / (y - y0 + 1);
      const wb = 1 / (y1 - y + 1);
      const ws = wl + wr + wt + wb;

      for (let c = 0; c < 3; c++) {
        const value = (
          data[lIdx + c] * wl +
          data[rIdx + c] * wr +
          data[tIdx + c] * wt +
          data[bIdx + c] * wb
        ) / ws;
        data[idx + c] = value;
      }
      data[idx + 3] = 255;
    }
  }

  // 对修复区域做轻微平滑，减少边缘痕迹
  for (let pass = 0; pass < 2; pass++) {
    for (let y = y0 + 1; y < y1 - 1; y++) {
      for (let x = x0 + 1; x < x1 - 1; x++) {
        const idx = getIndex(x, y);
        for (let c = 0; c < 3; c++) {
          const avg = (
            data[getIndex(x - 1, y) + c] +
            data[getIndex(x + 1, y) + c] +
            data[getIndex(x, y - 1) + c] +
            data[getIndex(x, y + 1) + c] +
            data[idx + c]
          ) / 5;
          data[idx + c] = avg;
        }
      }
    }
  }

  context.putImageData(imageData, 0, 0);
}

function drawSelectionRect(x, y, w, h) {
  ctx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);

  // 半透明填充 + 双层描边，提高复杂背景下的可见性
  ctx.fillStyle = 'rgba(99, 102, 241, 0.18)';
  ctx.fillRect(x, y, w, h);

  ctx.setLineDash([]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.strokeRect(x, y, w, h);

  ctx.setLineDash([8, 6]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#4f46e5';
  ctx.strokeRect(x, y, w, h);
}

function setAdvStatus(message, isError = false) {
  advStatus.className = 'text-sm mb-6 ' + (isError ? 'text-red-500' : 'text-gray-500');
  advStatus.textContent = translateMessage(message);
}

function advEnsureImage() {
  if (!advBaseImage || !advCanvas.width || !advCanvas.height) {
    setAdvStatus('请先上传主画布图片。', true);
    return false;
  }
  return true;
}

function advSyncOverlay() {
  advOverlay.width = advCanvas.width;
  advOverlay.height = advCanvas.height;
  advOverlay.style.width = advCanvas.style.width;
  advOverlay.style.height = advCanvas.style.height;
}

function advFitStage() {
  const maxWidth = Math.min(advStageWrap.clientWidth || advCanvas.width, 760);
  const scale = Math.min(maxWidth / advCanvas.width, 1);
  const displayW = Math.round(advCanvas.width * scale);
  const displayH = Math.round(advCanvas.height * scale);
  advStage.style.width = displayW + 'px';
  advStage.style.height = displayH + 'px';
  advCanvas.style.width = displayW + 'px';
  advCanvas.style.height = displayH + 'px';
  advSyncOverlay();
}

function advGetPoint(event) {
  const rect = advOverlay.getBoundingClientRect();
  const scaleX = advOverlay.width / rect.width;
  const scaleY = advOverlay.height / rect.height;
  return {
    x: clamp((event.clientX - rect.left) * scaleX, 0, advOverlay.width),
    y: clamp((event.clientY - rect.top) * scaleY, 0, advOverlay.height)
  };
}

function advDrawOverlayRect(rect) {
  advOverlayCtx.clearRect(0, 0, advOverlay.width, advOverlay.height);
  advOverlayCtx.fillStyle = 'rgba(99,102,241,0.16)';
  advOverlayCtx.fillRect(rect.x, rect.y, rect.w, rect.h);
  advOverlayCtx.lineWidth = 2;
  advOverlayCtx.strokeStyle = 'rgba(255,255,255,0.95)';
  advOverlayCtx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  advOverlayCtx.setLineDash([7, 5]);
  advOverlayCtx.strokeStyle = '#4f46e5';
  advOverlayCtx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  advOverlayCtx.setLineDash([]);
}

function advClearOverlay() {
  advOverlayCtx.clearRect(0, 0, advOverlay.width, advOverlay.height);
}

function advParseHex(hex) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16)
  };
}

function advGetBorderAvg(data, width, height) {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;
  const push = (x, y) => {
    const idx = (y * width + x) * 4;
    r += data[idx];
    g += data[idx + 1];
    b += data[idx + 2];
    count++;
  };
  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    push(0, y);
    push(width - 1, y);
  }
  return { r: r / count, g: g / count, b: b / count };
}

function advBoxBlur(imageData, radius) {
  const { width, height, data } = imageData;
  const out = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let c = 0;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = clamp(x + dx, 0, width - 1);
          const ny = clamp(y + dy, 0, height - 1);
          const idx = (ny * width + nx) * 4;
          r += data[idx];
          g += data[idx + 1];
          b += data[idx + 2];
          c++;
        }
      }
      const outIdx = (y * width + x) * 4;
      out[outIdx] = r / c;
      out[outIdx + 1] = g / c;
      out[outIdx + 2] = b / c;
      out[outIdx + 3] = 255;
    }
  }
  return new ImageData(out, width, height);
}

function advApplyCutout() {
  const imageData = advCtx.getImageData(0, 0, advCanvas.width, advCanvas.height);
  const data = imageData.data;
  const border = advGetBorderAvg(data, advCanvas.width, advCanvas.height);
  const bg = advParseHex(advBgColor.value);
  const cx = advCanvas.width / 2;
  const cy = advCanvas.height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < advCanvas.height; y++) {
    for (let x = 0; x < advCanvas.width; x++) {
      const i = (y * advCanvas.width + x) * 4;
      const dr = data[i] - border.r;
      const dg = data[i + 1] - border.g;
      const db = data[i + 2] - border.b;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      const centerBias = 1 - Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / maxDist;
      if (dist * 0.8 + centerBias * 70 < 70) {
        data[i] = bg.r;
        data[i + 1] = bg.g;
        data[i + 2] = bg.b;
      }
    }
  }
  advCtx.putImageData(imageData, 0, 0);
  setAdvStatus('智能抠图与换背景已完成。');
}

function advApplyIdPhoto() {
  const ratioMap = { '1:1': 1, '2:3': 2 / 3, '35:45': 35 / 45 };
  const ratio = ratioMap[advIdRatio.value] || 1;
  const srcW = advCanvas.width;
  const srcH = advCanvas.height;
  let cropW = srcW;
  let cropH = Math.round(cropW / ratio);
  if (cropH > srcH) {
    cropH = srcH;
    cropW = Math.round(cropH * ratio);
  }
  const sx = Math.max(0, Math.floor((srcW - cropW) / 2));
  const sy = Math.max(0, Math.floor((srcH - cropH) * 0.2));
  const outW = 600;
  const outH = Math.round(outW / ratio);

  const temp = document.createElement('canvas');
  temp.width = outW;
  temp.height = outH;
  const tctx = temp.getContext('2d');
  tctx.fillStyle = advIdBg.value;
  tctx.fillRect(0, 0, outW, outH);
  tctx.drawImage(advCanvas, sx, sy, cropW, cropH, 0, 0, outW, outH);

  advCanvas.width = outW;
  advCanvas.height = outH;
  advCtx.drawImage(temp, 0, 0);
  advFitStage();
  setAdvStatus('证件照已生成。');
}

function advApplyRestore() {
  const src = advCtx.getImageData(0, 0, advCanvas.width, advCanvas.height);
  const blur = advBoxBlur(src, 1);
  const d = blur.data;
  for (let i = 0; i < d.length; i += 4) {
    const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
    d[i] = clamp(avg * 1.08 + 6, 0, 255);
    d[i + 1] = clamp(avg * 1.02 + 4, 0, 255);
    d[i + 2] = clamp(avg * 0.95, 0, 255);
  }
  advCtx.putImageData(blur, 0, 0);
  setAdvStatus('老照片修复完成。');
}

function advApplyStyle() {
  const type = advStyleType.value;
  const id = advCtx.getImageData(0, 0, advCanvas.width, advCanvas.height);
  const d = id.data;

  if (type === 'sketch') {
    for (let i = 0; i < d.length; i += 4) {
      const gray = (d[i] + d[i + 1] + d[i + 2]) / 3;
      const v = gray > 140 ? 248 : clamp(gray * 0.62, 0, 255);
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
    }
    advCtx.putImageData(id, 0, 0);
    setAdvStatus('素描风格完成。');
    return;
  }

  if (type === 'oil') {
    const oil = advBoxBlur(id, 2);
    const od = oil.data;
    for (let i = 0; i < od.length; i += 4) {
      od[i] = clamp(Math.round(od[i] / 22) * 22, 0, 255);
      od[i + 1] = clamp(Math.round(od[i + 1] / 22) * 22, 0, 255);
      od[i + 2] = clamp(Math.round(od[i + 2] / 22) * 22, 0, 255);
    }
    advCtx.putImageData(oil, 0, 0);
    setAdvStatus('油画风格完成。');
    return;
  }

  for (let i = 0; i < d.length; i += 4) {
    d[i] = clamp(d[i] * 1.18 + 8, 0, 255);
    d[i + 1] = clamp(d[i + 1] * 1.08 + 3, 0, 255);
    d[i + 2] = clamp(d[i + 2] * 0.86, 0, 255);
  }
  advCtx.putImageData(id, 0, 0);
  setAdvStatus('漫画风格完成。');
}

function advApplyBeauty() {
  const level = Number(advBeautyLevel.value);
  const src = advCtx.getImageData(0, 0, advCanvas.width, advCanvas.height);
  const blur = advBoxBlur(src, Math.max(1, Math.round(level / 3)));
  const a = clamp(level / 14, 0.12, 0.65);
  for (let i = 0; i < src.data.length; i += 4) {
    src.data[i] = clamp(src.data[i] * (1 - a) + blur.data[i] * a + 6, 0, 255);
    src.data[i + 1] = clamp(src.data[i + 1] * (1 - a) + blur.data[i + 1] * a + 6, 0, 255);
    src.data[i + 2] = clamp(src.data[i + 2] * (1 - a) + blur.data[i + 2] * a + 4, 0, 255);
  }
  advCtx.putImageData(src, 0, 0);
  setAdvStatus('人像美化完成。');
}

function advApplyOutpaint() {
  const ow = advCanvas.width;
  const oh = advCanvas.height;
  const nw = Math.round(ow * 1.3);
  const nh = Math.round(oh * 1.3);
  const temp = document.createElement('canvas');
  temp.width = nw;
  temp.height = nh;
  const tctx = temp.getContext('2d');
  const ox = Math.round((nw - ow) / 2);
  const oy = Math.round((nh - oh) / 2);

  tctx.filter = 'blur(18px)';
  tctx.drawImage(advCanvas, 0, 0, ow, oh, 0, 0, nw, nh);
  tctx.filter = 'none';
  tctx.drawImage(advCanvas, ox, oy, ow, oh);

  advCanvas.width = nw;
  advCanvas.height = nh;
  advCtx.drawImage(temp, 0, 0);
  advFitStage();
  setAdvStatus('AI 扩图完成。');
}

function advApplyUpscale() {
  const temp = document.createElement('canvas');
  temp.width = advCanvas.width * 2;
  temp.height = advCanvas.height * 2;
  const tctx = temp.getContext('2d', { willReadFrequently: true });
  tctx.imageSmoothingEnabled = true;
  tctx.imageSmoothingQuality = 'high';
  tctx.drawImage(advCanvas, 0, 0, temp.width, temp.height);
  const id = tctx.getImageData(0, 0, temp.width, temp.height);
  for (let i = 0; i < id.data.length; i += 4) {
    id.data[i] = clamp((id.data[i] - 128) * 1.08 + 128, 0, 255);
    id.data[i + 1] = clamp((id.data[i + 1] - 128) * 1.08 + 128, 0, 255);
    id.data[i + 2] = clamp((id.data[i + 2] - 128) * 1.08 + 128, 0, 255);
  }
  tctx.putImageData(id, 0, 0);
  advCanvas.width = temp.width;
  advCanvas.height = temp.height;
  advCtx.drawImage(temp, 0, 0);
  advFitStage();
  setAdvStatus('清晰度增强（2x）完成。');
}

function advApplyMeme() {
  const top = advMemeTop.value.trim();
  const bottom = advMemeBottom.value.trim();
  const size = Math.max(24, Math.round(advCanvas.width / 16));
  advCtx.font = 'bold ' + size + 'px sans-serif';
  advCtx.textAlign = 'center';
  advCtx.lineWidth = Math.max(3, Math.round(size / 6));
  advCtx.fillStyle = '#fff';
  advCtx.strokeStyle = '#000';
  if (top) {
    advCtx.strokeText(top, advCanvas.width / 2, size + 20);
    advCtx.fillText(top, advCanvas.width / 2, size + 20);
  }
  if (bottom) {
    advCtx.strokeText(bottom, advCanvas.width / 2, advCanvas.height - 20);
    advCtx.fillText(bottom, advCanvas.width / 2, advCanvas.height - 20);
  }
  setAdvStatus('表情包文案已添加。');
}

function advApplyLut() {
  const id = advCtx.getImageData(0, 0, advCanvas.width, advCanvas.height);
  const d = id.data;
  const type = advLutType.value;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    if (type === 'film') {
      d[i] = clamp(r * 1.1 + 8, 0, 255);
      d[i + 1] = clamp(g * 1.03 + 4, 0, 255);
      d[i + 2] = clamp(b * 0.9, 0, 255);
    } else if (type === 'japan') {
      d[i] = clamp(r * 1.04 + 10, 0, 255);
      d[i + 1] = clamp(g * 1.08 + 10, 0, 255);
      d[i + 2] = clamp(b * 1.12 + 14, 0, 255);
    } else {
      d[i] = clamp(r * 0.9 + b * 0.25, 0, 255);
      d[i + 1] = clamp(g * 0.95, 0, 255);
      d[i + 2] = clamp(b * 1.25 + 18, 0, 255);
    }
  }
  advCtx.putImageData(id, 0, 0);
  setAdvStatus('LUT 调色完成。');
}

function advIsSkin(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const rule1 = r > 95 && g > 40 && b > 20 && max - min > 15 && Math.abs(r - g) > 12 && r > g && r > b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  const rule2 = cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
  return rule1 && rule2;
}

function advMosaicRect(x, y, w, h, block) {
  const sx = clamp(Math.floor(x), 0, advCanvas.width - 1);
  const sy = clamp(Math.floor(y), 0, advCanvas.height - 1);
  const sw = clamp(Math.floor(w), 1, advCanvas.width - sx);
  const sh = clamp(Math.floor(h), 1, advCanvas.height - sy);
  const imageData = advCtx.getImageData(sx, sy, sw, sh);
  const d = imageData.data;
  for (let by = 0; by < sh; by += block) {
    for (let bx = 0; bx < sw; bx += block) {
      const cx = Math.min(bx + Math.floor(block / 2), sw - 1);
      const cy = Math.min(by + Math.floor(block / 2), sh - 1);
      const p = (cy * sw + cx) * 4;
      for (let yy = by; yy < Math.min(by + block, sh); yy++) {
        for (let xx = bx; xx < Math.min(bx + block, sw); xx++) {
          const i = (yy * sw + xx) * 4;
          d[i] = d[p];
          d[i + 1] = d[p + 1];
          d[i + 2] = d[p + 2];
        }
      }
    }
  }
  advCtx.putImageData(imageData, sx, sy);
}

function advApplyAutoPrivacy() {
  const id = advCtx.getImageData(0, 0, advCanvas.width, advCanvas.height);
  const d = id.data;
  let minX = advCanvas.width;
  let minY = advCanvas.height;
  let maxX = 0;
  let maxY = 0;
  let count = 0;
  for (let y = 0; y < advCanvas.height; y += 2) {
    for (let x = 0; x < advCanvas.width; x += 2) {
      const i = (y * advCanvas.width + x) * 4;
      if (advIsSkin(d[i], d[i + 1], d[i + 2])) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
        count++;
      }
    }
  }
  if (count < 80) {
    setAdvStatus('未检测到明显隐私区域，可改用手动刷抹。');
    return;
  }
  const pad = 18;
  advMosaicRect(minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2, 14);
  setAdvStatus('自动隐私马赛克已完成。');
}

function advSimpleTranslate(text) {
  const map = [
    ['hello', '你好'], ['world', '世界'], ['good', '好'], ['morning', '早上'], ['night', '夜晚'],
    ['price', '价格'], ['order', '订单'], ['success', '成功'], ['failed', '失败'], ['warning', '警告']
  ];
  let out = text;
  map.forEach((pair) => {
    out = out.replace(new RegExp(pair[0], 'gi'), pair[1]);
  });
  return out;
}

async function advLoadPdfLib() {
  if (advPdfLib) return advPdfLib;
  advPdfLib = await import('https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.min.mjs');
  advPdfLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';
  return advPdfLib;
}

// 点击上传
uploadImgArea.addEventListener('click', () => fileImg.click());
fileImg.addEventListener('click', (e) => e.stopPropagation());
fileEdit.addEventListener('click', (e) => e.stopPropagation());
fileFaceSource.addEventListener('click', (e) => e.stopPropagation());
fileFaceTarget.addEventListener('click', (e) => e.stopPropagation());

// 拖拽上传
uploadImgArea.addEventListener('dragover', (e) => e.preventDefault());
uploadImgArea.addEventListener('drop', (e) => {
  e.preventDefault();
  fileImg.files = e.dataTransfer.files;
  loadPreviewImage();
});

// 图片加载并回显（修复完成）
fileImg.addEventListener('change', loadPreviewImage);
function loadPreviewImage() {
  const file = fileImg.files[0];
  if (!file) return;

  selectedRect = null;
  processedImageUrl = null;
  btnImgDown.classList.add('hidden');
  btnImgGo.disabled = true;
  btnImgGo.classList.remove('btn-guide-pulse');
  btnImgGo.innerHTML = '<i class="fa fa-magic mr-1"></i>AI去除水印';
  imgStatus.classList.add('hidden');
  imgProgress.parentElement.classList.add('hidden');
  imgProgress.style.width = '0%';

  const mountImageStage = () => {
    const hasProcessedResult = Boolean(processedImageUrl && imgPreview.src === processedImageUrl);
    imgPreviewWrap.classList.remove('hidden');

    requestAnimationFrame(() => {
      const displayWidth = imgPreview.clientWidth;
      const displayHeight = imgPreview.clientHeight;

      imgStage.style.width = displayWidth + 'px';
      imgStage.style.height = displayHeight + 'px';
      imgCanvas.width = imgPreview.naturalWidth;
      imgCanvas.height = imgPreview.naturalHeight;
      imgCanvas.style.width = displayWidth + 'px';
      imgCanvas.style.height = displayHeight + 'px';
      ctx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
      btnImgGo.disabled = false;
      if (!hasProcessedResult) {
        setImgStatus('图片已加载，请先框选水印区域后再执行。');
      }
      updateWatermarkGuidePulse();
    });
  };

  const url = URL.createObjectURL(file);
  imgPreview.onerror = () => {
    setImgStatus('图片加载失败，请更换图片重试。', true);
    showToast('图片加载失败，请更换图片重试。', 'error');
    btnImgGo.disabled = false;
    updateWatermarkGuidePulse();
  };
  imgPreview.src = url;

  imgPreview.onload = mountImageStage;
  if (imgPreview.complete && imgPreview.naturalWidth > 0) {
    mountImageStage();
  }
}

// 框选水印（修复完成）
imgCanvas.onmousedown = (e) => {
  const p = getCanvasPoint(e);
  startX = p.x;
  startY = p.y;
  lastX = p.x;
  lastY = p.y;
  selectedRect = null;
  isDraw = true;
  ctx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
};

imgCanvas.onmousemove = (e) => {
  if (!isDraw) return;
  const p = getCanvasPoint(e);
  lastX = p.x;
  lastY = p.y;

  const x = Math.min(startX, lastX);
  const y = Math.min(startY, lastY);
  const w = Math.abs(lastX - startX);
  const h = Math.abs(lastY - startY);
  drawSelectionRect(x, y, w, h);
};

function finalizeSelection() {
  const x = Math.min(startX, lastX);
  const y = Math.min(startY, lastY);
  const w = Math.abs(lastX - startX);
  const h = Math.abs(lastY - startY);

  if (w < 2 || h < 2) {
    selectedRect = null;
    ctx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
    updateWatermarkGuidePulse();
    return;
  }

  selectedRect = { x, y, w, h };
  drawSelectionRect(x, y, w, h);
  updateWatermarkGuidePulse();
}

imgCanvas.onmouseup = (e) => {
  const p = getCanvasPoint(e);
  lastX = p.x;
  lastY = p.y;
  isDraw = false;
  finalizeSelection();
};

window.addEventListener('mouseup', (e) => {
  if (!isDraw) return;
  const p = getCanvasPoint(e);
  lastX = p.x;
  lastY = p.y;
  isDraw = false;
  finalizeSelection();
});

// AI 处理（修复：正常显示状态 + 正常处理）
btnImgGo.onclick = async function () {
  if (!imgPreview.src || !imgPreview.naturalWidth || !imgPreview.naturalHeight) {
    imgStatus.classList.add('hidden');
    showToast('请先上传并加载图片。', 'warning');
    return;
  }

  if (!selectedRect || selectedRect.w < 2 || selectedRect.h < 2) {
    setImgStatus('请先在图片上框选需要去除的水印区域', true);
    showToast('请先框选水印区域', 'warning');
    return;
  }

  btnImgGo.disabled = true;
  updateWatermarkGuidePulse();
  imgStatus.classList.remove('hidden');
  imgProgress.parentElement.classList.remove('hidden');

  setImgStatus('AI 模型处理中...');
  imgProgress.style.width = "30%";

  await new Promise(resolve => requestAnimationFrame(resolve));

  try {
    const workCanvas = document.createElement('canvas');
    workCanvas.width = imgPreview.naturalWidth;
    workCanvas.height = imgPreview.naturalHeight;
    const workCtx = workCanvas.getContext('2d');
    workCtx.drawImage(imgPreview, 0, 0, workCanvas.width, workCanvas.height);

    imgProgress.style.width = '70%';
    removeWatermarkRegion(
      workCtx,
      selectedRect.x,
      selectedRect.y,
      selectedRect.w,
      selectedRect.h
    );

    processedImageUrl = workCanvas.toDataURL('image/png');
    imgPreview.src = processedImageUrl;

    imgCanvas.width = imgPreview.naturalWidth;
    imgCanvas.height = imgPreview.naturalHeight;
    imgCanvas.style.width = imgPreview.offsetWidth + 'px';
    imgCanvas.style.height = imgPreview.offsetHeight + 'px';
    ctx.clearRect(0, 0, imgCanvas.width, imgCanvas.height);
    selectedRect = null;

    imgProgress.style.width = "100%";
    setImgStatus('水印去除完成！');
    showToast('水印去除完成', 'success');
    btnImgDown.classList.remove('hidden');
    btnImgGo.innerHTML = '<i class="fa fa-check mr-1"></i>处理完成';
  } catch (error) {
    setImgStatus('处理失败，请重试', true);
    showToast('处理失败，请重试', 'error');
    imgProgress.style.width = '0%';
  } finally {
    btnImgGo.disabled = false;
    updateWatermarkGuidePulse();
  }
};

// 下载（修复正常）
btnImgDown.onclick = () => {
  const a = document.createElement('a');
  a.href = processedImageUrl || imgPreview.src;
  a.download = "AI去水印结果.png";
  a.click();
};

// ==============================================
// 👆👆👆 修复结束，其他功能完全不动
// ==============================================

let infoOriginalUrl = null;
let infoOriginalFile = null;
let infoOriginalImage = null;
let infoExifTags = null;
let infoRotateDeg = 0;

function _formatBytes(size) {
  if (!Number.isFinite(size) || size <= 0) return '-';
  if (size >= 1024 * 1024) return (size / 1024 / 1024).toFixed(2) + ' MB';
  if (size >= 1024) return (size / 1024).toFixed(1) + ' KB';
  return size + ' B';
}

function _formatDateTime(ts) {
  if (!ts) return '-';
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleString('zh-CN');
}

function _ratioString(w, h) {
  if (!w || !h) return '-';
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const g = gcd(w, h);
  return (w / g) + ':' + (h / g);
}

function _exifGpsToDecimal(vals, ref) {
  if (!Array.isArray(vals) || vals.length < 3) return null;
  const toNum = (v) => {
    if (typeof v === 'number') return v;
    if (v && typeof v.numerator === 'number' && typeof v.denominator === 'number' && v.denominator !== 0) {
      return v.numerator / v.denominator;
    }
    return Number(v) || 0;
  };
  const deg = toNum(vals[0]);
  const min = toNum(vals[1]);
  const sec = toNum(vals[2]);
  let dec = deg + min / 60 + sec / 3600;
  if (ref === 'S' || ref === 'W') dec *= -1;
  return dec;
}

function _readExifTags(file) {
  return new Promise((resolve) => {
    if (!file || !window.EXIF || typeof EXIF.readFromBinaryFile !== 'function') {
      resolve({});
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const tags = EXIF.readFromBinaryFile(e.target.result) || {};
        resolve(tags);
      } catch (_) {
        resolve({});
      }
    };
    reader.onerror = () => resolve({});
    reader.readAsArrayBuffer(file);
  });
}

async function _hashFileSha256(file) {
  if (!file || !window.crypto || !crypto.subtle) return '-';
  try {
    const buf = await file.arrayBuffer();
    const digest = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (_) {
    return '-';
  }
}

function _setInfoText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function _syncInfoSideControlsPosition() {
  if (!infoPreviewWrap || !infoSideControls || infoPreviewWrap.classList.contains('hidden')) return;
  infoSideControls.style.top = infoPreviewWrap.offsetTop + 'px';
}

function _renderInfoPreviewImage() {
  if (!infoOriginalImage || !infoPreview) return;
  const sw = infoOriginalImage.naturalWidth || 0;
  const sh = infoOriginalImage.naturalHeight || 0;
  if (!sw || !sh) return;
  const container = uploadInfoArea;
  const maxW = container ? Math.max(container.offsetWidth - 16, 200) : 400;
  const maxH = Math.min(Math.round(maxW * 0.55), 360);
  const scale = Math.min(1, maxW / sw, maxH / sh);
  const dw = Math.max(60, Math.round(sw * scale));
  const dh = Math.max(60, Math.round(sh * scale));
  if (infoPreviewWrap) {
    infoPreviewWrap.style.width = dw + 'px';
    infoPreviewWrap.style.height = dh + 'px';
  }
  infoPreview.style.width = dw + 'px';
  infoPreview.style.height = dh + 'px';
  _syncInfoSideControlsPosition();
}

function _showEditInfo(show) {
  const empty = document.getElementById('edit_info_empty');
  const content = document.getElementById('edit_info_content');
  if (!empty || !content) return;
  empty.classList.toggle('hidden', show);
  content.classList.toggle('hidden', !show);
}

function _loadInfoImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ url, img });
    img.onerror = reject;
    img.src = url;
  });
}

function _fillExifInfo(tags) {
  const make = tags.Make || '';
  const model = tags.Model || '';
  const lens = tags.LensModel || tags.LensMake || '';
  const camera = [make, model].filter(Boolean).join(' ') || '-';
  _setInfoText('edit_info_camera', lens ? `${camera} / ${lens}` : camera);

  const iso = tags.ISOSpeedRatings ? `ISO ${tags.ISOSpeedRatings}` : '';
  const exposure = tags.ExposureTime ? `快门 ${tags.ExposureTime}s` : '';
  const fnum = tags.FNumber ? `光圈 f/${tags.FNumber}` : '';
  const focal = tags.FocalLength ? `焦距 ${tags.FocalLength}mm` : '';
  const exposureInfo = [iso, exposure, fnum, focal].filter(Boolean).join(' · ') || '-';
  _setInfoText('edit_info_exposure', exposureInfo);

  const dt = tags.DateTimeOriginal || tags.CreateDate || '-';
  const sw = tags.Software || '-';
  _setInfoText('edit_info_datetime', `${dt} / ${sw}`);

  const lat = _exifGpsToDecimal(tags.GPSLatitude, tags.GPSLatitudeRef);
  const lng = _exifGpsToDecimal(tags.GPSLongitude, tags.GPSLongitudeRef);
  const alt = tags.GPSAltitude;
  if (typeof lat === 'number' && typeof lng === 'number') {
    const pos = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    const altText = alt ? ` · 海拔 ${alt}m` : '';
    _setInfoText('edit_info_gps', pos + altText);
  } else {
    _setInfoText('edit_info_gps', '-');
  }

  _setInfoText('edit_info_orientation', tags.Orientation ? String(tags.Orientation) : '-');
}

function _updateEditInfoDisplayOnly() {
  if (!infoOriginalImage) return;
  const displayW = Math.round(infoPreview?.offsetWidth || 0);
  const displayH = Math.round(infoPreview?.offsetHeight || 0);
  _setInfoText('edit_info_rotate', `${infoRotateDeg}deg`);
  _setInfoText('edit_info_display', displayW && displayH ? `${displayW} × ${displayH}` : '-');
}

async function _updateEditInfoAll() {
  if (!infoOriginalImage || !infoOriginalFile) {
    _showEditInfo(false);
    return;
  }
  _showEditInfo(true);

  const name = infoOriginalFile.name || '-';
  const ext = (name.includes('.') ? name.split('.').pop() : '').toUpperCase() || '-';
  const type = infoOriginalFile.type || '-';
  const path = infoOriginalFile.webkitRelativePath || '浏览器安全限制，无法读取本机绝对路径';
  const w = infoOriginalImage.naturalWidth || 0;
  const h = infoOriginalImage.naturalHeight || 0;
  const pixels = w * h;
  const mp = pixels ? (pixels / 1e6).toFixed(2) + ' MP' : '-';

  _setInfoText('edit_info_name', name);
  _setInfoText('edit_info_path', path);
  _setInfoText('edit_info_ext', ext);
  _setInfoText('edit_info_type', type);
  _setInfoText('edit_info_size', _formatBytes(infoOriginalFile.size));
  _setInfoText('edit_info_last_modified', _formatDateTime(infoOriginalFile.lastModified));
  _setInfoText('edit_info_dim', `${w} × ${h}`);
  _setInfoText('edit_info_ratio', _ratioString(w, h));
  _setInfoText('edit_info_pixels', pixels ? pixels.toLocaleString('zh-CN') : '-');
  _setInfoText('edit_info_megapixel', mp);
  _updateEditInfoDisplayOnly();

  if (!infoExifTags) infoExifTags = await _readExifTags(infoOriginalFile);
  _fillExifInfo(infoExifTags || {});

  const alpha = (type.includes('png') || type.includes('webp')) ? '可能支持透明' : '通常不支持';
  _setInfoText('edit_info_alpha', alpha);

  _setInfoText('edit_info_hash', '计算中...');
  const hash = await _hashFileSha256(infoOriginalFile);
  _setInfoText('edit_info_hash', hash);
}

function _resetEditInfo() {
  infoExifTags = null;
  infoRotateDeg = 0;
  _showEditInfo(false);
  [
    'edit_info_name', 'edit_info_path', 'edit_info_ext', 'edit_info_type', 'edit_info_size',
    'edit_info_last_modified', 'edit_info_dim', 'edit_info_ratio', 'edit_info_pixels',
    'edit_info_megapixel', 'edit_info_orientation', 'edit_info_rotate', 'edit_info_display',
    'edit_info_alpha', 'edit_info_camera', 'edit_info_exposure', 'edit_info_datetime',
    'edit_info_gps', 'edit_info_hash'
  ].forEach((id) => _setInfoText(id, '-'));
  _setInfoText('edit_info_rotate', '0deg');
  if (infoOriginalUrl) {
    URL.revokeObjectURL(infoOriginalUrl);
    infoOriginalUrl = null;
  }
  infoOriginalFile = null;
  infoOriginalImage = null;
  if (infoPreviewWrap) infoPreviewWrap.classList.add('hidden');
  if (infoPreviewWrap) {
    infoPreviewWrap.style.width = '';
    infoPreviewWrap.style.height = '';
  }
  if (infoPreview) infoPreview.src = '';
  if (infoUploadPrompt) infoUploadPrompt.classList.remove('hidden');
  if (btnInfoDelete) btnInfoDelete.classList.add('hidden');
  if (infoSideControls) {
    infoSideControls.classList.add('hidden');
    infoSideControls.style.top = '';
  }
  if (uploadInfoArea) uploadInfoArea.classList.remove('has-image');
  if (fileInfo) fileInfo.value = '';
}

function _getInfoExportOptions(maskSensitive = false) {
  const read = (id, fallback) => {
    const el = document.getElementById(id);
    return el ? !!el.checked : fallback;
  };
  const opts = {
    includePath: read('info_opt_path', false),
    includeGps: read('info_opt_gps', false),
    includeExif: read('info_opt_exif', true),
    includeHash: read('info_opt_hash', true),
  };
  if (maskSensitive) {
    opts.includePath = false;
    opts.includeGps = false;
    opts.includeHash = false;
  }
  return opts;
}

function _buildEditInfoPayload(maskSensitive = false) {
  if (!infoOriginalImage || !infoOriginalFile) return null;
  const opts = _getInfoExportOptions(maskSensitive);
  const fileName = infoOriginalFile.name || '-';
  const extension = (fileName.includes('.') ? fileName.split('.').pop() : '').toUpperCase() || '-';
  const mimeType = infoOriginalFile.type || '-';
  const width = infoOriginalImage.naturalWidth || 0;
  const height = infoOriginalImage.naturalHeight || 0;
  const totalPixels = width * height;
  const payload = {
    file: {
      name: fileName,
      extension,
      mimeType,
      sizeBytes: infoOriginalFile.size,
      sizeHuman: _formatBytes(infoOriginalFile.size),
      browserPath: opts.includePath ? (infoOriginalFile.webkitRelativePath || '') : '',
      lastModified: _formatDateTime(infoOriginalFile.lastModified),
      sha256: opts.includeHash ? (document.getElementById('edit_info_hash')?.textContent || '-') : '-',
    },
    image: {
      width,
      height,
      ratio: _ratioString(width, height),
      totalPixels,
      megaPixels: totalPixels ? Number((totalPixels / 1e6).toFixed(2)) : 0,
      displayWidth: Math.round(infoPreview?.offsetWidth || 0),
      displayHeight: Math.round(infoPreview?.offsetHeight || 0),
      rotationDeg: infoRotateDeg,
      zoom: 1,
    },
    exif: opts.includeExif
      ? (maskSensitive
        ? {
            Orientation: infoExifTags?.Orientation || null,
            PixelXDimension: infoExifTags?.PixelXDimension || null,
            PixelYDimension: infoExifTags?.PixelYDimension || null,
          }
        : (infoExifTags || {}))
      : {},
    gps: {
      text: opts.includeGps ? (document.getElementById('edit_info_gps')?.textContent || '-') : '-',
    },
    exportedAt: new Date().toISOString(),
    privacy: {
      masked: maskSensitive,
      note: maskSensitive ? '已按脱敏规则过滤敏感信息' : '包含按勾选字段导出的信息',
      options: opts,
    },
  };
  return payload;
}

function _buildEditInfoSummaryText() {
  const payload = _buildEditInfoPayload(true);
  if (!payload) return '';
  const opts = payload.privacy?.options || {};
  const lines = [
    '图片信息摘要',
    `文件名: ${payload.file.name}`,
    `扩展名: ${payload.file.extension}`,
    `MIME: ${payload.file.mimeType}`,
    `大小: ${payload.file.sizeHuman}`,
    `最后修改: ${payload.file.lastModified}`,
    `像素尺寸: ${payload.image.width} x ${payload.image.height}`,
    `纵横比: ${payload.image.ratio}`,
    `百万像素: ${payload.image.megaPixels}`,
    `总像素: ${payload.image.totalPixels}`,
    `当前旋转: ${payload.image.rotationDeg}deg`,
    `显示尺寸: ${payload.image.displayWidth} x ${payload.image.displayHeight}`,
    `导出选项: 路径=${opts.includePath ? '是' : '否'} GPS=${opts.includeGps ? '是' : '否'} EXIF=${opts.includeExif ? '是' : '否'} 哈希=${opts.includeHash ? '是' : '否'}`,
    `生成时间: ${new Date(payload.exportedAt).toLocaleString('zh-CN')}`,
  ];
  return lines.join('\n');
}

async function _copyEditInfoToClipboard() {
  const payload = _buildEditInfoPayload();
  if (!payload) {
    showToast('请先上传图片', 'info');
    return;
  }
  const text = JSON.stringify(payload, null, 2);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showToast('图片信息已复制到剪贴板', 'success');
  } catch (_) {
    showToast('复制失败，请重试', 'error');
  }
}

function _exportEditInfoAsJson() {
  const payload = _buildEditInfoPayload(false);
  if (!payload) {
    showToast('请先上传图片', 'info');
    return;
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const raw = (infoOriginalFile.name || 'image').replace(/\.[^.]+$/, '');
  const safe = raw.replace(/[^a-zA-Z0-9-_\u4e00-\u9fa5]/g, '_');
  a.download = safe + '_info.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function _exportEditInfoAsMaskedJson() {
  const payload = _buildEditInfoPayload(true);
  if (!payload) {
    showToast('请先上传图片', 'info');
    return;
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const raw = (infoOriginalFile.name || 'image').replace(/\.[^.]+$/, '');
  const safe = raw.replace(/[^a-zA-Z0-9-_\u4e00-\u9fa5]/g, '_');
  a.download = safe + '_info_masked.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function _copyEditInfoSummaryToClipboard() {
  const text = _buildEditInfoSummaryText();
  if (!text) {
    showToast('请先上传图片', 'info');
    return;
  }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    showToast('图片摘要已复制到剪贴板', 'success');
  } catch (_) {
    showToast('复制失败，请重试', 'error');
  }
}

const btnInfoCopy = document.getElementById('btn_info_copy');
const btnInfoCopySummary = document.getElementById('btn_info_copy_summary');
const btnInfoExport = document.getElementById('btn_info_export');
const btnInfoExportMasked = document.getElementById('btn_info_export_masked');
const infoExportFieldGroup = document.getElementById('info_export_field_group');

function _setInfoActionContext(mode) {
  const full = mode === 'full';
  if (infoExportFieldGroup) infoExportFieldGroup.classList.toggle('hidden', !full);
}

_setInfoActionContext('full');

if (btnInfoCopy) {
  btnInfoCopy.onclick = async () => {
    _setInfoActionContext('full');
    await _copyEditInfoToClipboard();
  };
}
if (btnInfoExport) {
  btnInfoExport.onclick = () => {
    _setInfoActionContext('full');
    _exportEditInfoAsJson();
  };
}
if (btnInfoCopySummary) {
  btnInfoCopySummary.onclick = async () => {
    _setInfoActionContext('safe');
    await _copyEditInfoSummaryToClipboard();
  };
}
if (btnInfoExportMasked) {
  btnInfoExportMasked.onclick = () => {
    _setInfoActionContext('safe');
    _exportEditInfoAsMaskedJson();
  };
}

function _initInfoUploadBindings() {
  const uploadArea = document.getElementById('upload_info_area');
  const fileInput = document.getElementById('file_info');
  
  if (!uploadArea || !fileInput) {
    console.warn('Info upload area elements not found, retrying...');
    setTimeout(_initInfoUploadBindings, 100);
    return;
  }

  uploadArea.onclick = (e) => {
    if (e.target.closest('#btn_info_delete')) return;
    if (uploadArea.classList.contains('has-image')) return;
    fileInput.click();
  };
  
  uploadArea.addEventListener('dragover', (e) => {
    if (uploadArea.classList.contains('has-image')) return;
    e.preventDefault();
    uploadArea.classList.add('border-primary', 'bg-primary/5');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    if (uploadArea.classList.contains('has-image')) return;
    uploadArea.classList.remove('border-primary', 'bg-primary/5');
  });
  
  uploadArea.addEventListener('drop', async (e) => {
    if (uploadArea.classList.contains('has-image')) return;
    e.preventDefault();
    uploadArea.classList.remove('border-primary', 'bg-primary/5');
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    fileInput.files = dt.files;
    fileInput.dispatchEvent(new Event('change'));
  });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    if (infoOriginalUrl) URL.revokeObjectURL(infoOriginalUrl);
    try {
      const loaded = await _loadInfoImage(file);
      infoOriginalUrl = loaded.url;
      infoOriginalFile = file;
      infoOriginalImage = loaded.img;
      infoExifTags = null;
      infoRotateDeg = 0;
      const preview = document.getElementById('info_preview');
      const previewWrap = document.getElementById('info_preview_wrap');
      const uploadPrompt = document.getElementById('info_upload_prompt');
      const sideControls = document.getElementById('info_side_controls');
      const deleteBtn = document.getElementById('btn_info_delete');
      
      if (preview) preview.src = infoOriginalUrl;
      if (previewWrap) previewWrap.classList.remove('hidden');
      if (uploadPrompt) uploadPrompt.classList.add('hidden');
      if (sideControls) sideControls.classList.remove('hidden');
      if (deleteBtn) deleteBtn.classList.remove('hidden');
      uploadArea.classList.add('has-image');
      _renderInfoPreviewImage();
      _updateEditInfoAll();
    } catch (error) {
      console.error('Info image loading error:', error);
      showToast('图片信息模块加载失败，请重试', 'error');
    }
  });
}

// 在 DOMContentLoaded 后立即初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initInfoUploadBindings);
} else {
  _initInfoUploadBindings();
}

window.addEventListener('resize', () => {
  if (!infoOriginalImage) return;
  _renderInfoPreviewImage();
  _updateEditInfoDisplayOnly();
});

if (btnInfoDelete) {
  btnInfoDelete.onclick = (e) => {
    e.stopPropagation();
    _resetEditInfo();
  };
}

_resetEditInfo();

// 图片编辑
let editOriginalUrl = null;
let editOriginalImage = null;
let editOriginalFile = null;
let editRotateDeg = 0;
let cropMode = false;
let cropRect = null;
let cropDragging = false;
let cropDragType = null;
let cropShape = 'rect';  // 裁剪图形类型: rect, circle, star, heart, pentagon
let cropAspectRatio = null;
let editHistory = [];
let editHistoryIndex = -1;
let editHistoryRestoring = false;

// ---- 缩放/平移状态 ----
// ---- 裁剪视图缩放 ----
let cropViewZoom = 1;
let editBaseDisplayW = 0;
let editBaseDisplayH = 0;
let editPanX = 0;
let editPanY = 0;
let editDragging = false;
let editDragStartX = 0;
let editDragStartY = 0;
let editDragBasePanX = 0;
let editDragBasePanY = 0;
let editDragEnabled = false;

function _parseAspectRatio(value) {
  if (!value || value === 'free') return null;
  const parts = value.split(':').map(Number);
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return { w: parts[0], h: parts[1] };
}

function _applyAspectToPoint(sx, sy, x, y) {
  if (!cropAspectRatio) return { x, y };
  const ratio = cropAspectRatio.w / cropAspectRatio.h;
  const dx = x - sx;
  const dy = y - sy;
  const signX = dx >= 0 ? 1 : -1;
  const signY = dy >= 0 ? 1 : -1;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);
  if (!absDx && !absDy) return { x, y };
  let w = absDx;
  let h = absDy;
  if (!h || w / h > ratio) {
    h = Math.max(1, Math.round(w / ratio));
  } else {
    w = Math.max(1, Math.round(h * ratio));
  }
  return {
    x: sx + signX * w,
    y: sy + signY * h,
  };
}

function _updateCropRatioHint() {
  if (!cropRatioHint) return;
  if (cropShape !== 'rect') {
    cropRatioHint.textContent = '当前：按图形自由';
    return;
  }
  const currentValue = cropAspectSelect ? cropAspectSelect.value : 'free';
  const meta = _getCropAspectMeta(currentValue);
  cropRatioHint.textContent = '当前：' + meta.hint;
}

function _getCropAspectMeta(value) {
  const map = {
    'free': { text: '自由比例', iconClass: 'is-free', hint: '自由比例（任意图形）' },
    '1:1': { text: '1:1 正方形', iconClass: 'is-11', hint: '1:1（正方形）' },
    '4:3': { text: '4:3 横向', iconClass: 'is-43', hint: '4:3（横向矩形）' },
    '3:4': { text: '3:4 竖向', iconClass: 'is-34', hint: '3:4（竖向矩形）' },
    '16:9': { text: '16:9 宽屏', iconClass: 'is-169', hint: '16:9（宽屏横向）' },
    '9:16': { text: '9:16 竖屏', iconClass: 'is-916', hint: '9:16（竖屏纵向）' },
  };
  return map[value] || map.free;
}

function _syncCropAspectUI() {
  const isRectShape = cropShape === 'rect';
  if (cropRatioGroup) {
    cropRatioGroup.classList.toggle('hidden', !isRectShape);
  }
  cropAspectRatio = isRectShape ? _parseAspectRatio(cropAspectSelect ? cropAspectSelect.value : 'free') : null;
  _updateCropRatioHint();
}

function _updateEditHistoryButtons() {
  if (btnEditUndo) btnEditUndo.disabled = editHistoryIndex <= 0;
  if (btnEditRedo) btnEditRedo.disabled = editHistoryIndex < 0 || editHistoryIndex >= editHistory.length - 1;
}

function _captureEditImageDataUrl() {
  if (!editOriginalImage) return null;
  const canvas = document.createElement('canvas');
  canvas.width = editOriginalImage.naturalWidth;
  canvas.height = editOriginalImage.naturalHeight;
  const c = canvas.getContext('2d');
  c.drawImage(editOriginalImage, 0, 0);
  return canvas.toDataURL('image/png');
}

function _resetEditHistory() {
  editHistory = [];
  editHistoryIndex = -1;
  _updateEditHistoryButtons();
}

async function _pushEditHistory() {
  if (editHistoryRestoring || !editOriginalImage) return;
  const state = {
    imageDataUrl: _captureEditImageDataUrl(),
    rotateDeg: editRotateDeg,
  };
  if (!state.imageDataUrl) return;
  if (editHistoryIndex < editHistory.length - 1) {
    editHistory = editHistory.slice(0, editHistoryIndex + 1);
  }
  editHistory.push(state);
  if (editHistory.length > 40) {
    editHistory.shift();
  }
  editHistoryIndex = editHistory.length - 1;
  _updateEditHistoryButtons();
}

function _restoreEditHistoryState(state) {
  return new Promise((resolve) => {
    if (!state || !state.imageDataUrl) {
      resolve(false);
      return;
    }
    const img = new Image();
    img.onload = () => {
      editHistoryRestoring = true;
      editOriginalImage = img;
      editRotateDeg = state.rotateDeg || 0;
      renderEditCanvas();
      editHistoryRestoring = false;
      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = state.imageDataUrl;
  });
}

function _updateEditDragButton() {
  const dragBtn = document.getElementById('btn_edit_drag_toggle');
  if (!dragBtn) return;
  const canUseDrag = Boolean(editOriginalImage && !cropMode && cropViewZoom > 1 && _isEditOverflow());
  if (!canUseDrag) {
    editDragEnabled = false;
    editDragging = false;
  }
  dragBtn.disabled = !canUseDrag;
  dragBtn.classList.toggle('opacity-50', !canUseDrag);
  dragBtn.classList.toggle('cursor-not-allowed', !canUseDrag);
  dragBtn.classList.toggle('border-primary', editDragEnabled);
  dragBtn.classList.toggle('text-primary', editDragEnabled);
  dragBtn.classList.toggle('bg-primary/10', editDragEnabled);
  dragBtn.title = !canUseDrag ? '请先放大图片后再启用拖动' : (editDragEnabled ? '关闭拖动' : '启用拖动（空格）');
}

function _toggleEditDragMode() {
  const canUseDrag = Boolean(editOriginalImage && !cropMode && cropViewZoom > 1 && _isEditOverflow());
  if (!canUseDrag) {
    editDragEnabled = false;
    editDragging = false;
    _updateEditDragButton();
    _syncEditStageTransform();
    return;
  }
  editDragEnabled = !editDragEnabled;
  if (!editDragEnabled) {
    editDragging = false;
  }
  _updateEditDragButton();
  _syncEditStageTransform();
}

function _syncCropAspectPickerUI() {
  if (!cropAspectSelect || !cropAspectTriggerText || !cropAspectMenu) return;
  const selectedValue = cropAspectSelect.value || 'free';
  const selectedOption = cropAspectMenu.querySelector(`.crop-aspect-option[data-value="${selectedValue}"]`);
  const meta = _getCropAspectMeta(selectedValue);
  cropAspectTriggerText.textContent = meta.text;
  if (cropAspectTriggerIcon) {
    cropAspectTriggerIcon.className = `crop-aspect-icon ${meta.iconClass}`;
  }
  cropAspectMenu.querySelectorAll('.crop-aspect-option').forEach(btn => {
    const isActive = btn.getAttribute('data-value') === selectedValue;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
}

function _setCropAspectMenuOpen(open) {
  if (!cropAspectMenu || !cropAspectTrigger) return;
  cropAspectMenu.classList.toggle('hidden', !open);
  cropAspectTrigger.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function _getCropAspectOptions() {
  return cropAspectMenu ? Array.from(cropAspectMenu.querySelectorAll('.crop-aspect-option')) : [];
}

function _focusCropAspectByOffset(offset) {
  if (!cropAspectSelect || !cropAspectMenu) return;
  const options = _getCropAspectOptions();
  if (!options.length) return;
  const currentIndex = options.findIndex(btn => btn.getAttribute('data-value') === cropAspectSelect.value);
  const baseIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextIndex = (baseIndex + offset + options.length) % options.length;
  const next = options[nextIndex];
  if (!next) return;
  const nextValue = next.getAttribute('data-value') || 'free';
  if (cropAspectSelect.value !== nextValue) {
    cropAspectSelect.value = nextValue;
    cropAspectSelect.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    _syncCropAspectPickerUI();
  }
  next.scrollIntoView({ block: 'nearest' });
}

function _initCropAspectPicker() {
  if (!cropAspectSelect || !cropAspectTrigger || !cropAspectMenu) return;
  _syncCropAspectPickerUI();

  cropAspectTrigger.addEventListener('click', () => {
    const willOpen = cropAspectMenu.classList.contains('hidden');
    _setCropAspectMenuOpen(willOpen);
  });

  cropAspectTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      _setCropAspectMenuOpen(true);
      _focusCropAspectByOffset(e.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if ((e.key === 'Enter' || e.key === ' ') && cropAspectMenu.classList.contains('hidden')) {
      e.preventDefault();
      _setCropAspectMenuOpen(true);
      return;
    }
    if (e.key === 'Escape' && !cropAspectMenu.classList.contains('hidden')) {
      e.preventDefault();
      _setCropAspectMenuOpen(false);
    }
  });

  cropAspectMenu.querySelectorAll('.crop-aspect-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.getAttribute('data-value') || 'free';
      if (cropAspectSelect.value !== value) {
        cropAspectSelect.value = value;
        cropAspectSelect.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        _syncCropAspectPickerUI();
      }
      _setCropAspectMenuOpen(false);
    });
  });

  cropAspectMenu.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      _focusCropAspectByOffset(e.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      _setCropAspectMenuOpen(false);
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      _setCropAspectMenuOpen(false);
    }
  });

  document.addEventListener('click', (e) => {
    if (cropAspectMenu.classList.contains('hidden')) return;
    if (cropAspectTrigger.contains(e.target) || cropAspectMenu.contains(e.target)) return;
    _setCropAspectMenuOpen(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !cropAspectMenu.classList.contains('hidden')) {
      _setCropAspectMenuOpen(false);
    }
  });
}

if (cropAspectSelect) {
  _initCropAspectPicker();
  cropAspectSelect.addEventListener('change', () => {
    _syncCropAspectPickerUI();
    if (cropShape !== 'rect') {
      cropAspectRatio = null;
      _updateCropRatioHint();
      return;
    }
    cropAspectRatio = _parseAspectRatio(cropAspectSelect.value);
    _updateCropRatioHint();
    if (cropRect && cropAspectRatio) {
      const fixed = _applyAspectToPoint(cropRect.sx, cropRect.sy, cropRect.ex, cropRect.ey);
      cropRect.ex = fixed.x;
      cropRect.ey = fixed.y;
      drawCropOverlay();
    }
  });
}

function _syncEditSideControlsPosition() {
  const wrap = document.getElementById('edit_preview_wrap');
  const controls = document.getElementById('edit_side_controls');
  if (!wrap || !controls || wrap.classList.contains('hidden')) return;
  controls.style.top = wrap.offsetTop + 'px';
}

function _getEditViewportSize() {
  const wrap = document.getElementById('edit_preview_wrap');
  return {
    w: wrap ? wrap.clientWidth : 0,
    h: wrap ? wrap.clientHeight : 0,
  };
}

function _isEditOverflow() {
  const canvas = document.getElementById('edit_preview');
  const { w, h } = _getEditViewportSize();
  if (!canvas || !w || !h) return false;
  return canvas.offsetWidth > w || canvas.offsetHeight > h;
}

function _clampEditPan() {
  const canvas = document.getElementById('edit_preview');
  const { w, h } = _getEditViewportSize();
  if (!canvas || !w || !h) {
    editPanX = 0;
    editPanY = 0;
    return;
  }
  const maxX = Math.max(0, (canvas.offsetWidth - w) / 2);
  const maxY = Math.max(0, (canvas.offsetHeight - h) / 2);
  editPanX = Math.max(-maxX, Math.min(maxX, editPanX));
  editPanY = Math.max(-maxY, Math.min(maxY, editPanY));
}

function _syncEditStageTransform() {
  const stage = document.getElementById('edit_canvas_stage');
  const wrap = document.getElementById('edit_preview_wrap');
  if (!stage || !wrap) return;
  _clampEditPan();
  if (!(editOriginalImage && !cropMode && cropViewZoom > 1 && _isEditOverflow())) {
    editDragEnabled = false;
    editDragging = false;
  }
  stage.style.transform = `translate(${editPanX}px, ${editPanY}px)`;
  wrap.style.cursor = _isEditOverflow() && !cropMode && editDragEnabled ? (editDragging ? 'grabbing' : 'grab') : 'default';
}

function _applyCropZoom() {
  if (!editOriginalImage) return;
  const canvas = document.getElementById('edit_preview');
  const cw = canvas.width;
  const ch = canvas.height;
  const container = document.getElementById('upload_edit_area');
  const containerW = container ? Math.max(container.offsetWidth - 56, 160) : 360;
  const maxH = Math.min(Math.round(containerW * 0.55), 360);
  const base = Math.min(1, maxH / ch, containerW / cw);
  const baseW = editBaseDisplayW || Math.max(50, Math.round(cw * base));
  const baseH = editBaseDisplayH || Math.max(50, Math.round(ch * base));
  const dw = Math.max(50, Math.round(baseW * cropViewZoom));
  const dh = Math.max(50, Math.round(baseH * cropViewZoom));
  canvas.style.width = dw + 'px';
  canvas.style.height = dh + 'px';
  _syncEditStageTransform();
}

function renderEditCanvas() {
  if (!editOriginalImage) return;
  const canvas = document.getElementById('edit_preview');
  const deg = editRotateDeg;
  const rad = deg * Math.PI / 180;
  const sw = editOriginalImage.naturalWidth;
  const sh = editOriginalImage.naturalHeight;
  const cw = (deg === 90 || deg === 270) ? sh : sw;
  const ch = (deg === 90 || deg === 270) ? sw : sh;
  canvas.width = cw;
  canvas.height = ch;
  const cctx = canvas.getContext('2d');
  cctx.clearRect(0, 0, cw, ch);
  cctx.save();
  cctx.translate(cw / 2, ch / 2);
  cctx.rotate(rad);
  cctx.drawImage(editOriginalImage, -sw / 2, -sh / 2);
  cctx.restore();
  const container = document.getElementById('upload_edit_area');
  const maxW = container ? Math.max(container.offsetWidth - 16, 200) : 400;
  const maxH = Math.min(Math.round(maxW * 0.55), 360);
  const scale = Math.min(1, maxH / ch, maxW / cw);
  editBaseDisplayW = Math.round(cw * scale);
  editBaseDisplayH = Math.round(ch * scale);
  const wrap = document.getElementById('edit_preview_wrap');
  wrap.style.width = editBaseDisplayW + 'px';
  wrap.style.height = editBaseDisplayH + 'px';
  canvas.style.width = editBaseDisplayW + 'px';
  canvas.style.height = editBaseDisplayH + 'px';
  
  // 如果在裁剪模式，同步 crop_overlay 尺寸
  if (cropMode) {
    const cropOverlay = document.getElementById('crop_overlay');
    cropOverlay.width = cw;
    cropOverlay.height = ch;
    const displayWidth = editBaseDisplayW;
    const displayHeight = editBaseDisplayH;
    if (!isNaN(displayWidth) && !isNaN(displayHeight)) {
      cropOverlay.style.width = displayWidth + 'px';
      cropOverlay.style.height = displayHeight + 'px';
      drawCropOverlay();
    }
  }

  if (cropViewZoom !== 1) {
    _applyCropZoom();
  } else {
    _syncEditStageTransform();
  }
  _updateEditDragButton();
  _syncEditSideControlsPosition();
}

function _initEditUploadBindings() {
  const uploadArea = document.getElementById('upload_edit_area');
  const fileInput = document.getElementById('file_edit');
  
  if (!uploadArea || !fileInput) {
    console.warn('Edit upload area elements not found, retrying...');
    setTimeout(_initEditUploadBindings, 100);
    return;
  }

  uploadArea.onclick = (e) => {
    if (e.target.closest('#btn_edit_delete')) return;
    const wrap = document.getElementById('edit_preview_wrap');
    if (!wrap.classList.contains('hidden')) return;
    fileInput.click();
  };
  
  uploadArea.addEventListener('dragover', (e) => {
    if (uploadArea.classList.contains('has-image')) return;
    e.preventDefault();
    uploadArea.classList.add('border-primary', 'bg-primary/5');
  });
  
  uploadArea.addEventListener('dragleave', () => {
    if (uploadArea.classList.contains('has-image')) return;
    uploadArea.classList.remove('border-primary', 'bg-primary/5');
  });
  
  uploadArea.addEventListener('drop', (e) => {
    if (uploadArea.classList.contains('has-image')) return;
    e.preventDefault();
    uploadArea.classList.remove('border-primary', 'bg-primary/5');
    const wrap = document.getElementById('edit_preview_wrap');
    if (!wrap.classList.contains('hidden')) return;
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInput.files = dt.files;
      loadEditPreview(file);
    }
  });

  // 绑定 file input change 事件
  fileInput.onchange = e => loadEditPreview(e.target.files[0]);
}

// 在 DOMContentLoaded 后立即初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initEditUploadBindings);
} else {
  _initEditUploadBindings();
}

const editPreviewWrap = document.getElementById('edit_preview_wrap');
editPreviewWrap.addEventListener('mousedown', (e) => {
  if (!editOriginalImage || cropMode || !editDragEnabled || !_isEditOverflow()) return;
  if (e.target.closest('#btn_edit_delete,#btn_edit_rotate_cw,#btn_edit_rotate_ccw,#btn_zoom_in,#btn_zoom_out,#btn_zoom_reset,#btn_edit_drag_toggle')) return;
  editDragging = true;
  editDragStartX = e.clientX;
  editDragStartY = e.clientY;
  editDragBasePanX = editPanX;
  editDragBasePanY = editPanY;
  _syncEditStageTransform();
  e.preventDefault();
});

window.addEventListener('mousemove', (e) => {
  if (!editDragging) return;
  editPanX = editDragBasePanX + (e.clientX - editDragStartX);
  editPanY = editDragBasePanY + (e.clientY - editDragStartY);
  _syncEditStageTransform();
});

window.addEventListener('mouseup', () => {
  if (!editDragging) return;
  editDragging = false;
  _syncEditStageTransform();
});

document.getElementById('btn_edit_drag_toggle').onclick = function() {
  _toggleEditDragMode();
  this.blur();
};

document.addEventListener('keydown', (e) => {
  if (e.code !== 'Space' || e.repeat) return;
  const target = e.target;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)) {
    return;
  }
  if (!editOriginalImage || cropMode || cropViewZoom <= 1) return;
  e.preventDefault();
  _toggleEditDragMode();
});

window.addEventListener('resize', _syncEditSideControlsPosition);

// ---- 预览区拖动平移 ----
function loadEditPreview(file) {
  if (!file) return;
  if (editOriginalUrl) URL.revokeObjectURL(editOriginalUrl);
  editOriginalUrl = URL.createObjectURL(file);
  editOriginalFile = file;
  editRotateDeg = 0;
  _closeCompressPanel(true);
  if (cropMode) exitCropMode();
  editOriginalImage = new Image();
  editOriginalImage.onload = () => {
    cropViewZoom = 1;
    editPanX = 0;
    editPanY = 0;
    editDragging = false;
    editDragEnabled = false;
    uploadEditArea.classList.add('has-image');
    document.getElementById('edit_upload_prompt').classList.add('hidden');
    document.getElementById('edit_preview_wrap').classList.remove('hidden');
    document.getElementById('edit_side_controls').classList.remove('hidden');
    document.getElementById('crop_zoom_btns').classList.remove('hidden');
    _updateEditDragButton();
    renderEditCanvas();
    _resetEditHistory();
    _pushEditHistory();
  };
  editOriginalImage.src = editOriginalUrl;
}

document.getElementById('btn_edit_delete').onclick = (e) => {
  e.stopPropagation();
  if (editOriginalUrl) { URL.revokeObjectURL(editOriginalUrl); editOriginalUrl = null; }
  editOriginalImage = null;
  editOriginalFile = null;
  editRotateDeg = 0;
  _closeCompressPanel(true);
  if (cropMode) exitCropMode();
  const editCanvas = document.getElementById('edit_preview');
  const cctx = editCanvas.getContext('2d');
  cctx.clearRect(0, 0, editCanvas.width, editCanvas.height);
  editCanvas.style.width = '';
  editCanvas.style.height = '';
  editBaseDisplayW = 0;
  editBaseDisplayH = 0;
  cropViewZoom = 1;
  editPanX = 0;
  editPanY = 0;
  editDragging = false;
  editDragEnabled = false;
  _updateEditDragButton();
  const stage = document.getElementById('edit_canvas_stage');
  if (stage) stage.style.transform = 'translate(0px, 0px)';
  const wrap = document.getElementById('edit_preview_wrap');
  if (wrap) {
    wrap.style.width = '';
    wrap.style.height = '';
    wrap.style.cursor = 'default';
  }
  uploadEditArea.classList.remove('has-image');
  document.getElementById('edit_side_controls').classList.add('hidden');
  document.getElementById('crop_zoom_btns').classList.add('hidden');
  document.getElementById('file_edit').value = '';
  document.getElementById('edit_preview_wrap').classList.add('hidden');
  document.getElementById('edit_upload_prompt').classList.remove('hidden');
  _resetEditHistory();
}
updateFaceControlTexts()
uploadFaceSourceArea.onclick = () => fileFaceSource.click()
uploadFaceTargetArea.onclick = () => fileFaceTarget.click()
fileFaceSource.addEventListener('change', () => {
  loadFaceSource().catch(() => setFaceStatus('源脸加载失败，请更换图片重试。', true))
})
fileFaceTarget.addEventListener('change', () => {
  loadFaceTarget().catch(() => setFaceStatus('目标图加载失败，请更换图片重试。', true))
})
faceScale.addEventListener('input', () => {
  updateFaceControlTexts()
  if (!targetFaceImage) return
  facePlacement.size = getDefaultFacePlacement().size
  drawFaceCanvasPreview()
})
faceBlend.addEventListener('input', () => {
  updateFaceControlTexts()
  drawFaceCanvasPreview()
})
faceFeather.addEventListener('input', () => {
  updateFaceControlTexts()
  drawFaceCanvasPreview()
})
btnFaceReset.onclick = () => {
  facePlacement = getDefaultFacePlacement()
  drawFaceCanvasPreview()
  faceOutputUrl = null
  btnFaceDown.classList.add('hidden')
  setFaceStatus('位置已重置，可继续拖拽微调。')
}
btnFaceGo.onclick = () => {
  if (!sourceFaceImage || !targetFaceImage) {
    setFaceStatus('请先上传源脸和目标图。', true)
    return
  }
  if (!faceConsent.checked) {
    setFaceStatus('开始换脸前，请先确认已获得图像授权。', true)
    return
  }
  facePlacement = facePlacement.size ? facePlacement : getDefaultFacePlacement()
  drawFaceCanvasPreview()
  exportFaceResult()
  setFaceStatus('换脸预览已生成。可拖拽位置、调节参数后继续下载。')
}
btnFaceDown.onclick = () => {
  exportFaceResult()
  const a = document.createElement('a')
  a.href = faceOutputUrl
  a.download = 'AI换脸结果.png'
  a.click()
}
faceCanvas.addEventListener('mousedown', (e) => {
  if (!sourceFaceImage || !targetFaceImage || !facePlacement.size) return
  const point = getFaceCanvasPoint(e)
  const box = getFaceDrawBox()
  if (!box) return
  const { size, left, top } = box
  if (point.x < left || point.x > left + size || point.y < top || point.y > top + size) return
  faceDragging = true
  faceDragOffsetX = point.x - facePlacement.x
  faceDragOffsetY = point.y - facePlacement.y
})
window.addEventListener('mousemove', (e) => {
  if (!faceDragging) return
  const point = getFaceCanvasPoint(e)
  const half = facePlacement.size / 2
  facePlacement.x = clamp(point.x - faceDragOffsetX, half, faceCanvas.width - half)
  facePlacement.y = clamp(point.y - faceDragOffsetY, half, faceCanvas.height - half)
  drawFaceCanvasPreview()
})
window.addEventListener('mouseup', () => {
  if (!faceDragging) return
  faceDragging = false
  exportFaceResult()
})
document.getElementById('btn_edit_rotate_ccw').onclick = () => {
  editRotateDeg = (editRotateDeg - 90 + 360) % 360;
  renderEditCanvas();
  _pushEditHistory();
}
document.getElementById('btn_edit_rotate_cw').onclick = () => {
  editRotateDeg = (editRotateDeg + 90) % 360;
  renderEditCanvas();
  _pushEditHistory();
}

if (btnEditUndo) {
  btnEditUndo.onclick = async () => {
    if (editHistoryIndex <= 0) return;
    editHistoryIndex -= 1;
    const ok = await _restoreEditHistoryState(editHistory[editHistoryIndex]);
    if (!ok) {
      showToast('撤销失败，请重试', 'error');
      editHistoryIndex += 1;
    }
    _updateEditHistoryButtons();
  };
}

if (btnEditRedo) {
  btnEditRedo.onclick = async () => {
    if (editHistoryIndex >= editHistory.length - 1) return;
    editHistoryIndex += 1;
    const ok = await _restoreEditHistoryState(editHistory[editHistoryIndex]);
    if (!ok) {
      showToast('重做失败，请重试', 'error');
      editHistoryIndex -= 1;
    }
    _updateEditHistoryButtons();
  };
}
document.getElementById('btn_zoom_in').onclick = () => {
  if (!editOriginalImage) return;
  cropViewZoom = Math.min(cropViewZoom * 1.3, 4);
  _applyCropZoom();
  _updateEditDragButton();
};
document.getElementById('btn_zoom_out').onclick = () => {
  if (!editOriginalImage) return;
  cropViewZoom = Math.max(cropViewZoom / 1.3, 0.4);
  _applyCropZoom();
  _updateEditDragButton();
};
document.getElementById('btn_zoom_reset').onclick = () => {
  if (!editOriginalImage) return;
  cropViewZoom = 1;
  editPanX = 0;
  editPanY = 0;
  editDragEnabled = false;
  editDragging = false;
  renderEditCanvas();
  _updateEditDragButton();
};
// ---- 压缩面板逻辑 ----
let _compressEstTimer = null;

function _setEditToolHighlight(activeTool) {
  const compressBtn = document.querySelector('.compress');
  const cropBtn = document.querySelector('.crop');
  const applyActive = (btn, on) => {
    if (!btn) return;
    btn.classList.toggle('tool-active', on);
  };
  applyActive(compressBtn, activeTool === 'compress');
  applyActive(cropBtn, activeTool === 'crop');
}

function _resetCompressState() {
  const defaultFmt = document.querySelector('input[name="compress_fmt"][value="image/jpeg"]');
  if (defaultFmt) defaultFmt.checked = true;
  const quality = document.getElementById('compress_quality');
  quality.value = '75';
  document.getElementById('compress_quality_text').textContent = '75%';
  const defaultScale = document.querySelector('input[name="compress_scale"][value="1"]');
  if (defaultScale) defaultScale.checked = true;
  document.getElementById('compress_estimate').textContent = '计算中…';
}

function _closeCompressPanel(reset = true) {
  document.getElementById('compress_panel').classList.add('hidden');
  if (reset) _resetCompressState();
  _setEditToolHighlight(cropMode ? 'crop' : null);
}

function _getCompressParams() {
  const fmt = document.querySelector('input[name="compress_fmt"]:checked').value;
  const quality = Number(document.getElementById('compress_quality').value) / 100;
  const scaleVal = document.querySelector('input[name="compress_scale"]:checked').value;
  return { fmt, quality, scaleVal };
}

function _buildCompressCanvas() {
  if (!editOriginalImage) return null;
  const { scaleVal } = _getCompressParams();
  const sw = editOriginalImage.naturalWidth;
  const sh = editOriginalImage.naturalHeight;
  let tw = sw, th = sh;
  if (scaleVal !== '1') {
    const maxSide = Number(scaleVal);
    const ratio = Math.min(maxSide / sw, maxSide / sh, 1);
    tw = Math.round(sw * ratio);
    th = Math.round(sh * ratio);
  }
  const deg = editRotateDeg;
  const rad = deg * Math.PI / 180;
  const cw = (deg === 90 || deg === 270) ? th : tw;
  const ch = (deg === 90 || deg === 270) ? tw : th;
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const cx = c.getContext('2d');
  cx.save();
  cx.translate(cw / 2, ch / 2);
  cx.rotate(rad);
  cx.drawImage(editOriginalImage, -tw / 2, -th / 2, tw, th);
  cx.restore();
  return c;
}

function _updateCompressEstimate() {
  clearTimeout(_compressEstTimer);
  _compressEstTimer = setTimeout(() => {
    const { fmt, quality } = _getCompressParams();
    const c = _buildCompressCanvas();
    if (!c) return;
    document.getElementById('compress_estimate').textContent = '计算中…';
    const q = fmt === 'image/png' ? undefined : quality;
    c.toBlob(blob => {
      if (!blob) return;
      const origSize = editOriginalFile ? editOriginalFile.size : 0;
      const kb = blob.size / 1024;
      const sizeStr = kb >= 1024 ? (kb / 1024).toFixed(2) + ' MB' : kb.toFixed(1) + ' KB';
      let ratio = '';
      if (origSize > 0) {
        const pct = Math.round((1 - blob.size / origSize) * 100);
        ratio = pct > 0 ? `  ↓ ${pct}%` : (pct < 0 ? `  ↑ ${Math.abs(pct)}%` : '');
      }
      document.getElementById('compress_estimate').textContent = sizeStr + ratio;
    }, fmt, q);
  }, 300);
}

document.querySelector('.compress').onclick = () => {
  if (!editOriginalImage) { showToast('请先上传图片', 'info'); return; }
  // 与裁剪互斥：进入压缩前退出裁剪并重置裁剪状态
  if (cropMode) exitCropMode();
  const panel = document.getElementById('compress_panel');
  if (!panel.classList.contains('hidden')) { _closeCompressPanel(true); return; }
  _resetCompressState();
  const sw = editOriginalImage.naturalWidth;
  const sh = editOriginalImage.naturalHeight;
  const deg = editRotateDeg;
  const dw = (deg === 90 || deg === 270) ? sh : sw;
  const dh = (deg === 90 || deg === 270) ? sw : sh;
  let origSizeStr = '—';
  if (editOriginalFile) {
    const size = editOriginalFile.size;
    origSizeStr = size >= 1024 * 1024 ? (size / 1024 / 1024).toFixed(2) + ' MB' : (size / 1024).toFixed(1) + ' KB';
  }
  const ext = editOriginalFile ? editOriginalFile.type.split('/')[1].toUpperCase() : '';
  document.getElementById('compress_origin_info').textContent = `${dw} × ${dh}  ·  ${origSizeStr}  ·  ${ext}`;
  panel.classList.remove('hidden');
  _setEditToolHighlight('compress');
  _updateCompressEstimate();
};

document.getElementById('compress_cancel').onclick = () => {
  _closeCompressPanel(true);
};

document.getElementById('compress_quality').oninput = () => {
  document.getElementById('compress_quality_text').textContent = document.getElementById('compress_quality').value + '%';
  _updateCompressEstimate();
};

document.querySelectorAll('input[name="compress_fmt"]').forEach(r => r.addEventListener('change', _updateCompressEstimate));
document.querySelectorAll('input[name="compress_scale"]').forEach(r => r.addEventListener('change', _updateCompressEstimate));

document.getElementById('compress_execute').onclick = () => {
  if (!editOriginalImage) return;
  const { fmt, quality } = _getCompressParams();
  const c = _buildCompressCanvas();
  if (!c) return;
  const q = fmt === 'image/png' ? undefined : quality;
  const ext = fmt.split('/')[1];
  c.toBlob(blob => {
    if (!blob) { showToast('压缩失败，请重试', 'error'); return; }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compressed.' + ext;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  }, fmt, q);
};
// ---- 压缩面板逻辑结束 ----

// ---- 裁剪功能 ----
let cropTouchStartX = 0, cropTouchStartY = 0;

function enterCropMode() {
  if (!editOriginalImage) { showToast('请先上传图片', 'info'); return; }
  if (editRotateDeg !== 0) { showToast('请先重置图片再进行裁剪', 'info'); return; }
  // 与压缩互斥：进入裁剪前关闭并重置压缩状态
  _closeCompressPanel(true);
  cropMode = true;
  cropRect = null;
  cropDragging = false;
  cropDragType = null;
  cropShape = 'rect';  // 重置为矩形
  _syncCropAspectUI();
  const editCanvas = document.getElementById('edit_preview');
  const cropOverlay = document.getElementById('crop_overlay');
  
  // 使用 canvas 的实际像素尺寸
  cropOverlay.width = editCanvas.width;
  cropOverlay.height = editCanvas.height;
  
  // CSS 显示尺寸必须与 canvas CSS 一致
  const displayWidth = editCanvas.offsetWidth;
  const displayHeight = editCanvas.offsetHeight;
  cropOverlay.style.width = displayWidth + 'px';
  cropOverlay.style.height = displayHeight + 'px';
  
  cropOverlay.style.display = 'block';
  cropOverlay.classList.remove('hidden');
  document.getElementById('crop_panel').classList.remove('hidden');
  document.getElementById('crop_confirm').disabled = true;
  editDragEnabled = false;
  editDragging = false;
  _updateEditDragButton();
  _setEditToolHighlight('crop');
  updateCropHint();
  
  // 重置图形按钮样式
  document.querySelectorAll('.crop-shape-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-primary', 'text-white', 'border-primary');
    btn.classList.add('border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
  });
  document.querySelector('.crop-shape-btn[data-shape="rect"]').classList.add('active', 'bg-primary', 'text-white', 'border-primary');
  document.querySelector('.crop-shape-btn[data-shape="rect"]').classList.remove('border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
  
  drawCropOverlay();
}

function updateCropHint() {
  const hints = {
    'rect': '在图片上拖拽选择矩形裁剪区域',
    'circle': '在图片上拖拽选择圆形裁剪区域',
    'star': '在图片上拖拽选择五角星裁剪区域',
    'heart': '在图片上拖拽选择心形裁剪区域',
    'pentagon': '在图片上拖拽选择五边形裁剪区域'
  };
  const ratioText = (cropShape === 'rect' && cropAspectRatio) ? `（固定比例 ${cropAspectRatio.w}:${cropAspectRatio.h}）` : '';
  document.getElementById('crop_hint').textContent = (hints[cropShape] || hints['rect']) + ratioText;
}

function exitCropMode() {
  cropMode = false;
  cropRect = null;
  cropDragging = false;
  cropDragType = null;
  cropShape = 'rect';
  _syncCropAspectUI();
  const cropOverlay = document.getElementById('crop_overlay');
  cropOverlay.style.display = 'none';
  cropOverlay.classList.add('hidden');
  const ctx = cropOverlay.getContext('2d');
  ctx.clearRect(0, 0, cropOverlay.width, cropOverlay.height);
  document.getElementById('crop_panel').classList.add('hidden');
  if (editOriginalImage) renderEditCanvas();
  _setEditToolHighlight(document.getElementById('compress_panel').classList.contains('hidden') ? null : 'compress');
}

function drawCropOverlay() {
  const cropOverlay = document.getElementById('crop_overlay');
  const ctx = cropOverlay.getContext('2d');
  ctx.clearRect(0, 0, cropOverlay.width, cropOverlay.height);
  if (!cropRect) return;
  
  const x = Math.min(cropRect.sx, cropRect.ex);
  const y = Math.min(cropRect.sy, cropRect.ey);
  const w = Math.abs(cropRect.ex - cropRect.sx);
  const h = Math.abs(cropRect.ey - cropRect.sy);
  
  // 绘制半透明遮罩
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, cropOverlay.width, cropOverlay.height);
  
  // 根据图形类型清除对应区域并绘制边框
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#6366f1';
  const sz = 8;
  
  if (cropShape === 'rect') {
    ctx.clearRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);
    // 四个角的把手
    ctx.fillRect(x - sz/2, y - sz/2, sz, sz);
    ctx.fillRect(x + w - sz/2, y - sz/2, sz, sz);
    ctx.fillRect(x - sz/2, y + h - sz/2, sz, sz);
    ctx.fillRect(x + w - sz/2, y + h - sz/2, sz, sz);
  } else if (cropShape === 'circle') {
    const r = Math.max(w, h) / 2;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2);
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#6366f1';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2);
    ctx.stroke();
    // 四个把手
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(x + w / 2 - sz/2, y - sz/2, sz, sz);
    ctx.fillRect(x + w - sz/2, y + h / 2 - sz/2, sz, sz);
    ctx.fillRect(x + w / 2 - sz/2, y + h - sz/2, sz, sz);
    ctx.fillRect(x - sz/2, y + h / 2 - sz/2, sz, sz);
  } else if (cropShape === 'star') {
    drawStarClip(ctx, x + w / 2, y + h / 2, Math.max(w, h) / 2);
    ctx.fillStyle = '#6366f1';
    drawStar(ctx, x + w / 2, y + h / 2, 5, Math.max(w, h) / 2, Math.max(w, h) / 4);
    ctx.stroke();
    drawStarHandles(ctx, x + w / 2, y + h / 2, Math.max(w, h) / 2);
  } else if (cropShape === 'heart') {
    const s = Math.min(w, h);
    const hx = x + (w - s) / 2;
    const hy = y + (h - s) / 2;
    drawHeartClip(ctx, hx + s / 2, hy + s / 2, s, s);
    ctx.fillStyle = '#6366f1';
    drawHeart(ctx, hx + s / 2, hy + s / 2, s, s);
    ctx.stroke();
    // 心形把手
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(hx + s * 0.22 - sz/2, hy + s * 0.24 - sz/2, sz, sz);
    ctx.fillRect(hx + s * 0.78 - sz/2, hy + s * 0.24 - sz/2, sz, sz);
    ctx.fillRect(hx + s * 0.5 - sz/2, hy + s * 0.95 - sz/2, sz, sz);
  } else if (cropShape === 'pentagon') {
    drawPentagonClip(ctx, x + w / 2, y + h / 2, Math.max(w, h) / 2);
    ctx.fillStyle = '#6366f1';
    drawPentagon(ctx, x + w / 2, y + h / 2, Math.max(w, h) / 2);
    ctx.stroke();
    drawPentagonHandles(ctx, x + w / 2, y + h / 2, Math.max(w, h) / 2);
  }
}

// 辅助函数：绘制圆形
function drawCircleClip(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// 辅助函数：绘制星形
function drawStar(ctx, cx, cy, points, radius, innerRadius) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? radius : innerRadius;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawStarClip(ctx, cx, cy, radius) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  drawStar(ctx, cx, cy, 5, radius, radius / 2);
  ctx.clip();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

function drawStarHandles(ctx, cx, cy, radius) {
  ctx.fillStyle = '#6366f1';
  const sz = 8;
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const px = cx + radius * Math.cos(angle);
    const py = cy + radius * Math.sin(angle);
    ctx.fillRect(px - sz/2, py - sz/2, sz, sz);
  }
}

// 辅助函数：绘制心形
function drawHeart(ctx, cx, cy, w, h) {
  const x = cx - w / 2;
  const y = cy - h / 2;
  ctx.beginPath();
  ctx.moveTo(cx, y + h * 0.92);
  ctx.bezierCurveTo(x + w * 0.02, y + h * 0.64, x + w * 0.02, y + h * 0.30, x + w * 0.25, y + h * 0.22);
  ctx.bezierCurveTo(x + w * 0.40, y + h * 0.16, x + w * 0.48, y + h * 0.24, cx, y + h * 0.36);
  ctx.bezierCurveTo(x + w * 0.52, y + h * 0.24, x + w * 0.60, y + h * 0.16, x + w * 0.75, y + h * 0.22);
  ctx.bezierCurveTo(x + w * 0.98, y + h * 0.30, x + w * 0.98, y + h * 0.64, cx, y + h * 0.92);
  ctx.closePath();
}

function drawHeartClip(ctx, cx, cy, w, h) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  drawHeart(ctx, cx, cy, w, h);
  ctx.clip();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

// 辅助函数：绘制五边形
function drawPentagon(ctx, cx, cy, radius) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const px = cx + radius * Math.cos(angle);
    const py = cy + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function drawPentagonClip(ctx, cx, cy, radius) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.save();
  drawPentagon(ctx, cx, cy, radius);
  ctx.clip();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.restore();
}

function drawPentagonHandles(ctx, cx, cy, radius) {
  ctx.fillStyle = '#6366f1';
  const sz = 8;
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const px = cx + radius * Math.cos(angle);
    const py = cy + radius * Math.sin(angle);
    ctx.fillRect(px - sz/2, py - sz/2, sz, sz);
  }
}

const cropOverlay = document.getElementById('crop_overlay');

function getCanvasCoordFromMouse(e) {
  const rect = cropOverlay.getBoundingClientRect();
  const cssX = e.clientX - rect.left;
  const cssY = e.clientY - rect.top;
  const x = cssX * cropOverlay.width / rect.width;
  const y = cssY * cropOverlay.height / rect.height;
  return { x: Math.max(0, Math.min(x, cropOverlay.width)), y: Math.max(0, Math.min(y, cropOverlay.height)) };
}

function getCropHandleType(pos) {
  if (!cropRect) return null;
  const x = Math.min(cropRect.sx, cropRect.ex);
  const y = Math.min(cropRect.sy, cropRect.ey);
  const w = Math.abs(cropRect.ex - cropRect.sx);
  const h = Math.abs(cropRect.ey - cropRect.sy);
  const handle = 12;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const r = Math.max(w, h) / 2;

  if (cropAspectRatio) {
    if (cropShape === 'circle') {
      const dist = Math.sqrt((pos.x - cx) * (pos.x - cx) + (pos.y - cy) * (pos.y - cy));
      return dist < r ? 'move' : null;
    }
    if (cropShape === 'heart') {
      return (pos.x > x + w * 0.2 && pos.x < x + w * 0.8 && pos.y > y + h * 0.1 && pos.y < y + h * 0.7) ? 'move' : null;
    }
    return (pos.x > x && pos.x < x + w && pos.y > y && pos.y < y + h) ? 'move' : null;
  }
  
  if (cropShape === 'rect') {
    // 检查四个角
    if (Math.abs(pos.x - x) < handle && Math.abs(pos.y - y) < handle) return 'nw';
    if (Math.abs(pos.x - (x + w)) < handle && Math.abs(pos.y - y) < handle) return 'ne';
    if (Math.abs(pos.x - x) < handle && Math.abs(pos.y - (y + h)) < handle) return 'sw';
    if (Math.abs(pos.x - (x + w)) < handle && Math.abs(pos.y - (y + h)) < handle) return 'se';
    
    // 检查四条边
    if (Math.abs(pos.y - y) < handle && pos.x > x && pos.x < x + w) return 'n';
    if (Math.abs(pos.y - (y + h)) < handle && pos.x > x && pos.x < x + w) return 's';
    if (Math.abs(pos.x - x) < handle && pos.y > y && pos.y < y + h) return 'w';
    if (Math.abs(pos.x - (x + w)) < handle && pos.y > y && pos.y < y + h) return 'e';
  } else if (cropShape === 'circle') {
    // 检查四个方向的把手
    if (Math.abs(pos.x - cx) < handle && Math.abs(pos.y - (cy - r)) < handle) return 'n';
    if (Math.abs(pos.x - (cx + r)) < handle && Math.abs(pos.y - cy) < handle) return 'e';
    if (Math.abs(pos.x - cx) < handle && Math.abs(pos.y - (cy + r)) < handle) return 's';
    if (Math.abs(pos.x - (cx - r)) < handle && Math.abs(pos.y - cy) < handle) return 'w';
  } else if (cropShape === 'star' || cropShape === 'pentagon') {
    const points = cropShape === 'star' ? 5 : 5;
    for (let i = 0; i < points; i++) {
      const angle = (i * 2 * Math.PI) / points - Math.PI / 2;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      if (Math.abs(pos.x - px) < handle && Math.abs(pos.y - py) < handle) return 'vertex-' + i;
    }
  } else if (cropShape === 'heart') {
    // 心形的三个把手
    const s = Math.min(w, h);
    const hx = x + (w - s) / 2;
    const hy = y + (h - s) / 2;
    if (Math.abs(pos.x - (hx + s * 0.22)) < handle && Math.abs(pos.y - (hy + s * 0.24)) < handle) return 'heart-left';
    if (Math.abs(pos.x - (hx + s * 0.78)) < handle && Math.abs(pos.y - (hy + s * 0.24)) < handle) return 'heart-right';
    if (Math.abs(pos.x - (hx + s * 0.50)) < handle && Math.abs(pos.y - (hy + s * 0.95)) < handle) return 'heart-bottom';
  }
  
  // 检查内部
  if (cropShape === 'circle') {
    const dist = Math.sqrt((pos.x - cx) * (pos.x - cx) + (pos.y - cy) * (pos.y - cy));
    if (dist < r) return 'move';
  } else if (cropShape === 'heart') {
    if (pos.x > x + w * 0.2 && pos.x < x + w * 0.8 && pos.y > y + h * 0.1 && pos.y < y + h * 0.7) return 'move';
  } else {
    if (pos.x > x && pos.x < x + w && pos.y > y && pos.y < y + h) return 'move';
  }
  
  return null;
}

cropOverlay.addEventListener('mousedown', (e) => {
  if (!cropMode) return;
  const pos = getCanvasCoordFromMouse(e);
  const handleType = getCropHandleType(pos);
  
  if (handleType) {
    cropDragging = true;
    cropDragType = handleType;
  } else {
    // 开始绘制新选区
    cropDragging = true;
    cropDragType = 'draw';
    cropRect = { sx: pos.x, sy: pos.y, ex: pos.x, ey: pos.y };
  }
});

document.addEventListener('mousemove', (e) => {
  if (!cropMode) return;
  
  // 更新鼠标光标
  if (cropRect && !cropDragging) {
    const pos = getCanvasCoordFromMouse(e);
    const handleType = getCropHandleType(pos);
    let cursor = 'crosshair';
    if (handleType === 'nw' || handleType === 'se') cursor = 'nwse-resize';
    if (handleType === 'ne' || handleType === 'sw') cursor = 'nesw-resize';
    if (handleType === 'n' || handleType === 's') cursor = 'ns-resize';
    if (handleType === 'w' || handleType === 'e') cursor = 'ew-resize';
    if (handleType === 'move') cursor = 'move';
    cropOverlay.style.cursor = cursor;
  }
  
  if (!cropDragging || !cropRect) return;
  
  const pos = getCanvasCoordFromMouse(e);
  const minSize = 20;
  
  if (cropDragType === 'draw') {
    // 绘制新选区
    if (cropAspectRatio) {
      const fixed = _applyAspectToPoint(cropRect.sx, cropRect.sy, pos.x, pos.y);
      cropRect.ex = fixed.x;
      cropRect.ey = fixed.y;
    } else if (cropShape === 'heart') {
      const dx = pos.x - cropRect.sx;
      const dy = pos.y - cropRect.sy;
      const s = Math.max(Math.abs(dx), Math.abs(dy));
      cropRect.ex = cropRect.sx + (dx >= 0 ? s : -s);
      cropRect.ey = cropRect.sy + (dy >= 0 ? s : -s);
    } else {
      cropRect.ex = pos.x;
      cropRect.ey = pos.y;
    }
  } else if (cropDragType === 'move') {
    // 移动整个选区
    const cx = Math.min(cropRect.sx, cropRect.ex);
    const cy = Math.min(cropRect.sy, cropRect.ey);
    const w = Math.abs(cropRect.ex - cropRect.sx);
    const h = Math.abs(cropRect.ey - cropRect.sy);
    const dx = pos.x - (cx + w / 2);
    const dy = pos.y - (cy + h / 2);
    
    const newX = Math.max(0, Math.min(cx + dx, cropOverlay.width - w));
    const newY = Math.max(0, Math.min(cy + dy, cropOverlay.height - h));
    
    cropRect.sx = newX;
    cropRect.sy = newY;
    cropRect.ex = newX + w;
    cropRect.ey = newY + h;
  } else if (cropShape === 'heart') {
    // 心形按把手等比缩放，保持标准比例
    const x = Math.min(cropRect.sx, cropRect.ex);
    const y = Math.min(cropRect.sy, cropRect.ey);
    const w = Math.abs(cropRect.ex - cropRect.sx);
    const h = Math.abs(cropRect.ey - cropRect.sy);
    const cx = x + w / 2;
    const cy = y + h / 2;
    const dx = Math.abs(pos.x - cx);
    const dy = Math.abs(pos.y - cy);
    const s = Math.max(minSize, Math.max(dx, dy) * 2);
    cropRect.sx = cx - s / 2;
    cropRect.sy = cy - s / 2;
    cropRect.ex = cx + s / 2;
    cropRect.ey = cy + s / 2;
  } else {
    // 调整选区大小
    const x = Math.min(cropRect.sx, cropRect.ex);
    const y = Math.min(cropRect.sy, cropRect.ey);
    const w = Math.abs(cropRect.ex - cropRect.sx);
    const h = Math.abs(cropRect.ey - cropRect.sy);
    let nx = x, ny = y, nw = w, nh = h;
    
    if (cropDragType.includes('w')) { nx = Math.min(pos.x, x + w - minSize); nw = x + w - nx; }
    if (cropDragType.includes('e')) { nw = Math.max(minSize, pos.x - x); }
    if (cropDragType.includes('n')) { ny = Math.min(pos.y, y + h - minSize); nh = y + h - ny; }
    if (cropDragType.includes('s')) { nh = Math.max(minSize, pos.y - y); }
    
    cropRect.sx = nx;
    cropRect.sy = ny;
    cropRect.ex = nx + nw;
    cropRect.ey = ny + nh;
  }
  
  const w = Math.abs(cropRect.ex - cropRect.sx);
  const h = Math.abs(cropRect.ey - cropRect.sy);
  document.getElementById('crop_confirm').disabled = (w < 20 || h < 20);
  drawCropOverlay();
});

document.addEventListener('mouseup', (e) => {
  cropDragging = false;
  cropDragType = null;
});

document.getElementById('crop_confirm').onclick = () => {
  if (!cropRect || editRotateDeg !== 0) return;
  const sx = Math.min(cropRect.sx, cropRect.ex);
  const sy = Math.min(cropRect.sy, cropRect.ey);
  const sw = Math.abs(cropRect.ex - cropRect.sx);
  const sh = Math.abs(cropRect.ey - cropRect.sy);
  const editCanvas = document.getElementById('edit_preview');
  const scaleX = editOriginalImage.naturalWidth / editCanvas.width;
  const scaleY = editOriginalImage.naturalHeight / editCanvas.height;
  const srcX = Math.round(sx * scaleX);
  const srcY = Math.round(sy * scaleY);
  const srcW = Math.round(sw * scaleX);
  const srcH = Math.round(sh * scaleY);
  const c = document.createElement('canvas');
  c.width = srcW; c.height = srcH;
  const cx = c.getContext('2d');
  
  // 根据图形类型应用不同的裁剪
  if (cropShape === 'rect') {
    cx.drawImage(editOriginalImage, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
  } else if (cropShape === 'circle') {
    cx.save();
    cx.beginPath();
    cx.arc(srcW / 2, srcH / 2, Math.max(srcW, srcH) / 2, 0, Math.PI * 2);
    cx.clip();
    cx.drawImage(editOriginalImage, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    cx.restore();
  } else if (cropShape === 'star') {
    cx.save();
    drawStar(cx, srcW / 2, srcH / 2, 5, Math.max(srcW, srcH) / 2, Math.max(srcW, srcH) / 4);
    cx.clip();
    cx.drawImage(editOriginalImage, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    cx.restore();
  } else if (cropShape === 'heart') {
    cx.save();
    drawHeart(cx, srcW / 2, srcH / 2, srcW, srcH);
    cx.clip();
    cx.drawImage(editOriginalImage, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    cx.restore();
  } else if (cropShape === 'pentagon') {
    cx.save();
    drawPentagon(cx, srcW / 2, srcH / 2, Math.max(srcW, srcH) / 2);
    cx.clip();
    cx.drawImage(editOriginalImage, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
    cx.restore();
  }
  
  c.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      if (editOriginalUrl) URL.revokeObjectURL(editOriginalUrl);
      editOriginalUrl = url;
      editOriginalImage = img;
      editRotateDeg = 0;
      renderEditCanvas();
      exitCropMode();
      _pushEditHistory();
    };
    img.src = url;
  });
};


document.getElementById('crop_cancel').onclick = () => exitCropMode();

// 图形选择按钮事件监听
document.querySelectorAll('.crop-shape-btn').forEach(btn => {
  btn.onclick = () => {
    if (!cropMode) return;
    cropShape = btn.getAttribute('data-shape');
    _syncCropAspectUI();
    cropRect = null;  // 重置选区
    updateCropHint();
    
    // 更新按钮样式
    document.querySelectorAll('.crop-shape-btn').forEach(b => {
      b.classList.remove('active', 'bg-primary', 'text-white', 'border-primary');
      b.classList.add('border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
    });
    btn.classList.add('active', 'bg-primary', 'text-white', 'border-primary');
    btn.classList.remove('border-gray-300', 'dark:border-gray-600', 'text-gray-700', 'dark:text-gray-300');
    
    drawCropOverlay();
  };
});

document.querySelector('.crop').onclick = () => {
  if (cropMode) {
    exitCropMode();
    _setEditToolHighlight(document.getElementById('compress_panel').classList.contains('hidden') ? null : 'compress');
  }
  else enterCropMode();
}
// ---- 裁剪功能结束 ----

function bindDropUpload(dropZone, input, options = {}) {
  const isMultiple = Boolean(options.multiple)
  const onFiles = options.onFiles || (() => {})
  const accept = (input.getAttribute('accept') || '').trim()

  const isAcceptedFile = (file) => {
    if (!accept) return true
    const patterns = accept.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean)
    const name = (file.name || '').toLowerCase()
    const type = (file.type || '').toLowerCase()
    return patterns.some((pattern) => {
      if (pattern.startsWith('.')) return name.endsWith(pattern)
      if (pattern.endsWith('/*')) return type.startsWith(pattern.slice(0, -1))
      return type === pattern
    })
  }

  const triggerFiles = async (fileList) => {
    try {
      await onFiles(fileList)
    } catch (error) {
      setAdvStatus('文件处理失败，请重试。', true)
    }
  }

  dropZone.onclick = () => input.click()
  input.addEventListener('click', (e) => e.stopPropagation())

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault()
    dropZone.classList.add('border-primary')
    dropZone.classList.add('bg-primary/5')
  })

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-primary')
    dropZone.classList.remove('bg-primary/5')
  })

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault()
    dropZone.classList.remove('border-primary')
    dropZone.classList.remove('bg-primary/5')
    const dropped = e.dataTransfer && e.dataTransfer.files ? Array.from(e.dataTransfer.files) : []
    if (!dropped.length) return
    const accepted = dropped.filter(isAcceptedFile)
    if (!accepted.length) {
      setAdvStatus('文件类型不支持，请按提示选择文件。', true)
      return
    }

    const files = isMultiple ? accepted : [accepted[0]]
    if (typeof DataTransfer !== 'undefined') {
      const dt = new DataTransfer()
      files.forEach((file) => dt.items.add(file))
      input.files = dt.files
      triggerFiles(input.files)
      return
    }

    // 旧浏览器兜底：无法写回 input.files 时，直接处理拖入文件。
    triggerFiles(files)
  })

  input.addEventListener('change', () => triggerFiles(input.files))
}

async function runWithBusy(button, loadingHtml, action) {
  if (button.disabled) return
  const originalHtml = button.innerHTML
  button.disabled = true
  button.innerHTML = loadingHtml
  try {
    await action()
  } catch (error) {
    setAdvStatus('执行失败，请重试。', true)
  } finally {
    button.disabled = false
    button.innerHTML = originalHtml
  }
}

// 高级玩法：上传与基础交互
bindDropUpload(advUploadArea, fileAdv, {
  multiple: false,
  onFiles: async (files) => {
    const file = files[0]
    if (!file) return
    try {
      const { img } = await readImageFile(file)
      const maxWidth = 1200
      const scale = Math.min(1, maxWidth / img.width)
      advCanvas.width = Math.round(img.width * scale)
      advCanvas.height = Math.round(img.height * scale)
      advCtx.drawImage(img, 0, 0, advCanvas.width, advCanvas.height)
      advStageWrap.classList.remove('hidden')
      advFitStage()
      advOriginalDataUrl = advCanvas.toDataURL('image/png')
      advBaseImage = img
      advSelection = null
      advClearOverlay()
      setAdvStatus('高级工作台图片已加载。')
    } catch (error) {
      setAdvStatus('图片加载失败，请重试。', true)
    }
  }
})

bindDropUpload(advBatchDrop, advBatchFiles, {
  multiple: true,
  onFiles: (files) => {
    if (!files.length) return
    setAdvStatus('批处理图片已选择：' + files.length + ' 张。')
  }
})

bindDropUpload(advCollageDrop, advCollageFiles, {
  multiple: true,
  onFiles: (files) => {
    if (!files.length) return
    setAdvStatus('拼图素材已选择：' + files.length + ' 张。')
  }
})

bindDropUpload(advPdfImagesDrop, advPdfImages, {
  multiple: true,
  onFiles: (files) => {
    if (!files.length) return
    setAdvStatus('PDF 素材图已选择：' + files.length + ' 张。')
  }
})

bindDropUpload(advPdfFileDrop, advPdfFile, {
  multiple: false,
  onFiles: (files) => {
    if (!files.length) return
    setAdvStatus('PDF 文件已选择：' + files[0].name)
  }
})

function switchAdvPanel() {
  const key = advFeature.value
  advPanels.forEach(panel => panel.classList.add('hidden'))
  if (advPanelEmpty) advPanelEmpty.classList.add('hidden')
  const target = document.querySelector('.adv-panel[data-panel="' + key + '"]')
  if (target) target.classList.remove('hidden')
  else if (advPanelEmpty) advPanelEmpty.classList.remove('hidden')
  advMode = 'none'
  advSelection = null
  advClearOverlay()
  const meta = ADV_FEATURE_META[key]
  if (meta) {
    if (advFeatureSummary) advFeatureSummary.textContent = meta.title
    if (advFeatureDesc) advFeatureDesc.textContent = meta.desc
  }
  if (key === 'remove') {
    advMode = 'remove-select'
    setAdvStatus('请在画布上框选要移除的物体区域。')
  } else if (key === 'privacy') {
    setAdvStatus('可使用自动检测或手动画刷，对敏感区域做保护。')
  } else if (key === 'ocr') {
    setAdvStatus('上传图片后可识别文字，识别结果会显示在文本框中。')
  }
}

function setAdvFeature(featureKey) {
  if (!advFeature || !featureKey) return
  advFeature.value = featureKey
  advFeatureCards.forEach((card) => {
    card.classList.toggle('is-active', card.dataset.feature === featureKey)
  })
  switchAdvPanel()
}

function setAdvCategory(categoryKey) {
  const meta = ADV_CATEGORY_META[categoryKey]
  if (!meta) return
  advCurrentCategory = categoryKey
  advCategoryButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.category === categoryKey)
  })
  if (advCategoryTitle) advCategoryTitle.textContent = meta.title
  if (advCategoryDesc) advCategoryDesc.textContent = meta.desc

  const workflowMode = categoryKey === 'workflow'
  if (advSingleImageWorkspace) advSingleImageWorkspace.classList.toggle('hidden', workflowMode)
  if (advWorkflowWorkspace) advWorkflowWorkspace.classList.toggle('hidden', !workflowMode)

  advFeatureCards.forEach((card) => {
    card.classList.toggle('hidden', card.dataset.category !== categoryKey)
  })

  if (workflowMode) {
    advMode = 'none'
    advSelection = null
    advClearOverlay()
    setAdvStatus('已进入批量与输出工作流，可直接选择批处理、拼图或 PDF 任务。')
    return
  }

  const currentFeature = advFeature ? advFeature.value : null
  const visibleFeatureCard = advFeatureCards.find((card) => card.dataset.category === categoryKey && card.dataset.feature === currentFeature)
  setAdvFeature(visibleFeatureCard ? currentFeature : meta.defaultFeature)
}

advCategoryButtons.forEach((button) => {
  button.onclick = () => setAdvCategory(button.dataset.category)
})

advFeatureCards.forEach((card) => {
  card.onclick = () => setAdvFeature(card.dataset.feature)
})

advFeature.addEventListener('change', () => setAdvFeature(advFeature.value))
setAdvCategory('portrait')
applyLanguage(currentLang)

advOverlay.addEventListener('mousedown', (e) => {
  if (!advEnsureImage()) return
  if (advMode === 'remove-select') {
    advDrawing = true
    advDragStart = advGetPoint(e)
    advSelection = { x: advDragStart.x, y: advDragStart.y, w: 0, h: 0 }
  } else if (advMode === 'privacy-brush') {
    advDrawing = true
    const p = advGetPoint(e)
    advMosaicRect(p.x - 16, p.y - 16, 32, 32, 8)
  }
})

advOverlay.addEventListener('mousemove', (e) => {
  if (!advDrawing) return
  if (advMode === 'remove-select') {
    const p = advGetPoint(e)
    advSelection = {
      x: Math.min(advDragStart.x, p.x),
      y: Math.min(advDragStart.y, p.y),
      w: Math.abs(p.x - advDragStart.x),
      h: Math.abs(p.y - advDragStart.y)
    }
    advDrawOverlayRect(advSelection)
  } else if (advMode === 'privacy-brush') {
    const p = advGetPoint(e)
    advMosaicRect(p.x - 16, p.y - 16, 32, 32, 8)
  }
})

window.addEventListener('mouseup', () => {
  if (!advDrawing) return
  advDrawing = false
  if (advMode === 'remove-select' && advSelection && advSelection.w > 5 && advSelection.h > 5) {
    setAdvStatus('区域已框选，点击“执行当前任务”进行物体移除。')
  }
})

async function advRunOcrRecognition() {
  if (!advEnsureImage()) return
  setAdvStatus('OCR 识别中，请稍候...')
  const result = await Tesseract.recognize(advCanvas.toDataURL('image/png'), advOcrLang.value)
  advOcrOutput.value = (result.data && result.data.text ? result.data.text : '').trim()
  setAdvStatus('OCR 识别完成。')
}

advRun.onclick = async () => {
  await runWithBusy(advRun, '<i class="fa fa-spinner fa-spin mr-1"></i>处理中...', async () => {
    if (!advEnsureImage()) return
    const key = advFeature.value
    if (key === 'cutout') advApplyCutout()
    else if (key === 'idphoto') advApplyIdPhoto()
    else if (key === 'restore') advApplyRestore()
    else if (key === 'style') advApplyStyle()
    else if (key === 'beauty') advApplyBeauty()
    else if (key === 'remove') {
      if (!advSelection || advSelection.w < 5 || advSelection.h < 5) {
        setAdvStatus('请先框选一个有效区域。', true)
        return
      }
      removeWatermarkRegion(advCtx, advSelection.x, advSelection.y, advSelection.w, advSelection.h)
      advClearOverlay()
      setAdvStatus('物体移除完成。')
    }
    else if (key === 'outpaint') advApplyOutpaint()
    else if (key === 'upscale') advApplyUpscale()
    else if (key === 'meme') advApplyMeme()
    else if (key === 'ocr') await advRunOcrRecognition()
    else if (key === 'lut') advApplyLut()
    else if (key === 'privacy') advApplyAutoPrivacy()
  })
}

advReset.onclick = async () => {
  if (!advOriginalDataUrl) {
    setAdvStatus('请先上传主图。', true)
    return
  }
  const image = new Image()
  image.src = advOriginalDataUrl
  await image.decode()
  advCanvas.width = image.width
  advCanvas.height = image.height
  advCtx.drawImage(image, 0, 0)
  advFitStage()
  advSelection = null
  advClearOverlay()
  setAdvStatus('已恢复上传原图。')
}

advDownload.onclick = () => {
  if (!advEnsureImage()) return
  const a = document.createElement('a')
  a.href = advCanvas.toDataURL('image/png')
  a.download = 'advanced-result.png'
  a.click()
}

advPrivacyAuto.onclick = () => {
  if (!advEnsureImage()) return
  advApplyAutoPrivacy()
}

advPrivacyBrush.onclick = () => {
  if (!advEnsureImage()) return
  advMode = 'privacy-brush'
  setAdvStatus('手动刷抹模式已开启，请在画布上拖动鼠标。')
}

advOcrRun.onclick = async () => {
  await runWithBusy(advOcrRun, '<i class="fa fa-spinner fa-spin mr-1"></i>识别中...', advRunOcrRecognition)
}

advOcrTranslate.onclick = () => {
  const text = advOcrOutput.value.trim()
  if (!text) {
    setAdvStatus('没有可翻译内容。', true)
    return
  }
  advOcrOutput.value = advSimpleTranslate(text)
  setAdvStatus('简易翻译完成。')
}

advBatchRun.onclick = async () => {
  await runWithBusy(advBatchRun, '<i class="fa fa-spinner fa-spin mr-1"></i>批处理中...', async () => {
    const files = Array.from(advBatchFiles.files || [])
    if (!files.length) {
      setAdvStatus('请先选择批量图片。', true)
      return
    }
    const mark = advBatchMark.value.trim() || 'IPlay'
    const quality = Number(advBatchQuality.value)
    for (let i = 0; i < files.length; i++) {
      const { img } = await readImageFile(files[i])
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const c = canvas.getContext('2d')
      c.drawImage(img, 0, 0)
      c.fillStyle = 'rgba(255,255,255,0.68)'
      c.font = 'bold ' + Math.max(18, Math.round(img.width / 24)) + 'px sans-serif'
      c.textAlign = 'right'
      c.fillText(mark, img.width - 24, img.height - 22)
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/jpeg', quality)
      a.download = 'batch-' + (i + 1) + '.jpg'
      a.click()
    }
    setAdvStatus('批量压缩与批量水印完成，共 ' + files.length + ' 张。')
  })
}

advCollageRender.onclick = async () => {
  await runWithBusy(advCollageRender, '<i class="fa fa-spinner fa-spin mr-1"></i>生成中...', async () => {
    const files = Array.from(advCollageFiles.files || []).slice(0, 9)
    if (files.length < 2) {
      setAdvStatus('拼图海报至少需要 2 张图片。', true)
      return
    }
    const grid = Number(advCollageGrid.value)
    const size = grid === 2 ? 960 : 1080
    const titleHeight = 100
    advCollageCanvas.width = size
    advCollageCanvas.height = size + titleHeight
    advCollageCtx.fillStyle = '#0f172a'
    advCollageCtx.fillRect(0, 0, advCollageCanvas.width, advCollageCanvas.height)
    const cell = Math.floor(size / grid)
    const loaded = await Promise.all(files.map(readImageFile))
    loaded.forEach((item, idx) => {
      const row = Math.floor(idx / grid)
      const col = idx % grid
      if (row >= grid) return
      advCollageCtx.drawImage(item.img, col * cell, row * cell + titleHeight, cell, cell)
    })
    advCollageCtx.fillStyle = '#f8fafc'
    advCollageCtx.font = 'bold 48px sans-serif'
    advCollageCtx.textAlign = 'center'
    advCollageCtx.fillText(advCollageTitle.value || 'IPlay Collage', size / 2, 64)
    setAdvStatus('拼图海报生成完成。')
  })
}

advCollageDownload.onclick = () => {
  if (!advCollageCanvas.width) {
    setAdvStatus('请先生成拼图海报。', true)
    return
  }
  const a = document.createElement('a')
  a.href = advCollageCanvas.toDataURL('image/png')
  a.download = 'collage-poster.png'
  a.click()
}

advToPdf.onclick = async () => {
  await runWithBusy(advToPdf, '<i class="fa fa-spinner fa-spin mr-1"></i>导出中...', async () => {
    const files = Array.from(advPdfImages.files || [])
    if (!files.length) {
      setAdvStatus('请选择要转 PDF 的图片。', true)
      return
    }
    const jsPDF = window.jspdf && window.jspdf.jsPDF
    if (!jsPDF) {
      setAdvStatus('jsPDF 加载失败，请检查网络后重试。', true)
      return
    }
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    for (let i = 0; i < files.length; i++) {
      const { img } = await readImageFile(files[i])
      if (i > 0) doc.addPage()
      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const scale = Math.min(pageW / img.width, pageH / img.height)
      const w = img.width * scale
      const h = img.height * scale
      const x = (pageW - w) / 2
      const y = (pageH - h) / 2
      const tmp = document.createElement('canvas')
      tmp.width = img.width
      tmp.height = img.height
      tmp.getContext('2d').drawImage(img, 0, 0)
      doc.addImage(tmp.toDataURL('image/jpeg', 0.9), 'JPEG', x, y, w, h)
    }
    doc.save('images.pdf')
    setAdvStatus('图像转 PDF 完成。')
  })
}

advPdfToImg.onclick = async () => {
  await runWithBusy(advPdfToImg, '<i class="fa fa-spinner fa-spin mr-1"></i>转换中...', async () => {
    const file = advPdfFile.files[0]
    if (!file) {
      setAdvStatus('请选择 PDF 文件。', true)
      return
    }
    const pdfjs = await advLoadPdfLib()
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const viewport = page.getViewport({ scale: 1.6 })
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const c = canvas.getContext('2d')
      await page.render({ canvasContext: c, viewport }).promise
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = 'pdf-page-' + i + '.png'
      a.click()
    }
    setAdvStatus('PDF 转图片完成。')
  })
}