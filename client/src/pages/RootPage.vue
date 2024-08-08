<script lang="ts" setup>
import useStore from '@/store'
import { Provider } from '@/components'
import { computed } from 'vue'
const { settingStore } = useStore()
const bgcolor = computed(() => settingStore.theme === 'dark' ? '#000' : '#fff')
</script>
<template>
  <Provider>
    <div class="root" :data-theme="[settingStore.theme === 'dark' ? 'dark-theme' : 'light-theme']">
      <router-view />
    </div>
  </Provider>
</template>

<style lang="scss" scoped>
.root {
  width: 100%;
  height: 100%;
  background-color: v-bind('bgcolor');
  // overflow-x: hidden;
}
</style>
