<script lang="ts" setup>
import useStore from '@/store'
import { Provider } from '@/components'
const { settingStore } = useStore()
</script>
<template>
  <Provider>
    <div class="root" :data-theme="[settingStore.theme ? 'dark-theme' : 'light-theme']">
      <router-view />
    </div>
  </Provider>
</template>

<style lang="scss" scoped>
.root {
  width: 100%;
  height: 100%;
}
</style>
