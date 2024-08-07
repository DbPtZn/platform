<script lang="ts" setup>
import useStore from '@/store'
import { DropdownOption, NMessageProvider, useDialog, useThemeVars } from 'naive-ui'
import { h } from 'vue';
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import Admin from '../admin/Admin.vue'
const router = useRouter()
const themeVars = useThemeVars()
const { settingStore } = useStore('common')
const { userStore } = useStore('manage')
const dialog = useDialog()
const { t } = useI18n()
function handleThemeUpdate(value: boolean) {
  settingStore.theme = value ? 'dark' : 'light'
}
function handleDblClick() {
  console.log('dbclick')
  router.push({ path: `/manage` })
}
function handleError(ev: Event) {
  
}
const options: DropdownOption[] = [
  {
    label: '统计',
    key: 'count',
    disabled: true,
    props: {
      onClick: () => {
        //
      }
    }
  },
  {
    label: '配置',
    key: 'setting',
    props: {
      onClick: () => {
        dialog.create({
          icon: () => h(Icon, { icon: 'material-symbols:settings-outline', height: '24px' }),
          title: '管理设置',
          style: 'width: 600px;minHeight: 600px;',
          content: () => h(NMessageProvider, {}, {
            default: () => h(Admin)
          })
        })
      }
    }
  },
  {
    label: '登出',
    key: 'logout',
    props: {
      onClick: () => {
        sessionStorage.removeItem('managerToken')
        router.push({ path: `/login` })
      }
    }
  },
]
function handleBack() {
  //
}
</script>

<template>
  <div class="nav">
    <div class="nav-container">
      <n-page-header class="wrapper">
        <!-- <template #title>
          <router-link to="/">主页</router-link>
        </template> -->
        <template #avatar>
          <router-link to="/">
            <img class="logo" src="/logo.png" />
          </router-link>
        </template>
        <template #extra>
          <n-space>
            <n-dropdown :options="options" placement="bottom-end">
              <n-avatar
                class="avatar"
                :bordered="false"
                @error="handleError"
                :src="userStore.avatar"
              />
              <!-- <n-button :bordered="false" style="padding: 0 4px;font-size: 24px;line-height: 24px;"> ··· </n-button> -->
            </n-dropdown>
          </n-space>
        </template>
      </n-page-header>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  cursor: pointer;
}
.nav {
  position: relative;
  display: flex;
  width: 100%;
  height: 64px;
  min-height: 64px;
  box-sizing: border-box;
  border-bottom: 1px solid v-bind('themeVars.dividerColor');
  background-color: v-bind('themeVars.bodyColor');
  box-shadow: v-bind('themeVars.boxShadow1');
  .nav-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    // justify-content: space-between;
    // margin: 0px auto;
    width: 100%;
    height: 100%;
  }
}
.wrapper {
  width: 100%;
  :deep(.n-page-header) {
    width: 100%;
    padding: 0 24px;
    box-sizing: border-box;
  }
}
.logo {
  height: 32px;
  cursor: pointer;
}
</style>
