<script lang="ts" setup>
import useStore from '@/store'
// import MenuIcon from './MenuIcon.vue'
import { useThemeVars } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { computed } from 'vue'
import { reactive } from 'vue'
import { Subscription, fromEvent } from '@tanbo/stream'
const { settingStore } = useStore('common')
const uid = computed(() => router.currentRoute.value.params.UID as string)
const router = useRouter()
const route = useRoute()
const themeVars = useThemeVars()
const { t } = useI18n()
interface User {
  UID: string
  avatar: string
  nickname: string
  desc: string
}
const user = reactive<User>({
  avatar: '',
  nickname: '',
  desc: '',
  UID: ''
})
const subs: Subscription[] = []
const visible = ref(false)
onMounted(() => {
  subs.push(
    fromEvent<WheelEvent>(document.body, 'wheel').subscribe(event => {
      // console.log(event)
      if (event.deltaY > 0) {
        // 用户向上滚动
        // console.log('向上滚动')
        visible.value = false
      } else {
        // 用户向下滚动
        // console.log('向下滚动')
        visible.value = true
      }
    })
  )
})
const navOptions = [
  {
    key: 'home',
    label: `${t('home')}`,
    onClick: () => {
      handleNavClick('')
    }
  },
  {
    key: 'album',
    label: `${t('album')}`,
    onClick: () => {
      handleNavClick('album')
    }
  },
  {
    key: 'tag',
    label: `${t('tag')}`,
    disabled: true,
    onClick: () => {
      handleNavClick('tag')
    }
  },
  {
    key: 'about',
    label: `${t('about')}`,
    disabled: true,
    onClick: () => {
      handleNavClick('about')
    }
  }
]
function handleNavClick(to: string) {
  // const match = route.path.match(/^\/([a-zA-Z0-9_-]+)\/?.*/)
  // const uid = match ? match[1] : ''
  router.push({ path: `/${uid.value}${to ? '/' + to : to}` })
}

function handleThemeUpdate(value: boolean) {
  settingStore.theme = value ? 'dark' : 'light'
}
function handleDblClick() {
  console.log('dbclick')
  router.push({ path: `/manage` })
}
const isDrawerVisible = ref(false)
function handleMoreClick() {
  isDrawerVisible.value = !isDrawerVisible.value
}
</script>

