import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { compile, run } from '@mdx-js/mdx';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as jsxRuntime from 'react/jsx-runtime';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'content-src', 'posts');
const outputDir = path.join(rootDir, 'content');

function escapeHtml(text = '') {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toIsoDate(value) {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString();
  return date.toISOString();
}

function toDisplayDate(value) {
  const iso = toIsoDate(value);
  return iso.slice(0, 10);
}

function estimateReadMinutes(markdown = '') {
  const plain = String(markdown)
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[\[\]()*_>#\-!]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const units = plain.length;
  return Math.max(1, Math.round(units / 450));
}

function parseLocalizedSlug(slug) {
  if (slug.endsWith('-en')) return { baseSlug: slug.slice(0, -3), lang: 'en' };
  if (slug.endsWith('-zh')) return { baseSlug: slug.slice(0, -3), lang: 'zh' };
  return { baseSlug: slug, lang: 'zh' };
}

function renderHtmlPage({ title, description, body, lang = 'zh-CN', date, readMinutes, category, tags = [], slug, pageLang = 'zh', alternateSlug = '' }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCategory = escapeHtml(category || '教程');
  const safeDate = escapeHtml(toDisplayDate(date));
  const safeRead = escapeHtml(String(readMinutes || 1));
  const tagHtml = tags.length
    ? tags.slice(0, 4).map((tag) => `<span class="meta-pill">#${escapeHtml(tag)}</span>`).join('')
    : '<span class="meta-pill">#IPlay</span>';
  const zhHref = pageLang === 'zh' ? `./${escapeHtml(slug)}.html?lang=zh` : (alternateSlug ? `./${escapeHtml(alternateSlug)}.html?lang=zh` : `./${escapeHtml(slug)}.html?lang=zh`);
  const enHref = pageLang === 'en' ? `./${escapeHtml(slug)}.html?lang=en` : (alternateSlug ? `./${escapeHtml(alternateSlug)}.html?lang=en` : `./${escapeHtml(slug)}.html?lang=en`);
  const zhClass = pageLang === 'zh' ? 'lang-link is-active' : 'lang-link';
  const enClass = pageLang === 'en' ? 'lang-link is-active' : 'lang-link';
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${safeTitle}</title>
<meta name="description" content="${safeDescription}"/>
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"/>
<style>
  :root {
    color-scheme: light dark;
    --bg: #f8fafc;
    --card: #ffffff;
    --text: #0f172a;
    --muted: #475569;
    --line: #e2e8f0;
    --brand: #2563eb;
    --pill-bg: #ffffff;
    --pill-border: #cbd5e1;
  }
  html.dark {
    --bg: #0f172a;
    --card: #111827;
    --text: #e2e8f0;
    --muted: #94a3b8;
    --line: #334155;
    --brand: #93c5fd;
    --pill-bg: #1e293b;
    --pill-border: #475569;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Source Han Sans SC", "Noto Sans SC", "PingFang SC", sans-serif;
    color: var(--text);
    background:
      radial-gradient(circle at 10% -10%, rgba(59, 130, 246, 0.22), transparent 35%),
      var(--bg);
    line-height: 1.75;
  }
  .wrap {
    max-width: 860px;
    margin: 0 auto;
    padding: 40px 20px 72px;
  }
  .hero {
    margin-bottom: 14px;
    border: 1px solid var(--line);
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(14, 165, 233, 0.08));
    padding: 18px;
  }
  html.dark .hero {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.20), rgba(14, 165, 233, 0.12));
  }
  .hero-title {
    margin: 0;
    font-size: clamp(1.25rem, 2.6vw, 1.9rem);
    line-height: 1.35;
  }
  .hero-desc {
    margin: 8px 0 0;
    color: var(--muted);
    font-size: .96rem;
  }
  .meta-row {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1px solid var(--pill-border);
    background: var(--pill-bg);
    border-radius: 999px;
    padding: 5px 10px;
    color: var(--muted);
    font-size: .82rem;
  }
  .paper-switch {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: 8px 0 14px;
  }
  .paper-switch button {
    border: 1px solid var(--pill-border);
    background: var(--pill-bg);
    color: var(--muted);
    border-radius: 999px;
    padding: 6px 12px;
    cursor: pointer;
  }
  .paper-switch button.active {
    background: #4f46e5;
    border-color: #4f46e5;
    color: #fff;
  }
  .paper-lang { display: none; }
  .paper-lang.active { display: block; }
  .paper-media-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }
  .paper-media-grid img,
  .paper-media-grid video {
    width: 100%;
    border-radius: 12px;
    border: 1px solid var(--line);
  }
  .pulse-line {
    height: 8px;
    border-radius: 999px;
    background: #e2e8f0;
    overflow: hidden;
    margin: 14px 0;
  }
  html.dark .pulse-line { background: #334155; }
  .pulse-line span {
    display: block;
    height: 100%;
    width: 35%;
    background: linear-gradient(90deg, #6366f1, #0ea5e9);
    animation: pulseMove 2s ease-in-out infinite;
  }
  @keyframes pulseMove {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }
  .topbar-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .crumb {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: var(--muted);
    text-decoration: none;
    padding: 7px 12px;
    border-radius: 999px;
    border: 1px solid var(--pill-border);
    background: var(--pill-bg);
  }
  .theme-btn {
    border: 1px solid var(--pill-border);
    background: var(--pill-bg);
    color: var(--muted);
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 14px;
    cursor: pointer;
  }
  .lang-link {
    border: 1px solid var(--pill-border);
    background: var(--pill-bg);
    color: var(--muted);
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 14px;
    text-decoration: none;
  }
  .lang-link.is-active {
    background: #4f46e5;
    border-color: #4f46e5;
    color: #fff;
  }
  .card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: 18px;
    padding: 28px;
    box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
  }
  h1, h2, h3 { line-height: 1.3; }
  h1 { margin-top: 0; font-size: clamp(1.6rem, 3vw, 2.2rem); }
  h2 { margin-top: 1.8em; }
  p code, li code {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    padding: 2px 6px;
    color: #1e293b;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: .95em;
  }
  html.dark p code,
  html.dark li code {
    background: #1e293b;
    border-color: #334155;
    color: #dbeafe;
  }
  pre {
    background: #0f172a;
    color: #e2e8f0;
    border-radius: 12px;
    overflow-x: auto;
    padding: 14px 16px;
  }
  a { color: var(--brand); }
</style>
</head>
<body>
  <main class="wrap">
    <section class="topbar">
      <a class="crumb" href="./index.html">← 返回内容中心</a>
      <span class="topbar-actions">
        <a class="${zhClass}" href="${zhHref}">中文</a>
        <a class="${enClass}" href="${enHref}">English</a>
        <a class="crumb" href="../index.html">工具首页</a>
        <button id="themeToggle" class="theme-btn" type="button">切换主题</button>
      </span>
    </section>
    <section class="hero">
      <h1 class="hero-title">${safeTitle}</h1>
      <p class="hero-desc">${safeDescription}</p>
      <div class="meta-row">
        <span class="meta-pill">分类 ${safeCategory}</span>
        <span class="meta-pill">发布日期 ${safeDate}</span>
        <span class="meta-pill">预计阅读 ${safeRead} 分钟</span>
        ${tagHtml}
      </div>
    </section>
    <article class="card">${body}</article>
  </main>
  <script>
    (function () {
      var key = 'iplay_content_theme';
      var langKey = 'iplay_lang';
      var root = document.documentElement;
      var pageLang = '${pageLang}';
      var alternateSlug = '${alternateSlug}';
      var queryTheme = new URLSearchParams(location.search).get('theme');
      var queryLang = new URLSearchParams(location.search).get('lang');
      var preferredLang = (queryLang === 'zh' || queryLang === 'en') ? queryLang : localStorage.getItem(langKey);
      if (!preferredLang) preferredLang = pageLang;
      if (preferredLang !== pageLang && alternateSlug) {
        var redirectTarget = './' + alternateSlug + '.html?lang=' + preferredLang;
        if (queryTheme === 'dark' || queryTheme === 'light') {
          redirectTarget += '&theme=' + queryTheme;
        }
        location.replace(redirectTarget);
        return;
      }
      localStorage.setItem(langKey, pageLang);
      var saved = localStorage.getItem(key);
      if (queryTheme === 'dark' || queryTheme === 'light') {
        root.classList.toggle('dark', queryTheme === 'dark');
        localStorage.setItem(key, queryTheme);
      } else if (saved === 'dark' || saved === 'light') {
        root.classList.toggle('dark', saved === 'dark');
      } else {
        root.classList.toggle('dark', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
      var btn = document.getElementById('themeToggle');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var nextIsDark = !root.classList.contains('dark');
        root.classList.toggle('dark', nextIsDark);
        localStorage.setItem(key, nextIsDark ? 'dark' : 'light');
      });

      document.querySelectorAll('.paper-root').forEach(function (article) {
        var btns = article.querySelectorAll('[data-paper-lang-btn]');
        var blocks = article.querySelectorAll('[data-paper-lang]');
        if (!btns.length || !blocks.length) return;
        function setLang(lang) {
          btns.forEach(function (button) {
            button.classList.toggle('active', button.getAttribute('data-paper-lang-btn') === lang);
          });
          blocks.forEach(function (block) {
            block.classList.toggle('active', block.getAttribute('data-paper-lang') === lang);
          });
        }
        btns.forEach(function (button) {
          button.addEventListener('click', function () {
            setLang(button.getAttribute('data-paper-lang-btn'));
          });
        });
        setLang('zh');
      });
    })();
  </script>
</body>
</html>`;
}

async function getMdxFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getMdxFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && fullPath.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  return files;
}

async function compileMdxToHtml(source) {
  const compiled = await compile(source, {
    outputFormat: 'function-body',
    development: false,
  });
  const module = await run(String(compiled), {
    ...jsxRuntime,
    baseUrl: import.meta.url,
  });
  const Content = module.default;
  return renderToStaticMarkup(React.createElement(Content));
}

async function build() {
  await fs.mkdir(outputDir, { recursive: true });
  const oldOutputFiles = await fs.readdir(outputDir, { withFileTypes: true });
  for (const entry of oldOutputFiles) {
    if (entry.isFile() && entry.name.endsWith('.html')) {
      await fs.rm(path.join(outputDir, entry.name));
    }
  }

  const mdxFiles = await getMdxFiles(sourceDir);
  if (!mdxFiles.length) {
    console.log('No MDX files found in content-src/posts');
    return;
  }

  const entries = [];

  for (const filePath of mdxFiles) {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(raw);

    const slug = path.basename(filePath, '.mdx');
    const { baseSlug, lang } = parseLocalizedSlug(slug);
    const title = data.title || slug;
    const description = data.description || 'IPlay 内容文章';
    const publishedDate = toIsoDate(data.date);
    const readMinutes = Number(data.readTime) || estimateReadMinutes(content);
    const category = data.category ? String(data.category) : '教程';
    const tags = Array.isArray(data.tags) ? data.tags.map((item) => String(item)) : [];
    const htmlBody = await compileMdxToHtml(content);
    entries.push({
      slug,
      baseSlug,
      lang,
      title,
      description,
      body: htmlBody,
      htmlLang: data.lang || (lang === 'en' ? 'en' : 'zh-CN'),
      date: publishedDate,
      readMinutes,
      category,
      tags,
    });
  }

  const pairMap = new Map();
  entries.forEach((entry) => {
    if (!pairMap.has(entry.baseSlug)) pairMap.set(entry.baseSlug, { zh: '', en: '' });
    const pair = pairMap.get(entry.baseSlug);
    pair[entry.lang] = entry.slug;
  });

  for (const entry of entries) {
    const pair = pairMap.get(entry.baseSlug) || { zh: '', en: '' };
    const alternateSlug = entry.lang === 'zh' ? pair.en : pair.zh;
    const pageHtml = renderHtmlPage({
      title: entry.title,
      description: entry.description,
      body: entry.body,
      lang: entry.htmlLang,
      date: entry.date,
      readMinutes: entry.readMinutes,
      category: entry.category,
      tags: entry.tags,
      slug: entry.slug,
      pageLang: entry.lang,
      alternateSlug,
    });
    const outputFile = path.join(outputDir, `${entry.slug}.html`);
    await fs.writeFile(outputFile, pageHtml, 'utf8');
  }

  const indexItems = entries.slice();

  indexItems.sort((a, b) => (a.date < b.date ? 1 : -1));

  const featuredAssigned = { zh: false, en: false };

  const listHtml = indexItems
    .map((item) => {
      const dateLabel = new Date(item.date).toISOString().slice(0, 10);
      const tagPart = Array.isArray(item.tags) && item.tags.length
        ? item.tags.slice(0, 2).map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`).join('')
        : '<span class="tag">#IPlay</span>';
      const shouldFeature = !featuredAssigned[item.lang];
      featuredAssigned[item.lang] = true;
      const cardClass = shouldFeature ? 'post-card is-featured' : 'post-card';
      return `<li class="${cardClass}" data-lang="${item.lang}"><a class="post-link" href="./${escapeHtml(item.slug)}.html?lang=${item.lang}"><div class="post-head"><span class="cat">${escapeHtml(item.category || '教程')}</span><span class="meta">${escapeHtml(dateLabel)} · ${escapeHtml(String(item.readMinutes || 1))} 分钟阅读</span></div><p class="post-title">${escapeHtml(item.title)}</p><p class="post-desc">${escapeHtml(item.description)}</p><div class="tags">${tagPart}</div></a></li>`;
    })
    .join('');

  const indexHtml = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>IPlay 内容中心</title>
