<script lang="ts" setup>
import useStore from '@/store'
import { darkTheme, lightTheme } from 'naive-ui'
import { ref } from 'vue'
import { Provider } from '@/components'
const { settingStore } = useStore()
</script>
<template>
  <Provider>
    <div ref="rootRef" class="root-page" :data-theme="[settingStore.theme ? 'dark-theme' : 'light-theme']">
      <div class="router-view">
        <router-view />
      </div>
    </div>
  </Provider>
</template>

<style lang="scss" scoped>
.n-layout {
  height: 100%;
  width: 100%;
}
.n-config-provider {
  width: 100%;
  height: 100%;
}
.root-page {
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  // .router-view {
  //   width: calc(100% - 64px);
  // }
}
</style>
