<script setup lang="ts">
import { platformApi } from '@/api'
import { UserListItem } from '@/types'
import { useThemeVars } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
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
  <div class="home">
    <div class="cards">
      <BloggerCard class="blogger-card" v-for="item in users" :key="item.UID" :data="item" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  height: 100%;
  width: 100%;
  min-height: 100vh;
  color: v-bind('themeVars.textColor1');
  background-color: v-bind('themeVars.bodyColor');
  margin: 0 auto;
}
.cards {
  padding-top: 36px;
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
  .cards {
    max-width: 1024px;
  }
}
@media (min-width: 1024px) {
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
