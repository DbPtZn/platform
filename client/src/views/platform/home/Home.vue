<script setup lang="ts">
import { platformApi } from '@/api'
import { UserListItem } from '@/types'
import { useThemeVars } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from '../layout/AppFooter.vue'
import AppHeader from '../layout/AppHeader.vue'
import BloggerCard from './private/BloggerCard.vue'

const themeVars = useThemeVars()
const router = useRouter()
const users = ref<UserListItem[]>([])
onMounted(() => {
  platformApi.user.getList<UserListItem[]>().then(res => {
    // console.log(res)
    users.value = res.data
  })
})
</script>

<template>
  <div class="home-container">
    <AppHeader />
    <div class="home">
      <div class="channel">频道</div>
      <div class="cards">
        <BloggerCard class="blogger-card" v-for="item in users" :key="item.UID" :data="item" />
      </div>
      <n-divider />
    </div>
    <!-- <n-divider /> -->
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
  .channel {
    padding-top: 36px;
    font-size: 28px;
    font-weight: 600;
  }
}
.cards {
  min-height: 87vh;
  padding-top: 12px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 auto;
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
