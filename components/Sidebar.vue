<template>
    <aside :class="['sidebar', { 'is-collapsed': isCollapsed }]">
        <!-- Header -->
        <div class="sidebar-header">
            <img src="/favicon.png" alt="logo" class="sidebar-logo" />
            <h1 class="sidebar-title">图玩</h1>
            <button type="button" class="sidebar-toggle-btn" @click="toggleCollapse" aria-label="切换侧边栏">
                <i :class="['fa', isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left']"></i>
            </button>
        </div>
        <!-- Menu -->
        <nav class="sidebar-menu">
            <ul>
                <template v-for="item in menuItems" :key="item.route">
                    <li>
                        <RouterLink :to="item.route">
                            <i :class="['fa', item.icon, 'sidebar-icon']"></i>
                            <div class="sidebar-item-copy">
                                <span class="sidebar-item-title">{{ item.label }}</span>
                                <span class="sidebar-item-desc">{{ item.desc }}</span>
                            </div>
                        </RouterLink>
                    </li>
                </template>
            </ul>
        </nav>
        <!-- Footer -->
        <footer class="sidebar-footer">
            <div class="footer-user">
                <span class="footer-avatar"><i class="fa fa-user-circle"></i></span>
                <div class="footer-user-copy">
                    <span class="footer-user-name">Mr Geek</span>
                    <i class="fa fa-chevron-up footer-user-arrow" aria-hidden="true"></i>
                </div>
            </div>
            <button type="button" class="footer-notice-btn" aria-label="消息提醒">
                <i class="fa fa-bell"></i>
            </button>
        </footer>
    </aside>
</template>

<script setup lang="js">
    import { ref } from 'vue';
    import { RouterLink } from 'vue-router';

    const isCollapsed = ref(false);
    const toggleCollapse = () => {
        isCollapsed.value = !isCollapsed.value;
    };

    const menuItems = [
        { icon: 'fa-info-circle', label: '图片信息', desc: '查看元数据、指纹与导出信息', route: '/info' },
        { icon: 'fa-edit', label: '图片编辑', desc: '裁剪、压缩、旋转等基础编辑', route: '/tools' },
        { icon: 'fa-eraser', label: 'AI 去水印', desc: '去除水印与画面干扰元素', route: '/image' },
        { icon: 'fa-user-circle', label: 'AI 换脸', desc: '本地合成人像并拖拽调节位置', route: '/face' },
        { icon: 'fa-paint-brush', label: '人像与创作', desc: '抠图、证件照、美化、风格化', route: '/portrait' },
        { icon: 'fa-magic', label: '修复与增强', desc: '老照片修复、扩图、清晰增强', route: '/enhance' },
        { icon: 'fa-eye-slash', label: '识别与隐私', desc: 'OCR、翻译、隐私保护与敏感区域处理', route: '/privacy' },
        { icon: 'fa-files-o', label: '批量与输出', desc: '批处理、拼图海报、图像与 PDF 工作流', route: '/workflow' },
        { icon: 'fa-rocket', label: '高级玩法', desc: '进入完整高级工作台，查看全部任务分组', route: '/advanced' }
    ];
</script>

