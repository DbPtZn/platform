<script setup lang="ts">
import UserAvatar from './icons/UserAvatar.vue'
import type { PublicArticleType } from '@/types'
import dayjs from 'dayjs'
import { usePlayer } from './hooks/usePlayer'
import type { Editor } from '@textbus/editor'
import '@/editor/style.css'
import 'material-icons/iconfont/material-icons.css'
import { fromEvent, type Subscription } from '@tanbo/stream'
import { useMessage, useThemeVars } from 'naive-ui'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import useStore from '@/store'
import { useRouter } from 'vue-router'
import { blogApi } from '@/api'
import ArticleHeader from '../layout/ArticleHeader.vue'
import { Icon } from '@iconify/vue'
import { AnimeEventService, AnimeProvider, DialogProvider, OutlineService, Player, RootEventService, Structurer, ThemeProvider } from '@/editor'
const themeVars = useThemeVars()
const { settingStore } = useStore('common')
const router = useRouter()
const message = useMessage()
const id = computed(() => router.currentRoute.value.params.id as string)
const isExamining = ref(false)
const isRefused = ref(false)
const refuseMsg = ref('')
const scrollerRef = ref()
const controllerRef = ref()
const editorRef = ref()
const outlineRef = ref()
const rootRef = ref()
const navRef = ref()
const state = ref<PublicArticleType>({
  UID: '',
  user: {
    UID: '',
    nickname: '',
    avatar: ''
  },
  editionId: '',
  fromEditionId: '',
  type: 'note',
  isParsed: false,
  msg: '',
  editorVersion: '',
  cover: '',
  title: '',
  content: '',
  abbrev: '',
  audio: '',
  promoterSequence: [],
  keyframeSequence: [],
  subtitleSequence: [],
  subtitleKeyframeSequence: [],
  tags: [],
  isPublished: false,
  isDisplayed: false,
  penname: '',
  avatar: '',
  email: '',
  author: {
    blog: ''
  },
  wordage: 0,
  duration: 0,
  detail: {
    fileSize: 0
  },
  meta: {
    views: 0,
    likes: 0,
    collections: 0,
    comments: 0
  },
  id: '',
  albumId: '',
  createAt: '',
  updateAt: '',
  unparsedFile: '',
  refuseMsg: ''
})

let player: Editor
let controller: Player
const subs: Array<Subscription> = []
let headings: NodeListOf<HTMLElement>
const outlineData: { tagName: string; text: string; offsetTop: number }[] = []
const activeIndex = ref(0)
onMounted(() => {
  scrollerRef.value = document.documentElement
  if (id.value) {
    blogApi.article
      .get<PublicArticleType>(id.value)
      .then(res => {
        res.data.audio = res.config.baseURL + res.data.audio
        state.value = res.data
        usePlayer({
          rootRef,
          editorRef,
          scrollerRef,
          controllerRef,
          outlineRef,
          data: state.value
        })
          .then(res => {
            player = res
            // console.log(player)
            controller = player.get(Player)
            subs.push(
              controller.onStateUpdate.subscribe(() => {
                // console.log('playing')
                isPlaying.value = controller.isPlaying
                if (controller.isPlaying) {
                  navRef.value.setNavVisible(false)
                }
              }),
              /** 编辑器准备完成后，获取目录信息，生成目录数据 */
              player.onReady.subscribe(() => {
                headings = editorRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
                headings.forEach(heading => {
                  outlineData.push({
                    tagName: heading.tagName.toLocaleLowerCase(),
                    text: heading.textContent || '',
                    offsetTop: heading.offsetTop
                  })
                })
              })
            )
          })
          .catch(err => {
            console.log(err)
            message.error('加载文章失败!')
            // navigateTo('/')
          })
      })
      .catch(err => {
        // console.log(err)
        if (err.response.status === 307) {
          // console.log(err.response.data)
          if (err.response?.data?.examining) {
            message.info('文章正在审核中...')
            isExamining.value = true
            return
          }
          if (err.response?.data?.refused) {
            isRefused.value = true
            refuseMsg.value = err.response?.data?.refuseMsg || '未知'
            return
          }
        }
        message.error('获取文章失败!')
      })
  }
  /** 监听 scroll 事件，设置目录焦点 */
  // console.log(scrollerRef.value)
  subs.push(
    fromEvent(window, 'scroll').subscribe(() => {
      // console.log('body')
      activeIndex.value = outlineData.findIndex(item => item.offsetTop > scrollerRef.value.scrollTop)
      // console.log(activeIndex.value)
    })
  )
})

