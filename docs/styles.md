# IPlay 全局视觉样式规范

## 品牌色与渐变
- 主色：`#6366f1`
- 主色纯色：`#6366f1`
- 渐变 1：`linear-gradient(135deg, #6366f1, #8b5cf6)`
- VIP 渐变：`linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)`
- 强调色：`#4f46e5`, `#0f766e`, `#ea580c`

## 文字与基础排版
- 基础字体颜色（亮色）：`#111827`
- 次要文本（亮色）：`#6b7280`
- 亮色背景文字：`#ffffff`
- 深色模式基础文字：`#e5e7eb`
- 主要标题：`font-size: clamp(1.7rem, 4vw, 2.8rem)`，`font-weight: 700`
- 文本行高：`1.5`，段落间距适度分隔

## 卡片与面板
- 卡片背景：`#ffffff`
- 卡片暗色背景：`#1f2937`
- 卡片圆角：`1rem`
- 卡片阴影：`0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)`
- 边框：`1px solid #e5e7eb` / 暗色模式 `#374151`

## 按钮样式
- 基础按钮圆角：`0.75rem`
- 主按钮背景：`linear-gradient(135deg, #6366f1, #8b5cf6)`，白色文字
- VIP 按钮背景：`linear-gradient(135deg, #f59e0b, #ef4444, #ec4899)`，白色文字
- 次级按钮背景：`#f3f4f6`，深色模式 `#1f2937`
- 悬停态：`opacity: 0.95`

## 文本渐变与强调
- 核心标题强调：
  - `background: linear-gradient(135deg, #4f46e5 0%, #0f766e 45%, #ea580c 100%)`
  - `background-clip: text; color: transparent`

## 布局与网格
- 主导航卡片：5 列自适应布局，响应式间距
- 图形卡片：最小高度 `104px`
- 数据卡块：四列网格、二列网格用于信息展示
- 高级工作区：使用 `grid` 和 `flex` 混合布局，保证桌面与移动端一致

## 表单与输入控件
- 输入框和选择框：圆角 `1rem`，淡灰边框
- 滑块：使用主色强调轨道与刻度
- 颜色选择控件：统一 `10px` 高度边框圆角

## 视觉交互提示
- 活动卡片边界：`border-color: #6366f1`，背景渐变透明
- 鼠标悬停：`transform: translateY(-1px)`，柔和阴影
- `btn-guide-pulse`：引导按钮使用轻微动画与渐变高亮

## 暗黑模式
- 背景：`#111827` / `#1f2937`
- 面板：`rgba(255,255,255,0.08)` 或 `#111827`
- 次要文本：`#9ca3af` / `#d1d5db`
- 边框：`#374151`

## 视觉原则
- 保持高对比、低噪点、柔和阴影
- 使用圆角与渐变营造现代应用感
- 卡片间距一致，元素分层明确
- 内容区与控制区视觉分离，保持界面整洁

## 比对与注意事项 (IPlay-backup ↔ 当前项目)

- CSS 对比：`assets/css/main.css` 与备份的样式基本一致，当前项目在文件顶部额外增加了全局重置和若干 CSS 变量（`--color-primary-*`），用于覆盖或对齐 Nuxt / UI 组件的主题色。该改动是刻意的，以保证主色在不同组件库下的一致性。
- Content Center 链接：导航栏已新增 `nav_content_center` 占位按钮（`id="nav_content_center"`），href 暂设为 `javascript:void(0)`，`public/js/app.js` 中会在运行时设置实际带有 `theme` 与 `lang` 参数的链接（例如 `content/index.html?theme=light&lang=en`）。
- SSR/Hydration 注意：由于 `app.js` 会在客户端修改导航链接与部分 DOM 状态，可能导致服务器渲染与客户端首次渲染（hydration）出现轻微不匹配警告。建议：
  - 保留占位 href（`javascript:void(0)`）或使用服务端可推断的占位值，避免服务端渲染时与客户端动态覆盖产生属性不一致。
  - 将会在文档中记录哪些 DOM 由运行时代码（`public/js/app.js`）控制，以便后续迁移或 SSR 优化。

## 建议补充条目（已在代码中实现或需确认）
- 将 `assets/css/main.css` 顶部的全局 reset 与 `:root` 变量纳入样式规范（已在本文件开头推荐）。
- 记录 `toast`、`upload-box` 等交互组件的动画与可见状态（已在样式文件内定义），以便视觉回归测试时作为断言点。

如果你同意，我可以把这些变更加入到 `docs/styles.md` 的版本控制（已准备好提交）。
