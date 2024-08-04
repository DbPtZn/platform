<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import BloggerHeader from './layout/BloggerHeader.vue'
import { useRouter } from 'vue-router'

const themeVars = useThemeVars()
const router = useRouter()
</script>

<template>
  <BloggerHeader />
  <div class="blog">
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.blog {
  height: 100%;
  width: 100%;
  color: v-bind('themeVars.textColor1');
  background-color: v-bind('themeVars.bodyColor');
  // margin: 0 auto;
}
</style>