/** 销毁 */
onUnmounted(() => {
  try {
    // console.log('销毁依赖')
    subs.forEach(sub => sub.unsubscribe())
    player.get(Player).destory()
    player.get(OutlineService).destory()
    player.get(DialogProvider).destory()
    player.get(AnimeProvider).destory()
    player.get(Structurer).destory()
    player.get(ThemeProvider).destory()
    player.get(RootEventService).destory()
    player.get(AnimeEventService).destory()
    player.destroy()
    // console.log('编辑器是否已经销毁：' + player.destroyed)
  } catch (error) {
    console.log(error)
    console.error('编辑器销毁失败！')
  }
})

/** 目录显示/隐藏 */
const isOutlineShow = ref(true)
function handleOutlineVisible() {
  isOutlineShow.value = !isOutlineShow.value
}

/** 侧边抽屉显示/隐藏 */
const drawerActive = ref(false)
function handleMoreClick() {
  drawerActive.value = true
}

/** 侧边抽屉滚动控制 */
function handleScrollTo(offsetTop: number) {
  scrollerRef.value.scrollTo({
    top: offsetTop - 10, // 滚动到指定位置( - 10px 偏移修正)
    behavior: 'smooth'
  })
}

const isPlaying = ref(false)
const floatBtnIcon = computed(() => (isPlaying.value ? 'material-symbols:pause-rounded' : 'material-symbols:play-arrow-rounded'))
function handleFloatBtnClick() {
  const controller = player.get(Player)
  if (!controller.isPlaying && !controller.isPause) {
    controller.start()
    isPlaying.value = true
    return
  }
  if (controller.isPlaying && !controller.isPause) {
    controller.pause()
    isPlaying.value = false
    return
  }
  if (!controller.isPlaying && controller.isPause) {
    controller.resume()
    isPlaying.value = true
    return
  }
}

const controlMethods = {
  handlePlay: () => {
    if (!controller.isPlaying && !controller.isPause) {
      controller.start()
      isPlaying.value = true
      return
    }
    if (controller.isPlaying && !controller.isPause) {
      controller.pause()
      isPlaying.value = false
      return
    }
    if (!controller.isPlaying && controller.isPause) {
      controller.resume()
      isPlaying.value = true
      return
    }
  },
  handleRewind: () => {
    controller.rewind()
  },
  handleForward: () => {
    controller.forward()
  },
  handleSpeedDown: () => {
    controller.speedDown()
  },
  handleSpeedUp: () => {
    controller.speedUp()
  },
  handleReplay: () => {
    controller.replay()
    isPlaying.value = true
  },
  handleStop: () => {
    controller.stop()
    isPlaying.value = false
  },
  handleVolumeDown: () => {
    controller.volumeDown()
  },
  handleVolumeUp: () => {
    controller.volumeUp()
  }
}

const isMenuVisible = ref(false)
let timer: NodeJS.Timeout
function handleMouseDown() {
  timer = setTimeout(() => {
    // console.log('mousedown')
    isMenuVisible.value = true
    clearTimeout(timer)
  }, 1000)
}

function handleMouseUp() {
  clearTimeout(timer)
}
function handleShowMenu(value: boolean) {
  isMenuVisible.value = value
}
function handleSwipe(event: 'top' | 'bottom' | 'left' | 'right') {
  if (event === 'top') {
    // 用户向上滑动
    // console.log('用户向上滑动')
    navRef.value.setNavVisible(false)
  } else if (event === 'bottom') {
    // 用户向下滑动
    // console.log('用户向下滑动')
    navRef.value.setNavVisible(true)
  } else if (event === 'left') {
    // 用户向左滑动
    // console.log('用户向左滑动')
    isMenuVisible.value = true
  } else if (event === 'right') {
    // 用户向右滑动
    // console.log('用户向右滑动')
    isMenuVisible.value = false
  }
}
</script>

