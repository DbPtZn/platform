<script lang="ts" setup>
import { NButton, NIcon, NSelect, NSpace, useDialog, useMessage, useThemeVars } from 'naive-ui'
import type { DataTableColumns, DropdownOption, PaginationInfo } from 'naive-ui'
import _ from 'lodash'
import { onMounted, createApp, computed, ref, onUnmounted, h, nextTick } from 'vue'
import type { ParsedArticleFile, Submission } from '@/types'
import useStore from '@/store'
import dayjs from 'dayjs'
import '@textbus/editor/bundles/textbus.min.css'
import { useParser } from './hooks/useParser'
import { RemovedEnum } from '@/enums'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
type Model = Submission
const { userStore, submissionStore, albumListStore } = useStore('manage')
const message = useMessage()
const dialog = useDialog()
const themeVars = useThemeVars()
const router = useRouter()
// const id = computed(() => router.currentRoute.value.query.id as string)
// const page = computed(() => Number(router.currentRoute.value.query.page))
// const docs = computed<Submission[]>(() => submissionStore.items)
onMounted(() => {
  // 初始载入时，自动加载数据
  if (submissionStore.items.length === 0) {
    submissionStore.fetchAndSet({
      filter: { removed: RemovedEnum.NEVER },
      limit: 10,
      page: 1
    })
  }
})
// onUnmounted(() => {
//   console.log('离开')
// })
/** 渲染图标 */
const renderIcon = (name: string) => {
  return h(Icon, { icon: name, height: 'auto' })
}
/** 解析 */
const handleParse = (row: Model) => {
  submissionStore.getUnparsedFile(row.id).then(async res => {
    // console.log(res)
    const data = res.data
    try {
      const parser = useParser()
      const result = await parser.parseContent(data.content)
      // console.log(result)
      submissionStore
        .parse({
          id: row.id,
          content: result.content,
          cover: result.cover.split(window.location.host)[1],
          promoterSequence: data.promoterSequence, // 启动子序列
          keyframeSequence: data.keyframeSequence, // 关键帧序列
          subtitleSequence: data.subtitleSequence, // 字幕序列
          subtitleKeyframeSequence: data.subtitleKeyframeSequence // 字幕关键帧序列
        })
        .then(() => {
          message.success('解析成功')
          row.abbrev = result.content.replace(/<[^>]+>/g, '').slice(0, 100)
          row.isParsed = true
        })
        .catch(error => {
          console.log(error)
          message.error('解析失败,项目文件可能损坏或不符合稿件规范！')
        })
    } catch (error) {
      console.log(error)
    }
  })
}
const handleOpen = (row: Model) => {
  message.success(row.id)
  router.push('/manage/article/' + row.id)
}
const handlePublish = (row: Model, isPublished: boolean) => {
  // submissionStore.publish({
  //   id: row.id,
  //   isPublished: isPublished
  // })
}
const handleDisplay = (row: Model, isDisplayed: boolean) => {
  // submissionStore.display({
  //   id: row.id,
  //   isDisplayed: isDisplayed
  // })
}
const handleRemove = (row: Model) => {
  dialog.warning({
    title: '删除稿件',
    content: '是否删除稿件',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      // submissionStore.remove({
      //   id: row.id
      // })
    }
  })
}

