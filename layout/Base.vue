<template>
    <div class="container">
        <slot />
    </div>
</template>
<script setup lang="ts"></script>
<style lang="css" scoped>
    .container {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        min-width: 100vw;
        min-height: 100vh;
    }
</style>
