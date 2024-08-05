<template>
  <n-result
    class="result"
    status="info"
    title="正在审核中..."
    description="审核通过后才能访问该文章"
  >
    <template #footer>
      <n-button>
        <router-link to="/">返回首页</router-link>
      </n-button>
    </template>
  </n-result>
</template>

<style lang="scss" scoped>
.result {
  // text-align: center;
  // height: 100vh;
  // line-height: 100vh;
  padding-top: 200px;
  box-sizing: border-box;
}
</style>