const createColumns = ({ play }: { play: (row: Model) => void }): DataTableColumns<Model> => {
  return [
    {
      title: '类型',
      key: 'type',
      resizable: true,
      width: '8%',
      render: row => renderIcon(row.type === 'note' ? 'mdi:notebook' : 'material-symbols-light:play-lesson-rounded')
    },
    {
      title: '专栏',
      key: 'album',
      resizable: true,
      width: '8%',
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return row.album?.name
      }
    },
    {
      title: '标题',
      key: 'title',
      resizable: true,
      width: '10%',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '内容缩略',
      key: 'abbrev',
      resizable: true,
      width: '10%',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '授权来源',
      key: 'authcode',
      resizable: true,
      width: '10%',
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return row.authcode?.name
      }
    },
    {
      title: '作者',
      key: 'author',
      resizable: true,
      width: '8%',
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return row.penname
      }
    },
    {
      title: '稿件备注',
      key: 'msg',
      resizable: true,
      width: '10%',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '解析状态',
      key: 'isParsed',
      resizable: true,
      width: '6%',
      render: row => renderIcon(row.isParsed ? 'mdi:email-open' : 'material-symbols-light:mail-lock')
    },
    {
      title: '是否公开',
      key: 'isPublished',
      resizable: true,
      width: '6%',
      render: row => renderIcon(row.isPublished ? 'material-symbols:share' : 'material-symbols:share-off')
    },
    {
      title: '是否展示',
      key: 'isDisplayed',
      resizable: true,
      width: '6%',
      render: row => renderIcon(row.isDisplayed ? 'material-symbols:visibility-rounded' : 'material-symbols:visibility-off')
    },
    {
      title: '更新时间',
      key: 'updateAt',
      resizable: true,
      width: '12%',
      sortOrder: false,
      sorter: 'default',
      render(row) {
        return dayjs(row.updateAt).format('YYYY-MM-DD HH:mm:ss')
      }
      // sorter(rowA, rowB) {
      //   return Number(rowA.updateAt) - Number(rowB.updateAt)
      // }
    },
    {
      title: '创建时间',
      key: 'createAt',
      resizable: true,
      width: '12%',
      sortOrder: false,
      sorter: 'default',
      render(row) {
        return dayjs(row.createAt).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      title: '操作',
      key: 'actions',
      width: '12%',
      minWidth: '200px',
      maxWidth: '200px',
      render(row) {
        return h(
          NSpace,
          { align: 'baseline' },
          {
            default: () => [
              h(
                NButton,
                {
                  strong: true,
                  type: 'primary',
                  size: 'small',
                  onClick: () => {
                    row.isParsed ? handleOpen(row) : handleParse(row)
                  }
                },
                {
                  default: () => {
                    return row.isParsed ? '打开' : '解析'
                  }
                }
              ),
              h(
                NButton,
                {
                  show: !row.isParsed,
                  strong: true,
                  tertiary: true,
                  size: 'small',
                  onClick: () => {
                    if (row.isParsed) {
                      const opitons = albumListStore.data.map(item => {
                        return {
                          key: item.id,
                          label: item.name,
                          value: item.id
                        }
                      })
                      const albumVal = ref(row.album?.id)
                      dialog.create({
                        title: '选择一个专栏',
                        content: () =>
                          h(NSelect, {
                            value: albumVal.value,
                            options: opitons,
                            onUpdateValue: value => {
                              albumVal.value = value
                            }
                          }),
                        icon: () => renderIcon('material-symbols-light:folder-data-rounded'),
                        positiveText: '确定',
                        negativeText: '取消',
                        onPositiveClick: () => {
                          albumVal.value &&
                            submissionStore
                              .allot({
                                articleId: row.id,
                                albumId: albumVal.value
                              })
                              .then(() => {
                                message.success('专栏分配成功')
                              })
                          // $fetch(`/api/manage/article/allot`, {
                          //   method: 'POST',
                          //   body: dto
                          // }).then(() => {
                          //   const index = docs.value.findIndex(item => item.id === row.id)
                          //   const album = albumListStore.data.find(item => item.id === albumVal.value)
                          //   if(!album) return
                          //   docs.value[index].album = album
                          // })
                        },
                        onNegativeClick: () => {
                          message.error('取消')
                        }
                      })
                      return
                    }
                    dialog.create({
                      title: '确定拒稿？',
                      content: '一旦拒稿将无法再恢复，请谨慎确认！',
                      icon: () => renderIcon('material-symbols:do-not-touch-sharp'),
                      positiveText: '确定',
                      negativeText: '取消',
                      onPositiveClick: () => {
                        // $fetch(`/api/manage/authcode/delete/${row.id}`, {
                        //   method: 'delete'
                        // }).then(() => {
                        //   const index = data.value.findIndex(item => item.id === row.id)
                        //   data.value.splice(index, 1)
                        // })
                      },
                      onNegativeClick: () => {
                        message.error('取消')
                      }
                    })
                  }
                },
                { default: () => (row.isParsed ? '分配' : '拒稿') }
              ),
              row.isParsed &&
                h(
                  NButton,
                  {
                    strong: true,
                    tertiary: true,
                    size: 'small',
                    onClick: (e: MouseEvent) => {
                      targetRow.value = row
                      e.preventDefault()
                      e.stopPropagation()
                      showDropdownRef.value = false
                      let target = e.target as HTMLElement
                      if(target.tagName !== 'BUTTON') {
                        target = target.parentElement as HTMLElement
                      }
                      const rect = target.getBoundingClientRect()
                      nextTick().then(() => {
                        showDropdownRef.value = true
                        xRef.value = rect.x
                        yRef.value = rect.y + rect.height
                      })
                    }
                  },
                  {
                    default: () => {
                      return '更多'
                    }
                  }
                )
            ]
          }
        )
      }
    }
  ]
}

