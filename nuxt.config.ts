import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'node:path';

export default defineNuxtConfig({
  ssr: true,
  ignore: ['IPlay-backup/**', 'IPlay-backup'],
  modules: ['@nuxtjs/i18n', '@nuxt/ui'],
  i18n: {
    defaultLocale: 'zh',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'zh', iso: 'zh-CN', name: '简体中文', file: 'zh-CN.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en-US.json' },
      { code: 'ja', iso: 'ja-JP', name: '日本語', file: 'ja-JP.json' },
      { code: 'ko', iso: 'ko-KR', name: '한국어', file: 'ko-KR.json' },
      { code: 'zh-tw', iso: 'zh-TW', name: '繁體中文', file: 'zh-TW.json' },
    ],
    lazy: true,
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false,
      fallbackLocale: 'zh',
    },
    vueI18n: './i18n.config.ts',
  },
  css: ['@/assets/css/main.css'],
  vite: {
    resolve: {
      alias: {
        '#imports': resolve(process.cwd(), '.nuxt/imports.mjs'),
      },
    },
    ssr: {
      noExternal: ['@nuxt/ui', '@nuxt/ui/composables', '@vueuse/core'],
    },
    optimizeDeps: {
      include: [
        '@nuxt/ui',
        '@nuxt/ui/composables',
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@vueuse/core',
      ],
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN',
      },
      title: '图像 AI 趣玩工具箱 - 本地处理不上传',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          hid: 'description',
          name: 'description',
          content:
            'IPlay 图像 AI 工具箱，纯前端本地运行，支持图片信息、编辑、去水印、换脸、OCR 和 PDF 输出。',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css',
        },
      ],
      script: [
        {
          src: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.16.3/dist/ort.min.js',
          tagPosition: 'bodyClose',
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/ffmpeg.min.js@0.12.6/dist/ffmpeg.min.js',
          tagPosition: 'bodyClose',
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.0/dist/tesseract.min.js',
          tagPosition: 'bodyClose',
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
          tagPosition: 'bodyClose',
        },
        { src: 'https://cdn.jsdelivr.net/npm/exif-js', tagPosition: 'bodyClose' },
        { src: '/js/app.js', tagPosition: 'bodyClose' },
      ],
    },
  },
});