<template>
  <div :class="['nav', visible && 'visible']">
    <div class="nav-container">
      <div class="left">
        <div class="title">
          <img class="tapenote-icon logo" :src="'/logo.png'" alt="" @dblclick="handleDblClick" />
          <span class="tapenote-name">@筆記映畫</span>
          <!-- <router-link class="tapenote-name" to="/"></router-link> -->
        </div>
      </div>
      <div class="right">
        <div class="tools">
          <!-- <n-input class="search" placeholder="搜索" disabled>
            <template #suffix>
              <n-button class="btn" text ghost>
                <n-icon :component="SearchOutlined" :size="18" />
              </n-button>
            </template>
          </n-input> -->
        </div>

        <div class="menu">
          <!-- <n-flex align="center" :size="[12, 0]">
            <n-button text v-for="(item, index) in navOptions" :key="item.key" @click="item.onClick">
              <span class="menu-btn">{{ item.label }}</span>
            </n-button>
          </n-flex> -->
        </div>
        <!-- <n-divider class="divider" vertical /> -->
        <div class="theme-switch" @click="handleThemeUpdate(settingStore.theme !== 'dark')">
          <Icon v-if="settingStore.theme === 'dark'" name="material-symbols-light:nights-stay-rounded" size="24px" />
          <Icon v-if="settingStore.theme === 'light'" name=" material-symbols:light-mode-rounded"  size="24px" />
        </div>
        <!-- 用户配置自定义外链（图标 + 超链接） -->
        <!-- <n-divider class="divider" vertical /> -->
        <!-- <n-button text>
          <Icon name="mdi:qqchat" size="24px" />
        </n-button>
        <n-divider class="divider" vertical />
        <n-button text>
          <Icon name="ic:baseline-wechat" size="24px" />
        </n-button> -->
        <Icon class="more-btn" name="mingcute:more-1-fill" size="24px" @click="handleMoreClick" />
        <!-- <MenuIcon class="collapse-btn" :style="{ scale: 0.6 }" @click="handleMoreClick" /> -->
      </div>
    </div>
  </div>

  <n-drawer v-model:show="isDrawerVisible" :width="'50%'" :placement="'right'">
    <n-drawer-content title="Menu">
      <n-flex>
          <span>主题 ：</span>
          <n-switch class="theme-switch" @update:value="handleThemeUpdate" :value="settingStore.theme === 'dark'" size="medium">
            <template #icon>
              <span v-if="settingStore.theme === 'light'">☀</span>
              <span v-if="settingStore.theme === 'dark'">🌙</span>
            </template>
          </n-switch>
        </n-flex>
        <n-divider />
        <n-flex align="start" :size="[12, 6]" vertical>
          <n-button block v-for="(item, index) in navOptions" :key="item.key" @click="item.onClick">
            <span class="menu-btn">{{ item.label }}</span>
          </n-button>
        </n-flex>
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped lang="scss">
.visible {
  position: sticky;
  top: 0px;
  animation: fadeInDown 0.5s ease-in-out;
}
.nav {
  display: flex;
  z-index: 1;
  width: 100%;
  height: 64px;
  min-height: 64px;
  color: v-bind('themeVars.textColor1');
  // border: 1px solid v-bind('themeVars.dividerColor');
  background-color: v-bind('themeVars.bodyColor');
  // box-shadow: v-bind('themeVars.boxShadow1');
  .nav-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin: 0px auto;
    width: 100%;
    height: 100%;
  }
}
.left {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 64px;
  }
  .tapenote-icon {
    margin-right: 8px;
    max-width: 100%;
    vertical-align: middle;
    overflow-clip-margin: content-box;
    overflow: clip;
  }
  .logo {
    height: 32px;
    cursor: pointer;
  }
  .tapenote-name {
    display: block;
    font-size: 16px;
  }
}
.right {
  flex-grow: 1;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .menu {
    display: flex;
    .menu-btn {
      font-size: 16px;
      margin: 0 6px;
    }
  }
  .nav-btn {
    font-size: 16px;
    margin: 0 6px;
  }
  .more-btn {
    display: none;
  }
  .tools {
    flex-grow: 1;
    padding-left: 32px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .search {
      max-width: 150px;
      height: 40px;
    }
  }
  .collapse-btn {
    display: none;
  }
  .theme-switch {
    height: 30px;
    width: 30px;
    cursor: pointer;
  }
}

@media (min-width: 1280px) {
  .nav-container {
    max-width: 1280px;
  }
}

@include Desktop {
  .left {
    .tapenote-icon {
      display: block;
    }
    .tapenote-name {
      display: block;
    }
  }
}

@include SmallDesktop {
  .nav {
    .nav-container {
      width: 100%;
      margin: 0 12px;
    }
  }
  .right {
    justify-content: end;
    .nav-list {
      display: none;
    }
    .tools {
      display: none;
    }
    .divider {
      display: none;
    }
    .theme-switch {
      display: none;
    }
    .nav-btn {
      display: none;
    }
    .more-btn {
      display: block;
      margin-left: 12px;
    }
    .menu-btn {
      display: block;
    }
  }
}

@include Tablet {
  .nav {
    .nav-container {
      width: 100%;
      margin: 0 12px;
      // margin: 0;
      padding: 0;
    }
  }
  .divider {
    display: none;
  }
  .left {
    .tapenote-icon {
      display: block;
    }
    .tapenote-name {
      display: none;
    }
  }
  .right {
    justify-content: end;
    .menu {
      display: none;
    }
    .tools {
      display: none;
    }
    .theme-switch {
      display: none;
    }
    .nav-btn {
      display: none;
    }
    .collapse-btn {
      display: block;
    }
  }
}
</style>
