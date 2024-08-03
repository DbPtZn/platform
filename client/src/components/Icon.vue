<template>
  <Icon :icon="name" :height="size" />
</template>
<script lang="ts" setup>
import { Icon } from '@iconify/vue'
defineProps<{
  name: string
  size?: string | number
}>()
</script>
 
<style scoped>
 
</style>