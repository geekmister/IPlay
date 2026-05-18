<template>
    <div class="iplay-root">
        <Sidebar />
        <main class="iplay-main">
            <h2>欢迎使用 IPlay 图像工具箱</h2>
            <p>本地运行 · 不上传 · 纯前端</p>
            <!-- 这里可以继续扩展主内容区 -->
        </main>
    </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
</script>

<style scoped>
.iplay-root {
    display: flex;
    min-height: 100vh;
    background: #f9fafb;
}
.iplay-main {
    flex: 1;
    padding: 32px;
}
</style>