/** 展示列 */
const cities = ref([
  'type',
  'title',
  'abbrev',
  'authcode',
  'album',
  'msg',
  'author',
  'isParsed',
  'isPublished',
  'isDisplayed',
  'updateAt',
  'createAt',
  'actions'
])
const columnSelect = ref(false)
const columns = computed(() => createColumns({ play(row) {} }).filter((c: any) => cities.value.includes(c.key)))
// console.log(albums)

/** 排序 */

function handleSorterChange(sorter: any) {
  columns.value.forEach((column: any) => {
    /** column.sortOrder !== undefined means it is uncontrolled */
    if (column.sortOrder === undefined) return
    if (!sorter) {
      column.sortOrder = false
      return
    }
    if (column.key === sorter.columnKey) column.sortOrder = sorter.order
    else column.sortOrder = false
  })
}

/** 右键菜单 */
const targetRow = ref<null | Model>(null)
const showDropdownRef = ref()
const xRef = ref(0)
const yRef = ref(0)
function handleClickoutside() {
  showDropdownRef.value = false
}
function handleSelect() {
  showDropdownRef.value = false
}
const rowProps = (row: Model) => {
  return {
    style: { height: '59px' },
    onContextmenu: (e: MouseEvent) => {
      targetRow.value = row
      // message.info(JSON.stringify(row, null, 2))
      e.preventDefault()
      showDropdownRef.value = false
      nextTick().then(() => {
        showDropdownRef.value = true
        xRef.value = e.clientX
        yRef.value = e.clientY
      })
    }
  }
}

const generateOptions = (row: Model | null): DropdownOption[] => {
  if (!row) return []
  return [
    {
      label: () => (row.isParsed ? '打开' : '解析'),
      key: 'parseAndOpen',
      props: {
        onClick: () => {
          targetRow.value && handleParse(targetRow.value)
        }
      }
    },
    {
      label: '分配',
      key: 'allot',
      show: row.isParsed,
      props: {
        onClick: () => {
          // targetRow.value && handleParse(targetRow.value)
        }
      }
    },
    {
      label: () => (row.isPublished ? '取消公开' : '公开'),
      key: 'publish',
      show: row.isParsed,
      props: {
        onClick: () => {
          // targetRow.value && handleParse(targetRow.value)
        }
      }
    },
    {
      label: () => (row.isPublished ? '取消展示' : '展示'),
      key: 'display',
      show: row.isParsed,
      props: {
        onClick: () => {
          // targetRow.value && handleParse(targetRow.value)
        }
      }
    },
    {
      label: '拒稿',
      show: !row.isParsed,
      key: 'Refusal',
      props: {
        onClick: () => {
          dialog.create({
            title: '是否彻底删除？',
            icon: () => renderIcon('material-symbols:do-not-touch-sharp'),
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
              // targetRow.value && $fetch(`/api/manage/authcode/delete/${targetRow.value?.id}`, {
              //   method: 'delete'
              // }).then(() => {
              //   const index = data.value.findIndex(row => row.id === targetRow.value?.id)
              //   data.value.splice(index, 1)
              // })
            },
            onNegativeClick: () => {
              message.error('取消')
            }
          })
        }
      }
    },
    {
      label: '移除',
      show: row.isParsed,
      key: 'delete',
      props: {
        onClick: () => {
          dialog.create({
            title: '是否彻底删除？',
            icon: () => renderIcon('material-symbols:do-not-touch-sharp'),
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: () => {
              // targetRow.value && $fetch(`/api/manage/authcode/delete/${targetRow.value?.id}`, {
              //   method: 'delete'
              // }).then(() => {
              //   const index = data.value.findIndex(row => row.id === targetRow.value?.id)
              //   data.value.splice(index, 1)
              // })
            },
            onNegativeClick: () => {
              message.error('取消')
            }
          })
        }
      }
    }
  ]
}

