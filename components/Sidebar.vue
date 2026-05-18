<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <img src="/favicon.svg" alt="logo" class="sidebar-logo" />
      <h1 class="sidebar-title">IPlay</h1>
    </div>
    <nav class="sidebar-menu">
      <ul>
        <li><RouterLink to="/info"><i class="fa fa-info-circle mr-2"></i>图片信息</RouterLink></li>
        <li><RouterLink to="/tools"><i class="fa fa-edit mr-2"></i>图片编辑</RouterLink></li>
        <li><RouterLink to="/image"><i class="fa fa-eraser mr-2"></i>AI 去水印</RouterLink></li>
        <li><RouterLink to="/face"><i class="fa fa-user-circle mr-2"></i>AI 换脸</RouterLink></li>
        <li><RouterLink to="/portrait"><i class="fa fa-paint-brush mr-2"></i>人像与创作</RouterLink></li>
        <li><RouterLink to="/enhance"><i class="fa fa-magic mr-2"></i>修复与增强</RouterLink></li>
        <li><RouterLink to="/privacy"><i class="fa fa-eye-slash mr-2"></i>识别与隐私</RouterLink></li>
        <li><RouterLink to="/workflow"><i class="fa fa-files-o mr-2"></i>批量与输出</RouterLink></li>
        <li><RouterLink to="/advanced"><i class="fa fa-rocket mr-2"></i>高级玩法</RouterLink></li>
      </ul>
    </nav>
    <footer class="sidebar-footer">
      <small>© 2026 IPlay</small>
    </footer>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router';
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
.sidebar-menu a.router-link-active {
  background: #f3f4f6;
  border-left: 4px solid #6366f1;
  color: #6366f1;
  font-weight: 500;
}
.sidebar-footer {
  padding: 16px;
  text-align: center;
  font-size: 0.9em;
  color: #aaa;
}
</style>
