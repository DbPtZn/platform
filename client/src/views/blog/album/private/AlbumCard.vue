<script setup lang="ts">
import { Album } from '@/types'
import { useThemeVars } from 'naive-ui'
import dayjs from 'dayjs'
const themeVars = useThemeVars()
const props = defineProps<{
  data: Album
}>()
function handleError(ev) {
  ev.target.src = '/error.png'
}
</script>

<template>
  <div class="card">
    <div class="header">{{ data.name }}</div>
    <div class="main">
      <div class="cover">
        <img v-if="data.cover" :src="data.cover" alt="" @error="handleError" />
      </div>
      <div class="desc">{{ data.desc }}</div>
    </div>
    <div class="footer">
      <div class="createAt">{{ dayjs(data.createAt).format('YY-MM-DD HH:mm:ss') }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  width: 320px;
  height: 125px;
  box-sizing: border-box;
  border-radius: 6px;
  border: 1px solid v-bind('themeVars.dividerColor');
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  &:hover {
    border-color: v-bind('themeVars.primaryColor');
  }
}
.header {
  font-size: 18px;
  height: 18px;
}
.main {
  font-size: 14px;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: end;
  padding-bottom: 5px;

  .cover {
    border-radius: 6px;
    height: 40px;
    width: 40px;
    overflow: hidden;
    margin-right: 6px;
    img {
      width: 100%;
    }
  }
  .desc {
    max-width: 240px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 12px;
  }
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 12px;
  font-size: 12px;
  margin-top: 6px;
  opacity: 0.8;
}

@include SmallDesktop {
  // .card {
  //   width: 1000px;
  // }
}
</style>
