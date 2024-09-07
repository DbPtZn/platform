<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import type { UserListItem } from '@/types'
const themeVars = useThemeVars()
const props = defineProps<{
  data?: UserListItem
}>()
const handleError = (ev) => {
  ev.target.src = '/avatar03.png'
}
</script>

<template>
  <div class="card card--1">
    <!-- <div class="card__info-hover">
      1
      <div class="card__clock-info">2</div>
    </div> -->
    <div class="card__img">
      <div class="card__avatar">
        <img :src="data?.avatar" alt="avatar" @error="handleError">
      </div>
      <span class="card-fullname">{{ data?.nickname }}</span>
    </div>
    <!-- <a href="#" class="card_link">
      <div class="card__img--hover">
        
      </div>
    </a> -->
    <div class="card__info">
      <span class="card__category">简介</span>
      <h3 class="card__title">{{ data?.desc }}</h3>
      <span class="card__by">
        <!-- <Icon name="material-symbols-light:arrow-right-alt" size="24" /> -->
        <router-link class="card__author" :to="`/${data?.UID}`">查看主页</router-link>
        <!-- <a href="#" class="card__author" title="author"></a> -->
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">

.card__like {
  width: 18px;
}

.card__clock {
  width: 15px;
  vertical-align: middle;
  fill: #ad7d52;
}
.card__time {
  font-size: 12px;
  color: #ad7d52;
  vertical-align: middle;
  margin-left: 5px;
}

.card__clock-info {
  float: right;
}

.card__img {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  // background-color: v-bind('themeVars.clearColor');
  .card__avatar {
    // margin: auto auto;
    height: 60px;
    width: 60px;
    border-radius: 50%;
    // background-color: #ad7d52;
    object-fit: fill;
    overflow: hidden;
    img {
      height: 100%;
      width: 100%;
    }
  }

  .card-fullname {
    margin-top: 12px;
    padding-top: 3px;
    border-top: 0.075em solid rgba(250, 214, 195, 0.199);
  }
}

.card__info-hover {
  position: absolute;
  padding: 16px;
  box-sizing: border-box;
  width: 100%;
  opacity: 0;
  top: 0;
}

.card {
  display: flex;
  flex-direction: column;
  margin-right: 25px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0, 1);
  width: 240px;
  height: 320px;
  position: relative;
  border-radius: 3px;
  overflow: hidden;
  background-color: v-bind('themeVars.bodyColor');
  box-shadow: v-bind('themeVars.boxShadow1');
}


.card__info {
  z-index: 2;
  background-color: v-bind('themeVars.cardColor');
  padding: 16px 24px 24px 24px;
}

.card__category {
  font-family: 'Raleway', sans-serif;
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 2px;
  font-weight: 500;
  color: #868686;
}

.card__title {
  font-size: 12px;
  margin-top: 5px;
  margin-bottom: 10px;
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.card__by {
  font-size: 12px;
  font-family: 'Raleway', sans-serif;
  font-weight: 500;
  float: right;
  cursor: pointer;
}

.card__author {
  font-weight: 600;
  text-decoration: none;
  color: #ad7d52;
}

.card:hover .card__info {
  background-color: transparent;
  position: relative;
}

.card:hover .card__info-hover {
  opacity: 1;
}
</style>
