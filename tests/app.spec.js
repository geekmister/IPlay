const { test, expect } = require('@playwright/test');

function createSvgBuffer({ width = 240, height = 160, text = 'IPlay', fill = '#4f46e5' } = {}) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f8fafc"/>
      <rect x="12" y="12" width="${width - 24}" height="${height - 24}" rx="18" fill="${fill}" opacity="0.9"/>
      <circle cx="${Math.round(width * 0.26)}" cy="${Math.round(height * 0.38)}" r="${Math.round(Math.min(width, height) * 0.11)}" fill="#fbbf24"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="24" font-family="Arial" fill="#ffffff">${text}</text>
    </svg>
  `.trim();
  return Buffer.from(svg);
}

function createSkinToneSvgBuffer({ width = 320, height = 220, text = 'PRIV' } = {}) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f8fafc"/>
      <rect x="10" y="10" width="${width - 20}" height="${height - 20}" rx="16" fill="rgb(216,160,127)"/>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" font-size="24" font-family="Arial" fill="#111827">${text}</text>
    </svg>
  `.trim();
  return Buffer.from(svg);
}

async function gotoApp(page, options = {}) {
  const {
    geolocation = null,
    sunrise = '2099-01-01T06:00:00+00:00',
    sunset = '2099-01-01T18:00:00+00:00',
    mockTesseract = false,
    mockPdfWorkflow = false,
  } = options;

  await page.addInitScript(({ shouldMockTesseract }) => {
    window.__downloads = [];
    const originalAnchorClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function clickOverride() {
      const href = this.getAttribute('href') || this.href || '';
      const download = this.getAttribute('download') || this.download || '';
      if (download || href.startsWith('data:') || href.startsWith('blob:') || href.startsWith('mock:')) {
        window.__downloads.push({ download, href });
        return;
      }
      return originalAnchorClick.call(this);
    };

    window.EXIF = {
      readFromBinaryFile: () => ({}),
    };
    if (shouldMockTesseract) {
      window.Tesseract = {
        recognize: async () => ({
          data: {
            text: 'Detected OCR text',
          },
        }),
      };
    }
  }, { shouldMockTesseract: mockTesseract });

  if (geolocation) {
    await page.context().grantPermissions(['geolocation']);
    await page.context().setGeolocation(geolocation);
  }

  await page.route('https://api.sunrise-sunset.org/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: {
          sunrise,
          sunset,
        },
        status: 'OK',
      }),
    });
  });

  await page.goto('/');

  await page.evaluate(({ shouldMockTesseract, shouldMockPdfWorkflow }) => {
    if (shouldMockTesseract) {
      window.Tesseract = {
        recognize: async () => ({
          data: {
            text: 'Detected OCR text',
          },
        }),
      };
    }

    if (shouldMockPdfWorkflow) {
      window.jspdf = {
        jsPDF: class MockJsPdf {
          constructor() {
            this.internal = {
              pageSize: {
                getWidth() { return 595; },
                getHeight() { return 842; },
              },
            };
          }

          addPage() {}
          addImage() {}
          save(filename) {
            window.__downloads.push({ download: filename, href: 'mock:jspdf' });
          }
        },
      };

      window.advLoadPdfLib = async () => ({
        getDocument: () => ({
          promise: Promise.resolve({
            numPages: 2,
            getPage: async (pageNumber) => ({
              getViewport: ({ scale }) => ({
                width: 200 * scale,
                height: 280 * scale,
              }),
              render: ({ canvasContext, viewport }) => {
                canvasContext.fillStyle = pageNumber === 1 ? '#1d4ed8' : '#0f766e';
                canvasContext.fillRect(0, 0, viewport.width, viewport.height);
                return { promise: Promise.resolve() };
              },
            }),
          }),
        }),
      });
    }
  }, { shouldMockTesseract: mockTesseract, shouldMockPdfWorkflow: mockPdfWorkflow });
}

async function readDownloads(page) {
  return page.evaluate(() => window.__downloads.slice());
}

async function clearDownloads(page) {
  await page.evaluate(() => {
    window.__downloads = [];
  });
}

