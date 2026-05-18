<template>
    <div class="container">
        <!-- header -->
        <div class="container_header">
          <div>
            <img src="~/assets/favicon.svg" alt="logo"/>
            <h1>IPlay</h1>
          </div>
          <div>

          </div>
        </div>
        <!-- list -->
        <div></div>
        <!-- footer -->
        <div></div>
    </div>
</template>
<script setup lang="ts"></script>
<style lang="css" scoped>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        max-width: 360px;
        min-height: 100vh;
    }
    .container_header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 60px;
    }
    .container_header div {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 200px;
        align-items: center;
    }
    .container_header img {
      width: 32px;
      height: 32px;
    }
</style>
