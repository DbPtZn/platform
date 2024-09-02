<script setup lang="ts">
import { blogApi } from '@/api'
import router from '@/router'
import { ArticleList, ArticleListItem } from '@/types'
import { useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { computed } from 'vue'
import ItemCard from '../list/private/ItemCard.vue'

const albumId = computed(() => router.currentRoute.value.params.id as string)
const UID = computed(() => router.currentRoute.value.params.UID as string)
const message = useMessage()
const articles = ref<ArticleListItem[]>()
onMounted(async () => {
  // console.log(UID.value)
  // console.log(albumId.value)
  try {
    const data = await blogApi.article.getList<ArticleList>({
      page: 1,
      limit: 10,
      UID: UID.value,
      filter: { albumId: albumId.value }
    }).then(resp => resp.data)
    articles.value = data.items
    // console.log(articles.value)
  } catch (error) {
    console.log(error)
    message.error('获取作品列表失败')
  }
})

function handleClick(item: ArticleListItem) {
  router.push(`/article/${item.agentId}`)
}
</script>

<template>
  <div class="content">
    <div class="list">
      <ItemCard
        v-for="item in articles"
        :key="item.id"
        :id="item.id"
        :cover="item.cover"
        :title="item.title"
        :abbrev="item.abbrev"
        :columnName="'专栏名'"
        :wordage="item.wordage"
        :avatar="item.avatar"
        :penname="item.penname"
        :create-at="item.createAt"
        @click="handleClick(item)"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.list {
  min-height: 95vh;
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .list {
    max-width: 1024px;
  }
}
@include Desktop {
  .list {
    max-width: 1024px;
  }
}
</style>
