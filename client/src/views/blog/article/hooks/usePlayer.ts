/** 导出编辑器配置 */
// import type { EditorOptions } from '@textbus/editor'

import { fromEvent, type Injector } from '@textbus/core'
import {
  LinkJumpTipPlugin,
  defaultComponentLoaders,
  defaultComponents,
  defaultFormatLoaders,
  defaultFormatters,
  type Editor,
  type EditorOptions,
  createEditor
} from '@textbus/editor'
import { Input, type CaretLimit } from '@textbus/platform-browser'
import {
  rootPlayerComponent,
  type CourseData,
  rootPlayerComponentLoader,
  colorFormatLoader,
  colorFormatter,
  textBackgroundColorFormatLoader,
  textBackgroundColorFormatter,
  AnimeEventService,
  AnimeProvider,
  DialogProvider,
  OutlinePlugin,
  OutlineService,
  Player,
  PlayerContextMenuPlugin,
  RootEventService,
  Structurer,
  ThemeProvider,
  animeIgnoreComponent,
  animeIgnoreComponentLoader,
  animePlayerComponent,
  animePlayerComponentLoader,
  animePlayerFormatLoader,
  animePlayerFormatter,
  forwardTool,
  replayTool,
  rewindTool,
  speedDownTool,
  speedUpTool,
  startTool,
  stopTool,
  volumeDownTool,
  volumeUpTool,
  Controller,
} from '@/editor'
import type { Article, PublicArticleType } from '@/types'
import { Ref, watch } from 'vue'
import useStore from '@/store'

async function getConfig(args: {
  rootRef: HTMLElement
  editorRef: HTMLElement
  scrollerRef: HTMLElement
  outlineRef?: HTMLElement
  controllerRef?: HTMLElement
  content?: string
}) {
  const { rootRef, editorRef, scrollerRef, outlineRef, controllerRef, content } = args
  const config: EditorOptions = {
    theme: 'darkline',
    autoFocus: true,
    autoHeight: true,
    zenCoding: true,
    historyStackSize: 30,
    placeholder: '在此输入正文',
    readonly: true,
    content: content || '',
    rootComponent: rootPlayerComponent,
    rootComponentLoader: rootPlayerComponentLoader,
    components: [animePlayerComponent, animeIgnoreComponent, ...defaultComponents],
    componentLoaders: [animePlayerComponentLoader, animeIgnoreComponentLoader, ...defaultComponentLoaders],
    formatters: [animePlayerFormatter, colorFormatter, textBackgroundColorFormatter, ...defaultFormatters],
    formatLoaders: [animePlayerFormatLoader, colorFormatLoader, textBackgroundColorFormatLoader, ...defaultFormatLoaders],
    styleSheets: [],
    providers: [Player, OutlineService, DialogProvider, AnimeProvider, RootEventService, AnimeEventService, Structurer, ThemeProvider],
    plugins: [
      () =>
        new Controller(
          [speedDownTool, rewindTool, startTool, forwardTool, speedUpTool, replayTool, stopTool, volumeUpTool, volumeDownTool],
          controllerRef!
        ),
      () => new PlayerContextMenuPlugin(),
      () => new OutlinePlugin(outlineRef, false),
      () => new LinkJumpTipPlugin()
    ],
    setup(injector: Injector) {
      const input = injector.get(Input)
      input.caret.correctScrollTop({
        onScroll: fromEvent(scrollerRef, 'scroll'),
        getLimit(): CaretLimit {
          const rect = scrollerRef.getBoundingClientRect()
          return {
            top: 0,
            bottom: rect.height + rect.top
          }
        },
        setOffset(offsetScrollTop: number) {
          scrollerRef.scrollTop += offsetScrollTop
        }
      })
      /** 依赖注入 */
      // 主题依赖
      const themeProvider = injector.get(ThemeProvider)
      themeProvider.setup(injector)
      // 组成元素
      const structurer = injector.get(Structurer)
      structurer.setup({
        rootRef,
        scrollerRef,
        editorRef,
        controllerRef
      })
      /** 大纲视图 */
      const outlineService = injector.get(OutlineService)
      outlineService.setup(true)
      // outlineService.handleExpand()
      /** 播放器依赖注入 */
      const player = injector.get(Player)
      player.setup(injector, scrollerRef, scrollerRef)
    }
  }
  return config
}

export function usePlayer(args: {
  data: Article | PublicArticleType
  rootRef: Ref<HTMLElement>
  editorRef: Ref<HTMLElement>
  scrollerRef: Ref<HTMLElement>
  controllerRef: Ref<HTMLElement>
  outlineRef?: Ref<HTMLElement>
}) {
  const { data, rootRef, editorRef, scrollerRef, outlineRef, controllerRef } = args
  let editor: Editor
  return new Promise<Editor>(async (resolve, reject) => {
    /** 判断设备 */
    const userAgent = navigator.userAgent.toLowerCase()
    // 常见的移动设备标识
    const mobileDevices = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i
    const isMobile = mobileDevices.test(userAgent)
    // 非移动端的时候，自动加载/缓存音频数据 (某些移动端浏览器可能禁止自动加载媒体数据)
    let courseData: CourseData | null = null
    if (!isMobile) {
      // 音频换源
      const aud = new Audio()
      const result = aud.canPlayType('audio/ogg')
      if (result === '') data.audio = data.audio.replace('.ogg', '.mp3')

      courseData = {
        audio: data.audio,
        duration: data.duration || 0,
        promoterSequence: data.promoterSequence,
        keyframeSequence: data.keyframeSequence,
        subtitleSequence: data.subtitleSequence,
        subtitleKeyframeSequence: data.subtitleKeyframeSequence
      }
    }
    // console.log(courseData)
    const content = data.content
    // console.log(content)
    try {
      const config = await getConfig({
        rootRef: rootRef.value,
        editorRef: editorRef.value,
        scrollerRef: scrollerRef.value,
        controllerRef: controllerRef.value,
        outlineRef: outlineRef?.value || undefined,
        content
      })
      editor = createEditor(config)
      editor.mount(editorRef.value).then(() => {
        const themeProvider = editor?.get(ThemeProvider)
        // const appConfig = useAppConfig()
        const { settingStore } = useStore()
        themeProvider?.handleThemeUpdate(settingStore.theme)
        watch(
          () => settingStore.theme,
          () => {
            const themeProvider = editor?.get(ThemeProvider)
            // console.log(appConfig.theme.dark)
            themeProvider?.handleThemeUpdate(settingStore.theme)
          }
        )
        /** 载入微课数据 */
        if (data.type === 'course' && courseData) {
          const player = editor?.get(Player)
          player.loadData([courseData]).catch((error) => {
            console.error('加载动画数据失败:', error)
            reject(error)
          })
        }
      })
      resolve(editor)
    } catch (error) {
      reject(error)
    }
  })
}