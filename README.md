# IPlay

<p align="center">
	<img src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:4f46e5,50:0ea5e9,100:14b8a6&text=IPlay&fontColor=ffffff&fontSize=64&desc=Local-First%20Image%20Lab&descAlignY=68&animation=fadeIn" alt="IPlay Banner" />
</p>

<p align="center">
	<a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-111827.svg?style=for-the-badge" alt="MIT" /></a>
	<img src="https://img.shields.io/badge/Runtime-Browser%20Only-0f766e.svg?style=for-the-badge" alt="Browser Only" />
	<img src="https://img.shields.io/badge/Privacy-Local%20Processing-1d4ed8.svg?style=for-the-badge" alt="Local Processing" />
	<img src="https://img.shields.io/badge/Tested%20With-Playwright-7c3aed.svg?style=for-the-badge" alt="Playwright" />
</p>

<p align="center">
	<a href="https://github.com/Geekmister/IPlay/stargazers"><img src="https://img.shields.io/github/stars/Geekmister/IPlay?style=flat-square&label=Stars&color=f59e0b" alt="GitHub Stars" /></a>
	<a href="https://github.com/Geekmister/IPlay/network/members"><img src="https://img.shields.io/github/forks/Geekmister/IPlay?style=flat-square&label=Forks&color=0ea5e9" alt="GitHub Forks" /></a>
	<a href="https://github.com/Geekmister/IPlay/issues"><img src="https://img.shields.io/github/issues/Geekmister/IPlay?style=flat-square&label=Issues&color=ef4444" alt="GitHub Issues" /></a>
	<a href="https://github.com/Geekmister/IPlay/commits"><img src="https://img.shields.io/github/last-commit/Geekmister/IPlay?style=flat-square&label=Last%20Commit&color=22c55e" alt="Last Commit" /></a>
	<img src="https://visitor-badge.laobi.icu/badge?page_id=Geekmister.IPlay" alt="Visitors" />
	<a href="https://github.com/Geekmister/IPlay/releases"><img src="https://img.shields.io/github/downloads/Geekmister/IPlay/total?style=flat-square&label=Downloads&color=8b5cf6" alt="Downloads" /></a>
</p>

<p align="center">
	一个纯前端、本地运行的图像工具箱。<br/>
	不上传图片，不依赖后端，把高频图像任务做成可快速上手的任务入口。
</p>

---

## 实时趋势看板

<p align="center">
	<a href="https://star-history.com/#Geekmister/IPlay&Date">
		<img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Geekmister/IPlay&type=Date" />
	</a>
</p>

<p align="center">
	<img alt="Commit Activity Graph" src="https://github-readme-activity-graph.vercel.app/graph?username=Geekmister&bg_color=ffffff&color=1f2937&line=4f46e5&point=06b6d4&area=true&hide_border=true" />
</p>

<p align="center">
	<a href="https://github.com/Geekmister/IPlay/graphs/contributors"><img src="https://contrib.rocks/image?repo=Geekmister/IPlay" alt="Contributors" /></a>
</p>

> 上面两块是动态数据：Stars 曲线会自动更新，贡献者头像也会随提交变化。

---

## 为什么它看起来不一样

IPlay 不是把功能堆进一个下拉框，而是按用户意图拆模块：

1. 我想先看清这张图的信息
2. 我想马上做基础编辑
3. 我想去掉干扰元素
4. 我想做人像处理
5. 我想做批量、OCR、PDF 这类流程型任务

这种信息架构让新人第一次打开就能找到正确入口。

---

## 视觉预览

<p align="center">
	<img width="1200" alt="IPlay Preview" src="https://github.com/user-attachments/assets/134617d4-fbe9-42da-80f8-c603b8ebba60" />
</p>

> 可以在这里继续补充你录制的操作动画，建议每段 8 到 20 秒。

### 模块演示宫格

> 下面是可直接执行的拍摄脚本模板。你只要替换每块里的动图链接即可。

