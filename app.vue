<template>
    <div class="iplay-root">
        <Sidebar />
        <main class="iplay-main">
            <RouterView />
        </main>
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
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
    overflow-y: auto;
}
</style>
