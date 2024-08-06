<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { NButton, NSpace, useDialog, useMessage } from 'naive-ui'
import type { DataTableColumns, FormItemRule, FormRules, UploadFileInfo } from 'naive-ui'
// import { Main, Header } from '@/components'
import useStore from '@/store'
import UserInfo from './UserInfo.vue'
import UserConfig from './UserConfig.vue'
import Password from './Password.vue'
// import SubmissionConfig from './SubmissionConfig.vue'
// import SubscriptionConfig from './SubscriptionConfig.vue'
import { onMounted } from 'vue'
// import { useSubmissionConfig, useSubscriptionConfig } from './hooks/_index'

const { userStore } = useStore('manage')
// const submissionConfig = useSubmissionConfig()
// const subscriptionConfig = useSubscriptionConfig()
</script>

<template>
  <div class="admin">
    <n-divider style="margin-top: 6px; margin-bottom: 8px;" />
    <n-tabs :placement="'left'" pane-class="pane">
      <!-- 个人信息 -->
      <n-tab-pane name="userInfo" tab="个人信息">
        <UserInfo />
      </n-tab-pane>
      <!-- 习惯配置 -->
      <n-tab-pane name="userConfig" tab="习惯配置">
        <UserConfig />
      </n-tab-pane>
      <!-- 密码安全 -->
      <n-tab-pane name="password" tab="密码安全">
        <Password />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style lang="scss" scoped>
.admin {
  z-index: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 50%;
}
.pane {
  // height: 92vh;
  overflow-y: auto;
}
::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: unset;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: unset;
}

// /*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: unset;
  background-color: var(--dpz-scrollbarColor);
}
</style>
