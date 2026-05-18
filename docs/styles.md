
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
