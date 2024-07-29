<script lang="ts" setup>
import useStore from '@/store'
import { darkTheme, lightTheme } from 'naive-ui'
const { settingStore } = useStore()
</script>
<template>
  <n-config-provider :theme="settingStore.theme" :theme-overrides="settingStore.theme === 'dark' ? darkTheme : lightTheme">
    <n-dialog-provider>
      <n-message-provider>
        <slot />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
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
</style>
