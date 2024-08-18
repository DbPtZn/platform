<script lang="ts" setup>
import { NButton, NSelect, NSpace, NText, useDialog, useMessage, useThemeVars } from 'naive-ui'
import type { DataTableColumns, DropdownOption } from 'naive-ui'
import _ from 'lodash'
import { onMounted, computed, ref, h, nextTick } from 'vue'
import type { Submission, SubmissionChild } from '@/types'
import useStore from '@/store'
import dayjs from 'dayjs'
import '@textbus/editor/bundles/textbus.min.css'
import { useParser } from './hooks/useParser'
import { RemovedEnum } from '@/enums'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { RowData } from 'naive-ui/es/data-table/src/interface'
type Model = Submission
const { userStore, submissionStore, albumListStore } = useStore('manage')
const message = useMessage()
const dialog = useDialog()
const themeVars = useThemeVars()
const router = useRouter()
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
const rowClassName = (row: Model) => {
  if (row.isSame) {
    return 'same'
  }
  if (row.isCurrent) {
    return 'current'
  }
  return ''
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

const handleAllot = (row: Model) => {
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
    },
    onNegativeClick: () => {
      message.error('取消')
    }
  })
}
const handlePublish = (row: Model, isPublished: boolean) => {
  submissionStore.updatePublishStatus(row.id, isPublished)
}
const handleDisplay = (row: Model, isDisplayed: boolean) => {
  submissionStore.updateDisplayStatus(row.id, isDisplayed)
}
const handleRefuse = (row: Model) => {
  dialog.warning({
    icon: () => renderIcon('material-symbols:do-not-touch-sharp'),
    title: '拒绝稿件',
    content: '一旦拒稿将无法再恢复，请谨慎确认！',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      submissionStore.refuse({
        id: row.id,
        msg: ''
      })
    },
    onNegativeClick: () => {
      message.error('取消')
    }
  })
}

const handleDelete = (row: Model) => {
  dialog.warning({
    title: '删除稿件',
    content: '是否删除稿件',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      submissionStore.delete(row.id)
    }
  })
}

const handleSetCurrent = (row: Model) => {
  submissionStore.updateCurrentEdition(row.id).then(data => {
    // const children = row.isLeaf !== undefined ? row.children : (row as unknown as SubmissionChild).parent?.children
    // if (children) {
    //   // 找到所有的子节点（发生更新的版本）
    //   children.forEach(c => {
    //     // 更新所有关联版本的数据
    //     const index = submissionStore.items.findIndex(item => item.id === c.id)
    //     if(index !== -1) {
    //       submissionStore.items[index].isCurrent = c.id === row.id ? true : false
    //       if (submissionStore.items[index].children && submissionStore.items[index].children.length > 0) {
    //         submissionStore.items[index].children = submissionStore.items[index].children.map(child => {
    //           child.isCurrent = child.id === row.id ? true : false
    //           return child
    //         })
    //       }
    //     }
    //   })
    // } else {
    //   // 未展开的情况无法获取 children 但仍需要更新所有关联项目
    //   submissionStore.items.forEach(item => {
    //     if(item.editionId === row.editionId) {
    //       item.isCurrent = item.id === row.id ? true : false
    //     }
    //   })
    // }
    // 更新所有关联版本的数据
    submissionStore.items.forEach(item => {
      if(item.editionId === row.editionId) {
        item.isCurrent = item.id === row.id ? true : false
        // 若是有子节点也要更新
        if (item.children && item.children.length > 0) {
          item.children = item.children.map(child => {
            child.isCurrent = child.id === row.id ? true : false
            return child
          })
        }
      }
    })
  })
}