| 模块 | 演示与拍摄脚本 |
| --- | --- |
| 图片信息 | <img src="https://dummyimage.com/720x420/e2e8f0/334155&text=Image+Info+Demo+GIF" alt="Image Info Demo" /><br/>标题：图片信息一键总览<br/>建议时长：12s<br/>步骤：1 上传图片 2 展示 EXIF/GPS/哈希 3 导出 JSON |
| AI 去水印 | <img src="https://dummyimage.com/720x420/e0e7ff/3730a3&text=Watermark+Removal+Demo+GIF" alt="Watermark Demo" /><br/>标题：框选即处理的去水印体验<br/>建议时长：14s<br/>步骤：1 上传图片 2 框选水印区域 3 执行并下载结果 |
| 图片编辑 | <img src="https://dummyimage.com/720x420/d1fae5/065f46&text=Editor+Demo+GIF" alt="Editor Demo" /><br/>标题：旋转 裁剪 压缩一条龙<br/>建议时长：15s<br/>步骤：1 上传图片 2 旋转并裁剪 3 压缩导出 |
| AI 换脸 | <img src="https://dummyimage.com/720x420/fee2e2/991b1b&text=Face+Swap+Demo+GIF" alt="Face Demo" /><br/>标题：本地预览的人像合成<br/>建议时长：16s<br/>步骤：1 上传源脸和目标图 2 调节尺寸融合羽化 3 生成并下载 |
| OCR / 隐私 | <img src="https://dummyimage.com/720x420/fef3c7/92400e&text=OCR+Privacy+Demo+GIF" alt="OCR Privacy Demo" /><br/>标题：识别文字与隐私保护联动<br/>建议时长：14s<br/>步骤：1 上传图片 2 OCR 识别或翻译 3 自动隐私马赛克 |
| 批量 / PDF 工作流 | <img src="https://dummyimage.com/720x420/f3e8ff/6b21a8&text=Batch+PDF+Workflow+Demo+GIF" alt="Batch PDF Demo" /><br/>标题：批量输出与文档转换
<br/>建议时长：18s<br/>步骤：1 批量图片加水印 2 生成拼图海报 3 图像转 PDF 与 PDF 转图片 |

录制小建议：

1. 每段开头 0.5 秒静止，结尾 0.5 秒静止
2. 关键点击加缩放和高亮圈，鼠标路径尽量短
3. 文案只保留动词，避免字幕过长

---

## 功能矩阵

| 模块 | 典型任务 | 当前能力 |
| --- | --- | --- |
| 图片信息 | 元数据查看、摘要分享 | EXIF/GPS/哈希、复制、JSON 导出、脱敏导出 |
| 图片编辑 | 高频基础编辑 | 旋转、裁剪、压缩、缩放拖拽、撤销/重做 |
| AI 去水印 | 干扰区域清理 | 上传、框选、处理、下载 |
| AI 换脸 | 本地人像合成 | 双图上传、融合参数、拖拽微调、导出 |
| 高级工作台 | 创作与流程任务 | 抠图、修复、OCR、隐私、批处理、拼图、图像/PDF 工作流 |

---

## 高级工作台分组

1. 人像与创作：抠图、证件照、人像美化、风格化、表情包
2. 修复与增强：老照片修复、物体移除、扩图、清晰增强、LUT
3. 识别与隐私：OCR、翻译、隐私保护
4. 批量与输出：批量水印、拼图海报、图像转 PDF、PDF 转图片

---

## 快速开始

### 方式 A：直接打开

直接在浏览器打开 index.html 即可体验。

### 方式 B：本地服务（推荐）

```bash
python3 -m http.server 4173
```

然后访问：

```text
http://127.0.0.1:4173
```

---

## 自动化测试

项目已接入 Playwright 端到端回归。

```bash
npm install
npx playwright install chromium
npm test
```

常用命令：

```bash
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
```

当前 E2E 覆盖：

1. 自动主题（日出日落）
2. 图片信息上传与元数据展示
3. AI 去水印上传、框选与处理
4. 图片编辑旋转、撤销/重做
5. 高级工作台 OCR
6. AI 换脸授权校验与预览输出
7. 批量压缩/水印、图像转 PDF、PDF 转图片
8. 物体移除、隐私保护、拼图海报

---

## CI 持续回归

GitHub Actions 工作流：.github/workflows/e2e.yml

触发条件：

1. 推送到 main 或 master
2. 所有 Pull Request

执行流程：

1. npm ci
2. 安装 Playwright Chromium
3. 执行 npm test

失败时自动上传测试工件，便于回放定位。

---

## 项目结构

```text
.
├── index.html
├── assets/
│   ├── css/main.css
│   └── js/app.js
├── tests/app.spec.js
├── playwright.config.cjs
└── .github/workflows/e2e.yml
```

---

## 路线图

下一阶段建议：

1. 标注工具（文字、箭头、矩形）
2. 前后对比滑杆
3. 更多快捷键与历史快照
4. 更强的批处理模板

## 还能再酷一点

如果你还想把 README 再往发布页风格推进，下一步建议：

1. 用真实 GIF 替换演示宫格占位图，并统一 12 到 16 秒节奏
2. 增加「30 秒快速上手」目录锚点，降低新访客跳出率
3. 增加「性能与隐私」基准小节，比如本地处理、离线可用、无上传
4. 增加「常见问题」折叠区，减少重复 issue
5. 增加发布日志入口，和 Releases 联动

---

## 许可证

MIT License，详见 LICENSE。