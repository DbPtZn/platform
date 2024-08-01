<template>
  <div class="layout">
    <div class="header">
      <Header />
    </div>
    <div class="content">
      <slot />
    </div>
    <!-- <div class="footer">
      <ManageFooter />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import Header from './Header.vue'
const themeVars = useThemeVars()
</script>

<style scoped lang="scss">
.layout {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: v-bind('themeVars.bodyColor');
}
.layout-container {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.header {
  position: sticky;
  top: 0;
  height: 64px;
  box-sizing: border-box;
}
.content {
  flex: 1;
  height: calc(100vh - 64px);
  box-sizing: border-box;
}
.footer {
  height: 64px;
  box-sizing: border-box;
}

/** 定制滚动条 */
/* 定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸 */
::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: unset;
}

/* 定义滚动条轨道 内阴影+圆角 */
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: unset;
}

/* 定义滑块 内阴影+圆角 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: unset;
  /* background-color: unset; */
  background-color: v-bind('themeVars.scrollbarColor');
}
</style>
