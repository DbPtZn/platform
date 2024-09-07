<script setup lang="ts">
import { platformApi } from '@/api'
import { UserListItem } from '@/types'
import { useThemeVars } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from '../layout/AppFooter.vue'
import AppHeader from '../layout/AppHeader.vue'
import BloggerCard from './private/BloggerCard.vue'
import MicroCard from './private/MicroCard.vue'

const themeVars = useThemeVars()
const router = useRouter()
const users = ref<UserListItem[]>([])
onMounted(() => {
  platformApi.user.getList<UserListItem[]>().then(res => {
    // console.log(res)
    users.value = res.data
  })
})
/** 判断设备 */
const userAgent = navigator.userAgent.toLowerCase()
// 常见的移动设备标识
const mobileDevices = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i
const isMobile = mobileDevices.test(userAgent)
</script>

<template>
  <div class="home-container">
    <AppHeader />
    <div class="home">
      <div class="section channel">频道</div>
      <div v-if="!isMobile" class="cards">
        <BloggerCard  class="blogger-card" v-for="item in users" :key="item.UID" :data="item"  />
      </div>
      <div v-if="isMobile" class="list">
        <MicroCard v-if="isMobile" v-for="item in users"  :key="item.UID" :data="item" />
      </div>
      <!-- <div class="section recommend">推荐</div> -->
      <!-- <div class="section recommend">推荐</div> -->
    </div>
    <n-divider />
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.home-container {
  background-color: v-bind('themeVars.bodyColor');
}
.home {
  height: 100%;
  min-height: 100vh;
  color: v-bind('themeVars.textColor1');
  background-color: v-bind('themeVars.bodyColor');
  margin: 0 auto;
  margin-bottom: 52px;
  .section {
    box-sizing: border-box;
    margin: 0 28px;
    padding-top: 24px;
    font-size: 28px;
    font-weight: 600;
  }
}

.list {
  box-sizing: border-box;
  padding: 0 12px;
}


.cards {
  // min-height: 87vh;
  // padding: 0 12px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin: 0 auto;
  margin-top: 12px;
  --n: 4;
  --space: calc(100% - var(--n) * 240px);
  --h: calc(var(--space) / var(--n) / 2);
  .blogger-card {
    margin: 10px var(--h);
  }
}
@include Desktop {
  .home {
    max-width: 1024px;
  }
  .cards {
    max-width: 1024px;
  }
}
@media (min-width: 1024px) {
  .home {
    max-width: 1024px;
  }
  .cards {
    max-width: 1024px;
  }
}

@media (max-width: 1024px) {
  .cards {
    --n: 3;
  }
}
@include Tablet {
  .home {
    .channel {
      padding-top: 12px;
    }
  }
  
  .cards {
    --n: 2;
  }
}
@include Mobile {
  .cards {
    --n: 1;
  }
}
</style>