const showSelectOption = ref(submissionStore.isParsed)
const showSelectOptions = [
  { label: '全部', value: 'all' },
  { label: '已解析', value: 'true' },
  { label: '未解析', value: 'false' }
]
function handleShowSelectOptionUpdate(value) {
  // console.log(value)
  submissionStore.isParsed = value
  // submissionStore.fetch({
  //   filter: { id: id.value, removed: RemovedEnum.NEVER },
  //   limit: 2,
  //   page: 1
  // }).then(data => docs.value = data)
}

/** 翻页 */
function handlePageChange(page: number) {
  submissionStore.fetchAndSet({
    filter: { removed: RemovedEnum.NEVER },
    limit: 10,
    page: page || 1
  })
}
</script>

<template>
  <div class="submission-manage">
    <div class="header">
      <div class="group">
        <n-flex>
          <!-- 显示筛选 -->
          <n-button secondary @click="columnSelect = !columnSelect"> 列可见 </n-button>
        </n-flex>
      </div>
      <div class="group" v-show="columnSelect">
        <n-checkbox-group v-model:value="cities">
          <n-space item-style="display: flex;">
            <n-checkbox value="type" label="类型" />
            <n-checkbox value="album" label="专栏" />
            <n-checkbox value="title" label="标题" />
            <n-checkbox value="abbrev" label="内容" />
            <n-checkbox value="authcode" label="授权来源" />
            <n-checkbox value="author" label="作者" />
            <n-checkbox value="msg" label="稿件备注" />
            <n-checkbox value="isParsed" label="解析状态" />
            <n-checkbox value="isPublished" label="是否公开" />
            <n-checkbox value="isDisplayed" label="是否展示" />
            <n-checkbox value="updateAt" label="更新时间" />
            <n-checkbox value="createAt" label="创建时间" />
            <n-checkbox value="actions" label="操作" />
          </n-space>
        </n-checkbox-group>
      </div>
      <div class="group">
        <n-select
          v-model:value="showSelectOption"
          :options="showSelectOptions"
          :consistent-menu-width="false"
          @update:value="handleShowSelectOptionUpdate"
        />
      </div>
    </div>
    <n-data-table :columns="columns" :data="submissionStore.items" :bordered="false" :row-props="rowProps" @update:sorter="handleSorterChange" />
    <div class="footer">
      <n-pagination v-model:page="submissionStore.meta.currentPage" :page-count="submissionStore.getTotalPages" @update:page="handlePageChange" />
    </div>
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="xRef"
      :y="yRef"
      :options="generateOptions(targetRow)"
      :show="showDropdownRef"
      :on-clickoutside="handleClickoutside"
      @select="handleSelect"
    />
  </div>
</template>

<style lang="scss" scoped>
.submission-manage {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: v-bind('themeVars.cardColor');
  .header {
    height: 60px;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .group {
      display: flex;
      align-items: center;
      flex-direction: row;
      font-size: 16px;
      font-weight: 500;
      margin: 0 24px;
      cursor: pointer;
    }
  }
}
.footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
}
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
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
  background-color: var(--dpz-scrollbarColor);
}
</style>