<style lang="css" scoped>
    .sidebar {
        width: 400px;
        height: 100vh;
        flex-shrink: 0;
        background: #fff;
        border-right: 1px solid var(--color-gray-200);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        transition: width 0.25s ease;
    }
    .sidebar.is-collapsed {
        width: 112px;
    }
    .sidebar-header {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 22px 16px 14px;
    }
    .sidebar.is-collapsed .sidebar-header {
        justify-content: space-between;
        padding-left: 12px;
        padding-right: 12px;
    }
    .sidebar.is-collapsed .sidebar-title {
        display: none;
    }
    .sidebar-toggle-btn {
        margin-left: auto;
        width: 34px;
        height: 34px;
        border: 1px solid rgba(219,226,237,0.95);
        border-radius: 12px;
        background: #fff;
        color: var(--color-gray-700);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
    }
    .sidebar-toggle-btn:hover {
        background: var(--color-gray-50);
    }
    .sidebar-logo {
        width: auto;
        height: 25px;
        max-width: 100%;
        object-fit: contain;
        flex-shrink: 0;
    }
    .sidebar-title {
        font-size: 1.3rem;
        font-weight: 700;
        color: transparent;
        background: linear-gradient(90deg, #4f46e5, #6366f1, #ec4899);
        background-clip: text;
        -webkit-background-clip: text;
        display: inline-block;
    }
    .sidebar-menu {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .sidebar.is-collapsed .sidebar-menu a {
        justify-content: center;
        width: 48px;
        margin: 0 auto;
        border-color: transparent;
        background: transparent;
        padding: 10px 0;
        box-shadow: none;
    }
    .sidebar.is-collapsed .sidebar-item-copy {
        display: none;
    }
    .sidebar.is-collapsed .sidebar-footer {
        justify-content: center;
        padding-left: 0;
        padding-right: 0;
    }
    .sidebar.is-collapsed .footer-user-copy {
        display: none;
    }
    .sidebar.is-collapsed .footer-avatar {
        width: 36px;
        height: 36px;
    }
    .sidebar.is-collapsed .footer-notice-btn {
        width: 36px;
        height: 36px;
    }
    .sidebar.is-collapsed .sidebar-menu ul {
        gap: 10px;
    }
    .sidebar.is-collapsed .sidebar-toggle-btn {
        width: 30px;
        height: 30px;
    }
    .sidebar-menu ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    .sidebar-menu li {
        width: auto;
        margin-left: 30px;
        margin-right: 30px;
    }
    .sidebar.is-collapsed .sidebar-menu li {
        margin: 0 auto;
    }
    .sidebar-menu a {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 14px 18px;
        color: var(--color-gray-700);
        text-decoration: none;
        font-size: var(--font-sm);
        border: 1px solid rgba(219,226,237,0.95);
        border-radius: 20px;
        background: #fff;
        transition: var(--transition);
    }
    .sidebar-item-copy {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }
    .sidebar-item-title {
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--color-gray-900);
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .sidebar-item-desc {
        font-size: 0.8rem;
        color: var(--color-gray-500);
        line-height: 1.35;
        display: block;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .sidebar-menu a:hover {
        box-shadow: 0 12px 28px rgba(99,102,241,0.12);
        transform: translateY(-1px);
        border-color: rgba(99,102,241,0.18);
        color: var(--color-gray-900);
    }
    .sidebar-menu a.router-link-active {
        background: linear-gradient(135deg, rgba(99,102,241,0.14), rgba(139,92,246,0.12));
        border-color: rgba(99,102,241,0.35);
        color: var(--color-primary);
        font-weight: 500;
    }
    .sidebar-icon {
        display: inline-flex;
        width: 2rem;
        height: 2rem;
        align-items: center;
        justify-content: center;
        border-radius: 0.85rem;
        background: rgba(99,102,241,0.1);
        color: var(--color-primary);
        font-size: 1rem;
        flex-shrink: 0;
    }
    .sidebar.is-collapsed .sidebar-icon {
        width: 2.5rem;
        height: 2.5rem;
        background: rgba(99,102,241,0.14);
    }
    .sidebar-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 14px 16px;
        background: #f8fafc;
        border-top: 1px solid rgba(219,226,237,0.9);
        border-radius: 0 0 18px 18px;
    }
    .footer-user {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .footer-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: rgba(99,102,241,0.12);
        color: var(--color-primary);
        font-size: 1.1rem;
    }
    .footer-user-copy {
        display: flex;
        align-items: center;
        gap: 6px;
    }
    .footer-user-name {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--color-gray-900);
    }
    .footer-user-arrow {
        font-size: 0.82rem;
        color: var(--color-gray-500);
    }
    .footer-notice-btn {
        width: 36px;
        height: 36px;
        border-radius: 12px;
        border: 1px solid rgba(219,226,237,0.95);
        background: #fff;
        color: var(--color-gray-600);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
    }
    .footer-notice-btn:hover {
        background: var(--color-gray-50);
    }
</style>
