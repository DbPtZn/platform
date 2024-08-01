<script setup lang="ts">
import useStore from '@/store'
import Layout from './layout/Layout.vue'
import { Sidebar, Itemlist } from '.'
import { onMounted } from 'vue'
const { columnStore, userStore } = useStore('manage')
onMounted(() => {
  // 获取用户数据
  userStore.fetchAndSet()
})
</script>

<template>
  <Layout>
    <div class="manage">
      <div class="sidebar-wrapper">
        <Sidebar />
      </div>
      <div v-if="columnStore.id" class="itemlist-wrapper">
        <Itemlist />
      </div>
      <div class="workbench-wrapper">
        <router-view />
      </div>
    </div>
  </Layout>
</template>

<style scoped lang="scss">
.manage {
  height: 100%;
  display: flex;
  flex-direction: row;
}
.sidebar-wrapper {
  width: 100%;
  // height: 100%;
  max-width: 240px;
}
.itemlist-wrapper {
  width: 100%;
  max-width: 260px;
}
.workbench-wrapper {
  flex: 1;
}
</style>
