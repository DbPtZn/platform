<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'
import { computed, onUnmounted, ref } from 'vue'
import { onMounted, onBeforeUnmount } from 'vue'
import dayjs from 'dayjs'
import type { Article } from '@/types'
import { usePlayer } from './hooks/usePlayer'
import type { Editor } from '@textbus/editor'
import '@/editor/style.css'
import 'material-icons/iconfont/material-icons.css'
import { useRoute, useRouter } from 'vue-router'
import { RemovedEnum } from '@/enums'
import { Player, OutlineService, DialogProvider, AnimeProvider, Structurer, ThemeProvider, RootEventService, AnimeEventService } from '@/editor'
import { manageApi } from '@/api'
const themeVars = useThemeVars()
const route = useRoute()
const scrollerRef = ref()
const controllerRef = ref()
const editorRef = ref()
const rootRef = ref()
const router = useRouter()
const id = computed(() => router.currentRoute.value.params.id as string)
const state = ref<Article>({
  id: '',
  UID: '',
  userId: '',
  // authcodeId: '',
  albumId: '',
  type: 'other',
  isParsed: false,
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
  editionId: '',
  // fromEditionId: '',
  msg: '',
  removed: RemovedEnum.NEVER,
  createAt: '',
  updateAt: '',
  unparsedFile: '',
  refuseMsg: '',
  agentId: '',
  isMultiEdition: false,
  isCurrent: false
})

let player: Editor
onMounted(() => {
  console.log(id.value)
  manageApi.submission.get<Article>(id.value).then(res => {
    // console.log(res)
    res.data.audio = res.data.audio
    // console.log(res.data.audio)
    state.value = res.data
    usePlayer({
      rootRef,
      editorRef,
      scrollerRef,
      controllerRef,
      data: state.value
    }).then(res => {
      player = res
      // console.log(player)
    })
  })
})

onUnmounted(() => {
  try {
    console.log('销毁依赖')
    player.get(Player).destory()
    player.get(OutlineService).destory()
    player.get(DialogProvider).destory()
    player.get(AnimeProvider).destory()
    player.get(Structurer).destory()
    player.get(ThemeProvider).destory()
    player.get(RootEventService).destory()
    player.get(AnimeEventService).destory()
    player.destroy()
    console.log('编辑器是否已经销毁：' + player.destroyed)
  } catch (error) {
    console.log(error)
    console.error('编辑器销毁失败！')
  }
})
</script>

<template>
  <div class="product" ref="rootRef">
    <div class="product-wrapper" :bordered="false">
      <div ref="scrollerRef" class="product-scroller">
        <!-- 文章头部 -->
        <div class="product-header">
          <div class="product-header-item">作者：{{ state.penname }}</div>
          <div class="product-header-item">时间：{{ dayjs(state.createAt).format('YYYY-MM-DD HH:mm:ss') }}</div>
          <div class="product-header-item">字数：{{ state.wordage }}</div>
          <div class="product-header-item" v-if="state.type === 'course' && state.duration">
            时长：{{
              dayjs()
                .minute(Math.floor(state.duration / 60))
                .second(state.duration % 60)
                .format('mm:ss')
            }}
          </div>
        </div>
        <n-divider class="product-header-divider" dashed />
        <!-- 文章主体 -->
        <div class="product-main">
          <div class="product-title">{{ state.title }}</div>
          <div ref="editorRef" class="editor" />
        </div>
        <n-divider class="product-footer-divider" dashed />
      </div>
    </div>
    <div v-show="state.type === 'course'" ref="controllerRef" :class="['controller']"></div>
  </div>
</template>

<style lang="scss" scoped>
$--header-height: 60px;
.product {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 0 88px;
  box-sizing: border-box;
  background-color: v-bind('themeVars.cardColor');
}
.product-wrapper {
  width: 100%;
}
.scroller {
  height: 100%;
  width: 100%;
}
.controller {
  position: absolute;
  right: 0;
  height: 100%;
  // width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  transition: all 0.2s ease-in-out;
  z-index: 1;
  word-wrap: break-word;
  // border-left: 1px solid v-bind('themeVars.dividerColor');
}
.product-header {
  height: 65px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0 12px;
  color: v-bind('themeVars.textColor3');
  .product-header-item {
    margin-left: 24px;
  }
}
.product-header-divider {
  padding-top: 0;
  margin-top: 0;
}

.product-main {
  min-height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  // .scroller {
  //   display: flex;
  //   flex-direction: column;
  //   width: 100%;
  //   overflow-y: auto;
  //   overflow-x: hidden;
  //   background-color: v-bind('themeVars.bodyColor');
  // }
  .product-title {
    font-size: 36px;
    font-weight: 600;
    color: v-bind('themeVars.textColor1');
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
        background-color: v-bind('themeVars.cardColor');
      }
    }
  }
  // .editor {
  //   height: 100%;
  //   min-height: 75vh;
  //   // overflow-x: hidden;
  //   :deep(.textbus-container) {
  //     height: 100% !important;
  //     margin: 0 auto;
  //     padding: 0;
  //     outline: none;
  //     border: none;
  //     border-radius: 0px;
  //     .tb-root {
  //       padding: 0;
  //     }
  //     .textbus-ui-middle {
  //       color: #000000; // 默认颜色
  //       border: none;
  //       width: 100%;
  //       margin: 0 auto;
  //       background-color: v-bind('themeVars.cardColor');
  //     }
  //   }
  // }
}

.product-scroller {
  height: calc(100vh - #{$--header-height});
  overflow-y: auto;
  box-sizing: border-box;
  padding-bottom: 32px;
  // margin-bottom: 15px;
  /** 定制滚动条 */
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 6px;
    height: 16px;
    // background-color: v-bind('themeVars.scrollbarColor');
    background-color: unset;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  &::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); */
    border-radius: 10px;
    // background-color: v-bind('themeVars.scrollbarColor');
    background-color: unset;
  }

  // /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: unset;
    background-color: unset;
  }
}
.scrollbar-hide {
  // /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: unset;
    background-color: unset !important;
  }
}
</style>
