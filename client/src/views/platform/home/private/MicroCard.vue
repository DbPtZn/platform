<script lang="ts" setup>
import { UserListItem } from '@/types'
import dayjs from 'dayjs'
import { useThemeVars } from 'naive-ui'
const props = defineProps<{
  data?: UserListItem
}>()
const themeVars = useThemeVars()
</script>

<template>
  <!-- <n-divider /> -->
  <div class="item">
    <div class="avatar">
      <img :src="data?.avatar || '/avatar03.png'" alt="" />
    </div>
    <div class="wrapper">
      <div class="name">
        <span>{{ data?.nickname || '' }}</span>
      </div>
      <div class="content">{{ data?.desc }}</div>
      <div class="meta">
        <div class="date">{{ dayjs(data?.createAt).format('YY-MM-DD HH:mm:ss') || '' }}</div>
      </div>
    </div>
    <div class="action">
      <n-button class="btn btn-primary" size="small">
        <router-link class="card__author" title="author" :to="`/${data?.UID}`">查看</router-link>
      </n-button>
    </div>
  </div>
  <n-divider />
</template>

<style lang="scss" scoped>
.avatar {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 8px;
  margin-right: 8px;
  img {
    width: 100%;
    height: 100%;
  }
}
.item {
  margin: 12px 0;
  padding: 5px 16px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  .wrapper {
    flex: 1;
    padding: 6px 12px;
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
  }

  &:hover {
    background-color: v-bind('themeVars.cardColor');
  }
}

.name {
  font-size: 18px;
  color: v-bind('themeVars.textColor1');
  display: flex;
  align-items: center;
}
.content {
  flex: 1;
  font-size: 12px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.meta {
  margin-top: 4px;
  font-size: 10px;
  color: v-bind('themeVars.textColor3');
  opacity: 0.5;
}
</style>
