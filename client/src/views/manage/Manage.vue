<script setup lang="ts">
import useStore from '@/store'
import { Sidebar, Itemlist } from '.'

const { columnStore } = useStore('manage')
</script>

<template>
  <div class="manage">
    <div class="sidebar-wrapper">
      <Sidebar />
    </div>
    <div v-if="columnStore.id" class="itemlist-wrapper">
      <Itemlist />
    </div>
    <div class="workbench-wrapper">
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
