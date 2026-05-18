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


