<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import RootPage from './pages/RootPage.vue'
const themeVars = useThemeVars()
</script>

<template>
  <RootPage />
</template>

<style lang="scss">
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
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 6px;
    height: 16px;
    background-color: #646464;
    // background-color: unset;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  &::-webkit-scrollbar-track {
    // -webkit-box-shadow: inset 0 0 6px rgba(138, 138, 138, 0.3);
    // border-radius: 10px;
    background-color: #4e4e4e;
    // background-color: unset;
  }

  // /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    // box-shadow: unset;
    background-color: #242424;
  }
}

#app {
  width: 100%;
  height: 100%;
}
</style>
