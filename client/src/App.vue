<script setup lang="ts">
import RootPage from './pages/RootPage.vue'
</script>

<template>
  <RootPage />
</template>

<style scoped>
html {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  width: 100%;
}

#app {
  width: 100%;
  height: 100%;
}
</style>