<template>
  <ArticleHeader ref="navRef" :user="state.user" @outline-visible="handleOutlineVisible" @more-click="handleMoreClick" />
  <div ref="rootRef" class="article">
    <div class="wrapper" v-touch:swipe="handleSwipe">
      <div class="header">
        <div class="title">{{ state.title }}</div>
        <!-- <div class="intro">一段介绍的话</div> -->
        <div class="tags">
          <n-tag v-for="tag in state.tags" :bordered="false">{{ tag }}</n-tag>
        </div>
        <div class="detail">
          <!-- @click="handleBloggerClick(state.UID)" -->
          <div class="author">
            <Icon icon="clarity:avatar-solid" height="20px" />
            <span>{{ state.penname }}</span>
          </div>
          <div class="time">
            <Icon icon="material-symbols:calendar-clock" height="20px" />
            <span>{{ dayjs(state.createAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </div>
          <div class="wordage">
            <Icon icon="ant-design:field-number-outlined" height="24px" />
            <span>{{ state.wordage }}</span>
          </div>
          <div v-if="state.duration" class="duration">
            <Icon icon="material-symbols:alarm" height="20px" />
            <span>{{
              dayjs()
                .minute(Math.floor(state.duration / 60))
                .second(state.duration % 60)
                .format('mm:ss')
            }}</span>
          </div>
        </div>
        <n-divider />
      </div>
      <div class="main">
        <div ref="editorRef" class="content editor" />
        <div :class="['outline-wrapper']">
          <div ref="outlineRef" :class="['outliner', isOutlineShow ? '' : 'outline-visible']"></div>
        </div>
      </div>
    </div>
    <div v-show="state.type === 'course'" ref="controllerRef" :class="['controller']"></div>
  </div>

  <!-- 控制器按钮组 -->
  <n-float-button-group
    :class="['mo-controller-group', isMenuVisible ? 'mo-controller-group-show' : 'mo-controller-group-hidden']"
    shape="circle"
    position="fixed"
  >
    <n-float-button @click="controlMethods.handleSpeedDown()">
      <Icon icon="material-symbols:keyboard-double-arrow-up-rounded" height="20px" />
    </n-float-button>
    <n-float-button @click="controlMethods.handleRewind()">
      <Icon icon="material-symbols:replay-5-rounded" height="20px" />
    </n-float-button>
    <n-float-button @click="controlMethods.handlePlay()">
      <Icon :icon="floatBtnIcon" height="24" />
    </n-float-button>
    <n-float-button @click="controlMethods.handleForward()">
      <Icon icon="material-symbols:forward-5-rounded" height="20px" />
    </n-float-button>
    <n-float-button @click="controlMethods.handleSpeedUp()">
      <Icon icon="material-symbols:keyboard-double-arrow-down-rounded" height="20px" />
    </n-float-button>
  </n-float-button-group>

  <!-- 控制器启动/暂停按钮 -->
  <n-float-button
    v-show="!isMenuVisible"
    class="mo-controller"
    shape="circle"
    position="fixed"
    right="40px"
    bottom="40px"
    @click="handleFloatBtnClick"
  >
    <Icon :icon="floatBtnIcon" height="24" />
  </n-float-button>

  <n-back-top class="back-top" :right="100" :to="rootRef" />
  <n-drawer v-model:show="drawerActive" width="50%" placement="right">
    <n-drawer-content title="Menu">
      <div>
        <n-flex>
          <span>主题 ：</span>
          <n-switch
            class="theme-switch"
            @update:value="val => (val ? (settingStore.theme = 'dark') : (settingStore.theme = 'light'))"
            :value="settingStore.theme === 'dark'"
            size="medium"
          >
            <template #icon>
              <span v-if="settingStore.theme === 'light'">☀</span>
              <span v-if="settingStore.theme === 'dark'">🌙</span>
            </template>
          </n-switch>
        </n-flex>
        <n-divider class="divider" />

        <n-flex vertical>
          <n-button @click="controlMethods.handleReplay()">
            <Icon icon="material-symbols:replay-rounded" height="20px" />
            <span>重播</span>
          </n-button>
          <n-button @click="controlMethods.handleStop()">
            <Icon icon="material-symbols:stop-rounded" height="20px" />
            <span>结束</span>
          </n-button>
          <!-- <n-button>
            <Icon icon="material-symbols:volume-down-rounded" height="20px" />
            <span>减小音量</span>
          </n-button>
          <n-button>
            <Icon icon="material-symbols:volume-up-rounded" height="20px" />
            <span>增大音量</span>
          </n-button> -->
        </n-flex>

        <n-divider class="divider" />
        <div class="custom-outline">
          <n-flex vertical>
            目录
            <div v-for="(item, index) in outlineData" :key="index" :class="['outline-heading-item', `outline-heading-${item.tagName}`]">
              <a
                :class="['outline-heading-text', activeIndex === index ? 'outline-heading-active' : '']"
                href="javascript:;"
                @click="handleScrollTo(item.offsetTop)"
              >
                {{ item.text }}
              </a>
            </div>
          </n-flex>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
  <div v-if="isExamining" class="cover">
    <n-result status="info" title="正在审核中..." description="审核通过后才能访问该文章">
      <template #footer>
        <n-flex align="center" justify="center">
          <n-button @click="() => router.go(0)"> 刷新 </n-button>
          <n-button @click="() => router.back()"> 返回 </n-button>
        </n-flex>
      </template>
    </n-result>
  </div>
  <div v-if="isRefused" class="cover">
    <n-result status="error" title="稿件已被拒收" :description="`${refuseMsg}`">
      <template #footer>
        <n-flex align="center" justify="center">
          <n-button @click="() => router.back()"> 返回 </n-button>
        </n-flex>
      </template>
    </n-result>
  </div>
</template>
<style scoped lang="scss">
.cover {
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: v-bind('themeVars.cardColor');
  padding-top: 10%;
}

.mo-controller-group {
  z-index: 1;
  opacity: 0.6;
  bottom: 30%;
  // bottom: 50%;
  // transform: translateY(50%);
  display: none;
  &:hover {
    opacity: 0.8;
  }
}
.mo-controller-group-show {
  right: 40px;
  animation: bounceInRight 0.5s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.mo-controller-group-hidden {
  right: -100px;
  // animation: fadeInRight 0.5s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.mo-controller {
  z-index: 1;
  opacity: 0.6;
  display: none;
  &:hover {
    opacity: 0.8;
  }
}

.outline-wrapper {
  position: relative;
  .outliner {
    position: sticky;
    top: 80px;
    width: 100%;
    height: fit-content;
    max-width: 144px;
    margin-top: 2rem;
    padding-left: 1.5rem;
    padding: 0.5rem;
  }
}

.outline-visible {
  display: none;
}

.article {
  width: 100%;
  min-height: 100vh;
  height: fit-content;
  display: flex;
  justify-content: center;
  color: v-bind('themeVars.textColor1');
  background-color: v-bind('themeVars.cardColor');
}
.wrapper {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.controller {
  position: fixed;
  z-index: 1;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  word-wrap: break-word;
}

.header {
  position: relative;
  .title {
    font-weight: 600;
    font-size: 2.25rem;
    line-height: 2.5rem;
    margin-bottom: 1.5rem;
    height: 40px;
  }
  .intro {
    margin-top: 2rem;
    margin-bottom: 0.25rem;
  }
  .tags {
    display: flex;
    margin-top: 0.75rem;
  }
  .detail {
    display: flex;
    flex-direction: row;
    font-size: 1rem;
    margin-top: 1.5rem;
    overflow: hidden;
    flex-wrap: wrap;
    div {
      display: flex;
      align-items: center;
      margin-right: 1rem;
      span {
        margin-left: 0.25rem;
        opacity: 0.8;
      }
    }
    .author {
      cursor: pointer;
    }
  }
  .n-divider {
    margin-top: 1rem;
  }
}

.main {
  display: flex;
  flex-direction: row;
  width: 100%;
  .content {
    width: 100%;
    // max-width: 880px;
  }
  .editor {
    height: 100%;
    :deep(.textbus-container) {
      height: 100% !important;
      margin: 0 auto;
      outline: none;
      border: none;
      border-radius: 0px;
      .textbus-ui-middle {
        border: none;
        // max-width: v-bind('state.editorWidth');
        // max-width: 880px;
        width: 100%;
        margin: 0 auto;
        // background-color: v-bind('themeVars.cardColor');
        background-color: unset;
      }
    }
  }
}

.divider {
  margin-top: 1rem;
}
@media (min-width: 1280px) {
  .wrapper {
    padding-top: 4rem;
  }
}
@media (min-width: 1024px) {
  .wrapper {
    max-width: 1024px;
  }
}

@include SmallDesktop {
  .header {
    padding: 12px 8px 0px 8px;
    box-sizing: border-box;
  }
  .main {
    .content {
      max-width: 1024px;
    }
    .outliner {
      display: none;
    }
  }
}

@include Mobile {
  .header {
    padding: 12px 8px 0px 8px;
    box-sizing: border-box;
    .detail {
      justify-content: space-between;
      .wordage {
        display: none;
      }
      .duration {
        display: none;
      }
    }
  }

  .main {
    .outliner {
      display: none;
    }
  }

  .controller {
    display: none;
  }
  :deep(.back-top) {
    display: none;
  }

  .mo-controller-group {
    display: block;
  }

  .mo-controller {
    display: flex;
  }
}

.custom-outline {
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.outline-heading-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // color: v-bind('themeVars.textColor3');
  opacity: 0.7;
  &:hover {
    // color: v-bind('themeVars.textColor1');
    opacity: 1;
  }
}
.outline-heading-active {
  // color: v-bind('themeVars.textColor1');
  opacity: 0.95;
}
.outline-heading-h1 {
  line-height: 2;
  padding-left: 0em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h2 {
  line-height: 2;
  padding-left: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h3 {
  line-height: 2;
  padding-left: 2em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h4 {
  line-height: 2;
  padding-left: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h5 {
  line-height: 2;
  padding-left: 4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h6 {
  line-height: 2;
  padding-left: 5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
