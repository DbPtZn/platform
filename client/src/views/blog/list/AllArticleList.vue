<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import ItemCard from './private/ItemCard.vue'
import { ArticleList, ArticleListItem } from '@/types'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { blogApi } from '@/api'

const themeVars = useThemeVars()
const router = useRouter()
const articles = ref<ArticleListItem[]>([])
function handleClick(item: ArticleListItem) {
  router.push(`/article/${item.id}`)
}
onMounted(() => {
  blogApi.article.getList<ArticleList>({
    page: 1,
    limit: 10,
    filter: {}
  }).then(res => {
    console.log(res)
    articles.value = res.data.items
    console.log(articles.value)
  })
})
</script>

<template>
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
</template>

<style scoped lang="scss">
.list {
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