test.describe('IPlay 核心功能', () => {
  test('根据日出日落自动应用暗色主题', async ({ page }) => {
    await gotoApp(page, {
      geolocation: { latitude: 31.2304, longitude: 121.4737 },
      sunrise: '2099-01-01T06:00:00+08:00',
      sunset: '2000-01-01T18:00:00+08:00',
    });

    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('图片信息模块可上传并展示基础元数据', async ({ page }) => {
    await gotoApp(page);

    await page.locator('#file_info').setInputFiles({
      name: 'info-sample.svg',
      mimeType: 'image/svg+xml',
      buffer: createSvgBuffer({ width: 300, height: 180, text: 'Meta' }),
    });

    await expect(page.locator('#edit_info_empty')).toBeHidden();
    await expect(page.locator('#edit_info_content')).toBeVisible();
    await expect(page.locator('#edit_info_name')).toHaveText('info-sample.svg');
    await expect(page.locator('#edit_info_dim')).toHaveText('300 × 180');
    await expect(page.locator('#edit_info_ratio')).toHaveText('5:3');
    await expect(page.locator('#edit_info_hash')).not.toHaveText('-');

    await page.locator('#btn_info_delete').click();
    await expect(page.locator('#edit_info_empty')).toBeVisible();
  });

  test('AI 去水印流程可完成上传、框选和处理', async ({ page }) => {
    await gotoApp(page);

    await page.getByRole('button', { name: 'AI 去水印' }).click();
    await page.locator('#btn_img_go').click();
    await expect(page.locator('#toast_container')).toContainText('请先上传并加载图片。');

    await page.locator('#file_img').setInputFiles({
      name: 'watermark-sample.svg',
      mimeType: 'image/svg+xml',
      buffer: createSvgBuffer({ width: 320, height: 200, text: 'WM' }),
    });

    await expect(page.locator('#img_preview_wrap')).toBeVisible();
    await expect(page.locator('#img_status')).toContainText('图片已加载，请先框选水印区域后再执行。');
    await expect(page.locator('#btn_img_go')).toHaveClass(/btn-guide-pulse/);

    const canvas = page.locator('#img_canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('img canvas is not visible');
    await page.mouse.move(box.x + 40, box.y + 40);
    await page.mouse.down();
    await page.mouse.move(box.x + 120, box.y + 90);
    await page.mouse.up();

    await page.locator('#btn_img_go').click();
    await expect(page.locator('#img_status')).toContainText('水印去除完成！');
    await expect(page.locator('#btn_img_down')).toBeVisible();
  });

  test('图片编辑支持旋转与撤销重做', async ({ page }) => {
    await gotoApp(page);

    await page.getByRole('button', { name: '图片编辑' }).click();
    await page.locator('#file_edit').setInputFiles({
      name: 'edit-sample.svg',
      mimeType: 'image/svg+xml',
      buffer: createSvgBuffer({ width: 300, height: 160, text: 'Edit', fill: '#0f766e' }),
    });

    await expect(page.locator('#edit_preview_wrap')).toBeVisible();

    const readCanvasState = async () => page.locator('#edit_preview').evaluate((canvas) => ({
      width: canvas.width,
      height: canvas.height,
      dataUrl: canvas.toDataURL(),
    }));
    const original = await readCanvasState();

    await page.locator('#btn_edit_rotate_cw').click();
    await expect(page.locator('#btn_edit_undo')).toBeEnabled();
    const rotated = await readCanvasState();
    expect(rotated.dataUrl).not.toBe(original.dataUrl);
    expect(rotated.width).toBe(original.height);
    expect(rotated.height).toBe(original.width);

    await page.locator('#btn_edit_undo').click();
    await expect.poll(readCanvasState).toEqual(original);

    await page.locator('#btn_edit_redo').click();
    await expect.poll(async () => {
      const state = await readCanvasState();
      return `${state.width}x${state.height}`;
    }).toBe(`${rotated.width}x${rotated.height}`);
  });

  test('高级工作台支持分类切换和 OCR 识别', async ({ page }) => {
    await gotoApp(page, { mockTesseract: true });

    await page.getByRole('button', { name: '识别与隐私 OCR、翻译、隐私保护与敏感区域处理' }).click();
    await expect(page.locator('#advanced_workspace')).toBeVisible();
    await expect(page.locator('#adv_category_title')).toHaveText('识别与隐私');
    await expect(page.locator('[data-feature="ocr"]')).toBeVisible();

    await page.locator('#file_adv').setInputFiles({
      name: 'ocr-sample.svg',
      mimeType: 'image/svg+xml',
      buffer: createSvgBuffer({ width: 360, height: 220, text: 'OCR' }),
    });

    await expect(page.locator('#adv_stage_wrap')).toBeVisible();
    await page.locator('[data-feature="ocr"]').click();
    await page.locator('#adv_run').click();

    await expect(page.locator('#adv_ocr_output')).toHaveValue('Detected OCR text');
    await expect(page.locator('#adv_status')).toContainText('OCR 识别完成');

    await page.locator('[data-category="workflow"]').click();
    await expect(page.locator('#adv_workflow_workspace')).toBeVisible();
    await expect(page.locator('#adv_single_image_workspace')).toBeHidden();
  });

  test('AI 换脸支持授权校验与预览输出', async ({ page }) => {
    await gotoApp(page);

    await page.getByRole('button', { name: /AI 换脸/ }).click();
    await page.locator('#file_face_source').setInputFiles({
      name: 'face-source.svg',
      mimeType: 'image/svg+xml',
      buffer: createSvgBuffer({ width: 180, height: 180, text: 'SRC', fill: '#dc2626' }),
    });
    await page.locator('#file_face_target').setInputFiles({
      name: 'face-target.svg',
      mimeType: 'image/svg+xml',
      buffer: createSvgBuffer({ width: 320, height: 420, text: 'TGT', fill: '#1d4ed8' }),
    });

    await expect(page.locator('#face_stage_wrap')).toBeVisible();
    await expect(page.locator('#btn_face_go')).toBeEnabled();
    await expect(page.locator('#face_status')).toContainText('目标图已加载，可开始拖拽调整脸部位置。');

    await page.locator('#btn_face_go').click();
    await expect(page.locator('#face_status')).toContainText('开始换脸前，请先确认已获得图像授权。');

    await page.locator('#face_consent').check();
    await page.locator('#face_scale').fill('90');
    await expect(page.locator('#face_scale_text')).toHaveText('90%');
    await page.locator('#btn_face_go').click();

    await expect(page.locator('#face_status')).toContainText('换脸预览已生成。');
    await expect(page.locator('#btn_face_down')).toBeVisible();
  });

  test('批量与输出工作流支持批处理与 PDF 转换', async ({ page }) => {
    await gotoApp(page, { mockPdfWorkflow: true });

    await page.getByRole('button', { name: /批量与输出/ }).click();
    await expect(page.locator('#adv_workflow_workspace')).toBeVisible();

    await clearDownloads(page);
    await page.locator('#adv_batch_files').setInputFiles([
      {
        name: 'batch-1.svg',
        mimeType: 'image/svg+xml',
        buffer: createSvgBuffer({ width: 240, height: 180, text: 'B1', fill: '#7c3aed' }),
      },
      {
        name: 'batch-2.svg',
        mimeType: 'image/svg+xml',
        buffer: createSvgBuffer({ width: 240, height: 180, text: 'B2', fill: '#ea580c' }),
      },
    ]);
    await page.locator('#adv_batch_run').click();
    await expect(page.locator('#adv_status')).toContainText('批量压缩与批量水印完成，共 2 张。');
    await expect.poll(async () => (await readDownloads(page)).filter((item) => item.download.startsWith('batch-')).length).toBe(2);

    await clearDownloads(page);
    await page.locator('#adv_pdf_images').setInputFiles([
      {
        name: 'pdf-image-1.svg',
        mimeType: 'image/svg+xml',
        buffer: createSvgBuffer({ width: 260, height: 180, text: 'P1', fill: '#0f766e' }),
      },
      {
        name: 'pdf-image-2.svg',
        mimeType: 'image/svg+xml',
        buffer: createSvgBuffer({ width: 260, height: 180, text: 'P2', fill: '#2563eb' }),
      },
    ]);
    await page.locator('#adv_to_pdf').click();
    await expect(page.locator('#adv_status')).toContainText('图像转 PDF 完成。');
    await expect.poll(async () => (await readDownloads(page)).some((item) => item.download === 'images.pdf')).toBe(true);

    await clearDownloads(page);
    await page.locator('#adv_pdf_file').setInputFiles({
      name: 'sample.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF'),
    });
    await page.locator('#adv_pdf_to_img').click();
    await expect(page.locator('#adv_status')).toContainText('PDF 转图片完成。');
    await expect.poll(async () => (await readDownloads(page)).filter((item) => item.download.startsWith('pdf-page-')).length).toBe(2);
  });

  test('高级工作台支持物体移除与隐私保护', async ({ page }) => {
    await gotoApp(page);

    await page.getByRole('button', { name: /修复与增强/ }).click();
    await expect(page.locator('#advanced_workspace')).toBeVisible();
    await expect(page.locator('#adv_category_title')).toHaveText('修复与增强');

    await page.locator('#file_adv').setInputFiles({
      name: 'remove-sample.svg',
      mimeType: 'image/svg+xml',
      buffer: createSvgBuffer({ width: 360, height: 220, text: 'RM', fill: '#7c3aed' }),
    });
    await expect(page.locator('#adv_stage_wrap')).toBeVisible();

    await page.locator('[data-feature="remove"]').click();
    const overlay = page.locator('#adv_overlay');
    await overlay.scrollIntoViewIfNeeded();
    const box = await overlay.boundingBox();
    if (!box) throw new Error('advanced overlay is not visible');

    await overlay.hover({ position: { x: 40, y: 40 } });
    await page.mouse.down();
    await overlay.hover({ position: { x: 160, y: 120 } });
    await page.mouse.up();
    await expect(page.locator('#adv_status')).toContainText('区域已框选');

    await page.locator('#adv_run').click();
    await expect(page.locator('#adv_status')).toContainText('物体移除完成。');

    await page.locator('#adv_category_nav .adv-category-btn[data-category="text"]').click();
    await page.locator('#file_adv').setInputFiles({
      name: 'privacy-sample.svg',
      mimeType: 'image/svg+xml',
      buffer: createSkinToneSvgBuffer({ width: 360, height: 220, text: 'SAFE' }),
    });
    await page.locator('[data-feature="privacy"]').click();
    await page.locator('#adv_run').click();
    await expect(page.locator('#adv_status')).toContainText('自动隐私马赛克已完成。');
  });

  test('批量与输出支持拼图海报生成与下载', async ({ page }) => {
    await gotoApp(page);

    await page.getByRole('button', { name: /批量与输出/ }).click();
    await expect(page.locator('#adv_workflow_workspace')).toBeVisible();

    await page.locator('#adv_collage_files').setInputFiles([
      {
        name: 'collage-1.svg',
        mimeType: 'image/svg+xml',
        buffer: createSvgBuffer({ width: 260, height: 180, text: 'C1', fill: '#1d4ed8' }),
      },
      {
        name: 'collage-2.svg',
        mimeType: 'image/svg+xml',
        buffer: createSvgBuffer({ width: 260, height: 180, text: 'C2', fill: '#0f766e' }),
      },
      {
        name: 'collage-3.svg',
        mimeType: 'image/svg+xml',
        buffer: createSvgBuffer({ width: 260, height: 180, text: 'C3', fill: '#ea580c' }),
      },
      {
        name: 'collage-4.svg',
        mimeType: 'image/svg+xml',
        buffer: createSvgBuffer({ width: 260, height: 180, text: 'C4', fill: '#7c3aed' }),
      },
    ]);
    await page.locator('#adv_collage_grid').selectOption('2');
    await page.locator('#adv_collage_title').fill('Playwright Collage');
    await page.locator('#adv_collage_render').click();

    await expect(page.locator('#adv_status')).toContainText('拼图海报生成完成。');
    await expect(page.locator('#adv_collage_canvas')).toHaveJSProperty('width', 960);

    await clearDownloads(page);
    await page.locator('#adv_collage_download').click();
    await expect.poll(async () => (await readDownloads(page)).some((item) => item.download === 'collage-poster.png')).toBe(true);
  });
});