const createColumns = ({ play }: { play: (row: Model) => void }): DataTableColumns<Model> => {
  return [
    // {
    //   type: 'expand',
    //   expandable: rowData => rowData.title !== '',
    //   renderExpand: (rowData) => {
    //     return `is a good guy.`
    //   }
    // },
    {
      title: '类型',
      key: 'type',
      resizable: true,
      width: '9%',
      render: row =>
        row.isLeaf !== undefined
          ? renderIcon(row.type === 'note' ? 'mdi:notebook' : 'material-symbols-light:play-lesson-rounded')
          : `${row.isSame ? '( 展开项 )' : ''}`
      // render: row => h('span', { style: { display: 'inline-flex', alginItems: 'center', justifyContent: 'center' } }, [
      //   renderIcon(row.type === 'note' ? 'mdi:notebook' : 'material-symbols-light:play-lesson-rounded'),
      //   row.isSame ? '(展开项)' : ''
      // ])
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
      width: '14%',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '授权来源',
      key: 'authcode',
      resizable: true,
      width: '8%',
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
      width: '6%',
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
      width: '8%',
      ellipsis: {
        tooltip: true
      }
    },
    {
      title: '主版本',
      key: 'isCurrent',
      resizable: true,
      width: '5%',
      render: row => renderIcon(row.isCurrent ? 'material-symbols-light:brightness-empty' : '')
    },
    {
      title: '解析状态',
      key: 'isParsed',
      resizable: true,
      width: '6%',
      render: row => (row.isLeaf !== undefined ? renderIcon(row.isParsed ? 'mdi:email-open' : 'material-symbols-light:mail-lock') : '')
    },
    {
      title: '是否公开',
      key: 'isPublished',
      resizable: true,
      width: '6%',
      render: row => (row.isPublished !== undefined ? renderIcon(row.isPublished ? 'material-symbols:share' : 'material-symbols:share-off') : '')
    },
    {
      title: '是否展示',
      key: 'isDisplayed',
      resizable: true,
      width: '6%',
      render: row =>
        row.isDisplayed !== undefined ? renderIcon(row.isDisplayed ? 'material-symbols:visibility-rounded' : 'material-symbols:visibility-off') : ''
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
      title: '投稿时间',
      key: 'createAt',
      resizable: true,
      width: '11%',
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
              // 打开 解析
              !(row.isLeaf === undefined && !row.isParsed) &&
                h(
                  NButton,
                  {
                    style: { display: row.isLeaf === undefined && !row.isParsed ? 'none' : 'block' },
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
              // 分配 拒稿
              row.isLeaf !== undefined &&
                h(
                  NButton,
                  {
                    style: { display: row.isLeaf === undefined ? 'none' : 'block' },
                    show: !row.isParsed,
                    strong: true,
                    tertiary: true,
                    size: 'small',
                    onClick: () => {
                      if (row.isParsed) {
                        handleAllot(row)
                        return
                      }
                      handleRefuse(row)
                    }
                  },
                  { default: () => (row.isParsed ? '分配' : '拒稿') }
                ),
              // 更多选项
              row.isParsed &&
                row.isLeaf !== undefined &&
                h(
                  NButton,
                  {
                    style: { display: row.isLeaf === undefined ? 'none' : 'block' },
                    strong: true,
                    tertiary: true,
                    size: 'small',
                    onClick: (e: MouseEvent) => {
                      e.preventDefault()
                      e.stopPropagation()
                      targetRow.value = row
                      showDropdownRef.value = false
                      let target = e.target as HTMLElement
                      if (target.tagName !== 'BUTTON') {
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
                ),
              row.isLeaf === undefined &&
                row.isParsed &&
                h(
                  NButton,
                  {
                    strong: true,
                    tertiary: true,
                    size: 'small',
                    disabled: row.isCurrent,
                    onClick: () => {
                      handleSetCurrent(row)
                    }
                  },
                  { default: () => (row.isCurrent ? '主版本' : '设为主版本') }
                ),
              row.isLeaf === undefined && !row.isParsed && h(NText, {}, { default: () => '未解析项目无法进行操作' })
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
  'isCurrent',
  'isParsed',
  'isPublished',
  'isDisplayed',
  // 'updateAt',
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
  if (!row || row.isLeaf === undefined) return []
  return [
    {
      label: () => (row.isParsed ? '打开' : '解析'),
      key: 'parseAndOpen',
      props: {
        onClick: () => {
          row && handleParse(row)
        }
      }
    },
    {
      label: '分配',
      key: 'allot',
      show: row.isParsed,
      props: {
        onClick: () => {
          row && handleAllot(row)
        }
      }
    },
    {
      label: () => !row.isCurrent && '设为主版本',
      key: 'current',
      show: !row.isCurrent,
      props: {
        onClick: () => {
          row && handleSetCurrent(row)
        }
      }
    },
    {
      label: () => (row.isPublished ? '取消公开' : '公开'),
      key: 'publish',
      show: row.isParsed,
      props: {
        onClick: () => {
          row && handlePublish(row, !row.isPublished)
        }
      }
    },
    {
      label: () => (row.isDisplayed ? '取消展示' : '展示'),
      key: 'display',
      show: row.isParsed,
      props: {
        onClick: () => {
          row && handleDisplay(row, !row.isDisplayed)
        }
      }
    },
    {
      label: '拒稿',
      show: !row.isParsed,
      key: 'Refusal',
      props: {
        onClick: () => {
          row && handleRefuse(row)
        }
      }
    },
    {
      label: '删除',
      show: row.isParsed,
      key: 'delete',
      props: {
        onClick: () => {
          row && handleDelete(row)
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
function handleRefresh() {
  submissionStore.fetchAndSet({
    filter: { removed: RemovedEnum.NEVER },
    limit: 10,
    page: 1
  })
}
function onLoad(row: Model | RowData) {
  return new Promise<void>(resolve => {
    submissionStore.fetchEditions(row.editionId).then(res => {
      row.children = res.data.map(item => {
        return {
          parent: row,
          isSame: row.id === item.id,
          ...item
        }
      })
      resolve()
    })
  })
}
</script>

<template>
  <div class="submission-manage">
    <div class="header">
      <div class="group">
        <n-flex>
          <n-button secondary @click="handleRefresh"> 刷新列表 </n-button>
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
            <n-checkbox value="isCurrent" label="主版本" />
            <n-checkbox value="isParsed" label="解析状态" />
            <n-checkbox value="isPublished" label="是否公开" />
            <n-checkbox value="isDisplayed" label="是否展示" />
            <n-checkbox value="updateAt" label="更新时间" />
            <n-checkbox value="createAt" label="创建时间" />
            <n-checkbox value="actions" label="操作" />
          </n-space>
        </n-checkbox-group>
      </div>
      <!-- 数据筛选 -->
      <!-- <div class="group">
        <n-select
          v-model:value="showSelectOption"
          :options="showSelectOptions"
          :consistent-menu-width="false"
          @update:value="handleShowSelectOptionUpdate"
        />
      </div> -->
    </div>
    <n-data-table
      :columns="columns"
      :data="submissionStore.items"
      :bordered="false"
      :row-props="rowProps"
      :row-class-name="rowClassName"
      @update:sorter="handleSorterChange"
      @load="onLoad"
    />
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
:deep(.same td) {
  color: #f0f9eb60 !important;
  // cursor: not-allowed;
}
// :deep(.current td) {
//   color: rgb(255, 242, 218)!important;
// }
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
