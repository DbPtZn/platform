<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AlbumCard from './private/AlbumCard.vue'
import { blogApi } from '@/api'
import { computed } from 'vue'
import { Album } from '@/types'
import { useMessage } from 'naive-ui'
import { useRouter } from 'vue-router'
const router = useRouter()
const UID = computed(() => router.currentRoute.value.params.UID as string)
const albums = ref<Album[]>()
const message = useMessage()
onMounted(async () => {
  // console.log(router.currentRoute.value)
  try {
    const data = await blogApi.album.getList<Album[]>(UID.value).then(resp => resp.data)
    albums.value = data
    console.log(data)
  } catch (error) {
    console.log(error)
    message.error('获取专栏列表失败')
  }
})
function handleClick(item: Album) {
  router.push({
    name: 'album-detail',
    params: {
      id: item.id
    }
  })
}
</script>

<template>
  <div class="album-container">
    <div class="album">
      <div style="padding-top: 36px; font-size: 28px; font-weight: 600">专栏</div>
      <div class="list">
        <AlbumCard class="album-card" v-for="item in albums" :key="item.id" :data="item" @click="handleClick(item)" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.album {
  height: 100%;
  min-height: 100vh;
  margin: 0 auto;
}
.list {
  // background-color: antiquewhite;
  margin: 0 auto;
  min-height: 87vh;
  padding-top: 12px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  --n: 3;
  --space: calc(100% - var(--n) * 320px);
  --h: calc(var(--space) / var(--n) / 2);
  .album-card {
    margin: 10px var(--h);
  }
}

// @include Desktop {

//   .album {
//     max-width: 1024px;
//   }
//   .list {
//     max-width: 1024px;
//   }
// }
@media (min-width: 1024px) {
  .album {
    max-width: 1024px;
  }
  .list {
    max-width: 1024px;
  }
}
@include SmallDesktop {
  .list {
    --n: 2;
  }
}
@include Tablet {
  .list {
    --n: 1;
  }
}
@include Mobile {
  .list {
    --n: 1;
  }
}
</style>
