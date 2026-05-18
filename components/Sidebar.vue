<template>
    <aside class="sidebar">
        <div class="sidebar-header">
            <img src="/favicon.svg" alt="logo" class="sidebar-logo" />
            <h1 class="sidebar-title">IPlay</h1>
        </div>
        <nav class="sidebar-menu">
            <ul>
                <li>
                    <RouterLink to="/info">
                        <i class="fa fa-info-circle mr-2"></i>
                        图片信息
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/tools">
                        <i class="fa fa-edit mr-2"></i>
                        图片编辑
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/image">
                        <i class="fa fa-eraser mr-2"></i>
                        AI 去水印
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/face">
                        <i class="fa fa-user-circle mr-2"></i>
                        AI 换脸
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/portrait">
                        <i class="fa fa-paint-brush mr-2"></i>
                        人像与创作
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/enhance">
                        <i class="fa fa-magic mr-2"></i>
                        修复与增强
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/privacy">
                        <i class="fa fa-eye-slash mr-2"></i>
                        识别与隐私
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/workflow">
                        <i class="fa fa-files-o mr-2"></i>
                        批量与输出
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/advanced">
                        <i class="fa fa-rocket mr-2"></i>
                        高级玩法
                    </RouterLink>
                </li>
            </ul>
        </nav>
        <footer class="sidebar-footer">
            <small>© 2026 IPlay</small>
        </footer>
    </aside>
</template>

<script setup lang="js">
    import { RouterLink } from 'vue-router';
</script>

<style lang="css" scoped></style>
