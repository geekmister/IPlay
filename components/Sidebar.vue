<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="/favicon.svg" alt="logo" class="sidebar-logo" />
      <h1 class="sidebar-title">IPlay</h1>
    </div>
    <nav class="sidebar-menu">
      <ul>
        <li><a href="#">图片信息</a></li>
        <li><a href="#">图片编辑</a></li>
        <li><a href="#">AI 去水印</a></li>
        <li><a href="#">AI 换脸</a></li>
        <li><a href="#">人像与创作</a></li>
        <li><a href="#">修复与增强</a></li>
        <li><a href="#">识别与隐私</a></li>
        <li><a href="#">批量与输出</a></li>
        <li><a href="#">高级玩法</a></li>
      </ul>
    </nav>
    <footer class="sidebar-footer">
      <small>© 2026 IPlay</small>
    </footer>
  </aside>
</template>

<script setup>
// 纯 JS，无依赖
</script>

<style scoped>
.sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #eee;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 16px 12px 16px;
}
.sidebar-logo {
  width: 32px;
  height: 32px;
}
.sidebar-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0;
}
.sidebar-menu {
  flex: 1;
  padding: 0 0 0 0;
}
.sidebar-menu ul {
  list-style: none;
  margin: 0;
  padding: 0 0 0 0;
}
.sidebar-menu li {
  margin: 0;
}
.sidebar-menu a {
  display: block;
  padding: 12px 24px;
  color: #222;
  text-decoration: none;
  border-left: 4px solid transparent;
  transition: background 0.2s, border-color 0.2s;
}
.sidebar-menu a:hover {
  background: #f3f4f6;
  border-left: 4px solid #4f46e5;
}
.sidebar-footer {
  padding: 16px;
  text-align: center;
  font-size: 0.9em;
  color: #aaa;
}
</style>