<link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"/>
<style>
  :root {
    color-scheme: light dark;
    --bg: #f8fafc;
    --surface: #ffffff;
    --line: #e2e8f0;
    --text: #0f172a;
    --muted: #475569;
    --brand: #4f46e5;
    --brand-soft: #eef2ff;
    --brand-strong: #4338ca;
    --topbar-bg: rgba(255, 255, 255, 0.72);
    --crumb-bg: #ffffff;
    --crumb-border: #cbd5e1;
    --hero-bg: linear-gradient(135deg, #ffffff 0%, #f8fbff 42%, #eef2ff 100%);
    --hero-border: #dbe3ff;
  }
  html.dark {
    --bg: #0f172a;
    --surface: #111827;
    --line: #334155;
    --text: #e2e8f0;
    --muted: #94a3b8;
    --brand: #a5b4fc;
    --brand-soft: rgba(79, 70, 229, 0.22);
    --brand-strong: #c7d2fe;
    --topbar-bg: rgba(15, 23, 42, 0.75);
    --crumb-bg: #1e293b;
    --crumb-border: #475569;
    --hero-bg: linear-gradient(135deg, #111827 0%, #172554 48%, #1e1b4b 100%);
    --hero-border: #334155;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: "Source Han Sans SC", "Noto Sans SC", "PingFang SC", sans-serif;
    background:
      radial-gradient(900px 500px at -10% -10%, rgba(99, 102, 241, 0.20), transparent 60%),
      radial-gradient(700px 420px at 110% 0%, rgba(14, 165, 233, 0.18), transparent 62%),
      var(--bg);
    color: var(--text);
    line-height: 1.7;
  }
  .page {
    max-width: 980px;
    margin: 0 auto;
    padding: 34px 18px 72px;
  }
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
    padding: 12px 14px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--topbar-bg);
    backdrop-filter: blur(8px);
  }
  .topbar-actions {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    color: var(--brand-strong);
  }
  .crumb {
    color: var(--muted);
    text-decoration: none;
    font-size: 14px;
    padding: 7px 12px;
    border-radius: 999px;
    border: 1px solid var(--crumb-border);
    background: var(--crumb-bg);
  }
  .theme-btn {
    border: 1px solid var(--crumb-border);
    background: var(--crumb-bg);
    color: var(--muted);
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 14px;
    cursor: pointer;
  }
  .hero {
    background: var(--hero-bg);
    border: 1px solid var(--hero-border);
    border-radius: 22px;
    padding: 24px;
    box-shadow: 0 18px 42px rgba(79, 70, 229, 0.10);
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
  .hero::after {
    content: "";
    position: absolute;
    right: -80px;
    top: -80px;
    width: 240px;
    height: 240px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.28), transparent 68%);
    pointer-events: none;
  }
  .hero h1 {
    margin: 0;
    font-size: clamp(1.5rem, 2.8vw, 2.05rem);
  }
  .hero p {
    margin: 10px 0 0;
    color: var(--muted);
  }
  .lang-switch {
    margin-top: 14px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    border-radius: 999px;
    border: 1px solid var(--crumb-border);
    background: var(--crumb-bg);
  }
  .lang-switch-btn {
    border: 0;
    background: transparent;
    color: var(--muted);
    border-radius: 999px;
    padding: 7px 12px;
    font-size: 13px;
    cursor: pointer;
  }
  .lang-switch-btn.is-active {
    background: #4f46e5;
    color: #fff;
  }
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 14px;
  }
  @media (min-width: 860px) {
    .list {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  .list li {
    border: 1px solid var(--line);
    border-radius: 18px;
    background: var(--surface);
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
    transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  }
  .list li:hover {
    transform: translateY(-2px);
    border-color: #c7d2fe;
    box-shadow: 0 16px 34px rgba(79, 70, 229, 0.12);
  }
  .post-card {
    position: relative;
    overflow: hidden;
  }
  .post-card::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: linear-gradient(180deg, #6366f1, #0ea5e9);
    opacity: .72;
  }
  .post-card.is-featured {
    grid-column: 1 / -1;
    background:
      linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(14, 165, 233, 0.08)),
      var(--surface);
    border-color: #c7d2fe;
  }
  .post-card.is-featured .post-link {
    padding: 20px 20px 22px 22px;
  }
  .post-card.is-featured .post-title {
    font-size: 1.18rem;
  }
  .post-link {
    display: block;
    padding: 18px;
    text-decoration: none;
    color: inherit;
  }
  .post-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }
  .cat {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    background: rgba(79, 70, 229, 0.12);
    color: var(--brand-strong);
    font-size: .78rem;
    font-weight: 700;
    border: 1px solid rgba(79, 70, 229, 0.18);
  }
  .post-title {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    font-weight: 700;
    color: var(--text);
    margin: 0;
    font-size: 1.05rem;
  }
  .post-title::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: linear-gradient(135deg, #6366f1, #0ea5e9);
    flex: 0 0 auto;
  }
  .post-desc {
    margin: 8px 0 0;
    color: var(--muted);
    font-size: .95rem;
  }
  .meta {
    color: var(--muted);
    font-size: .8rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 0;
    border-radius: 999px;
    padding: 0;
  }
  .tags {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .tag {
    display: inline-flex;
    align-items: center;
    border: 1px solid var(--crumb-border);
    background: var(--crumb-bg);
    border-radius: 999px;
    padding: 3px 9px;
    color: var(--muted);
    font-size: .78rem;
  }
  .empty {
    border: 1px dashed var(--crumb-border);
    border-radius: 14px;
    background: var(--topbar-bg);
    color: var(--muted);
    padding: 16px;
  }
</style>
</head>
<body>
  <main class="page">
    <section class="topbar">
      <span class="brand">IPlay · 内容中心</span>
      <span class="topbar-actions">
        <a class="crumb" href="../index.html">返回工具首页</a>
        <button id="themeToggle" class="theme-btn" type="button">切换主题</button>
      </span>
    </section>
    <section class="hero">
      <h1>内容中心（MDX）</h1>
      <p>与当前工具站风格统一的内容层，支持教程、案例和 FAQ 的持续发布。文章卡片显示分类、阅读时长与标签信息，便于检索和运营。</p>
      <div class="lang-switch">
        <button class="lang-switch-btn" data-lang-switch="zh" type="button">中文</button>
        <button class="lang-switch-btn" data-lang-switch="en" type="button">English</button>
      </div>
    </section>
    <ul class="list">${listHtml || '<li class="empty">暂无文章，请先在 content-src/posts 下创建 .mdx 文件。</li>'}</ul>
  </main>
  <script>
    (function () {
      var key = 'iplay_content_theme';
      var langKey = 'iplay_lang';
      var root = document.documentElement;
      var queryTheme = new URLSearchParams(location.search).get('theme');
      var queryLang = new URLSearchParams(location.search).get('lang');
      var saved = localStorage.getItem(key);
      if (queryTheme === 'dark' || queryTheme === 'light') {
        root.classList.toggle('dark', queryTheme === 'dark');
        localStorage.setItem(key, queryTheme);
      } else if (saved === 'dark' || saved === 'light') {
        root.classList.toggle('dark', saved === 'dark');
      } else {
        root.classList.toggle('dark', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
      var btn = document.getElementById('themeToggle');
      var langButtons = Array.prototype.slice.call(document.querySelectorAll('[data-lang-switch]'));
      var cards = Array.prototype.slice.call(document.querySelectorAll('.post-card[data-lang]'));

      function syncCardLinks() {
        var theme = root.classList.contains('dark') ? 'dark' : 'light';
        var activeLang = localStorage.getItem(langKey) === 'en' ? 'en' : 'zh';
        cards.forEach(function (card) {
          var link = card.querySelector('a.post-link');
          if (!link) return;
          var url = new URL(link.getAttribute('href'), location.href);
          url.searchParams.set('lang', activeLang);
          url.searchParams.set('theme', theme);
          link.setAttribute('href', './' + url.pathname.split('/').pop() + '?' + url.searchParams.toString());
        });
      }

      function applyLang(lang) {
        var target = lang === 'en' ? 'en' : 'zh';
        localStorage.setItem(langKey, target);
        langButtons.forEach(function (button) {
          button.classList.toggle('is-active', button.getAttribute('data-lang-switch') === target);
        });
        cards.forEach(function (card) {
          card.style.display = card.getAttribute('data-lang') === target ? '' : 'none';
        });
        syncCardLinks();
      }

      langButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          applyLang(button.getAttribute('data-lang-switch'));
        });
      });

      var initialLang = (queryLang === 'en' || queryLang === 'zh') ? queryLang : (localStorage.getItem(langKey) === 'en' ? 'en' : 'zh');
      applyLang(initialLang);

      if (btn) {
        btn.addEventListener('click', function () {
          var nextIsDark = !root.classList.contains('dark');
          root.classList.toggle('dark', nextIsDark);
          localStorage.setItem(key, nextIsDark ? 'dark' : 'light');
          syncCardLinks();
        });
      }
    })();
  </script>
</body>
</html>`;

  await fs.writeFile(path.join(outputDir, 'index.html'), indexHtml, 'utf8');
  console.log(`Built ${indexItems.length} MDX page(s) into /content`);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
