<template>
  <Sidebar />
  <NuxtPage />
</template>

<script setup lang="ts">
import Sidebar from '~/components/Sidebar.vue';
useHead({
  bodyAttrs: {
    class: 'bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100',
  },
});
</script>
