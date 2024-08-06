<script lang="ts" setup>
import { NButton, NInput, useDialog, useMessage, useThemeVars, type DropdownOption } from 'naive-ui'
import CreateAlbumForm from './private/CreateAlbumForm.vue'
import { computed, h, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { VueDraggable, type SortableEvent } from 'vue-draggable-plus'
import useStore from '@/store'
import AlbumItem from './private/AlbumItem.vue'
import { useRouter } from 'vue-router'
import { Album } from '@/types'
const themeVars = useThemeVars()
const message = useMessage()
const dialog = useDialog()
const router = useRouter()
const { albumListStore, albumStore, userStore } = useStore('manage')
onMounted(() => {
  // 获取数据
  albumListStore.get()
})

/** 折叠面板 */
const expandedNames = ref<any[]>(['1'])
function handleExpandedNamesChange(args: Array<any>) {
  expandedNames.value = args
}
/** 显示未分配管理 */
// function handleUnfiledShow() {}
/** 专栏相关方法 */
const albumMethods = {
  /** 添加专栏按钮 */
  handleAddClick(ev: PointerEvent) {
    ev.preventDefault()
    ev.stopPropagation()
    dialog.create({
      title: '新建专栏',
      icon: () => h(Icon, { icon: 'material-symbols:create-new-folder-outline-rounded', style: { marginBottom: '8px' } }),
      content: () =>
        h(CreateAlbumForm, {
          onSubmit(res) {
            // console.log(res)
            albumListStore.create(res)
            dialog.destroyAll()
          }
        })
    })
  },
  handleItemClick(id: string) {
    // console.log(id)
    //
  },
  handleToAuthManage() {
    router.push('./manage/auth')
  },
  /** 生成下拉列表选项 */
  generateOptions: (collection: any): DropdownOption[] => {
    return [
      {
        label: `${collection.isPublish ? '设为私密' : '设为公开'}`,
        key: 'publish',
        props: {
          onClick: () => {
            //
          }
        }
      },
      {
        key: 'header-divider',
        type: 'divider'
      },
      {
        label: '设置',
        key: 'settings',
        disabled: true,
        props: {
          onClick: () => {
            //
          }
        }
      },
      {
        label: '重命名',
        key: 'rename',
        props: {
          onClick: () => {
            const newname = ref(collection.name)
            dialog.create({
              icon: () => h(Icon, { icon: 'DriveFileRenameOutlineFilled', height: '24px' }),
              title: '文件夹重命名',
              content: () =>
                h(NInput, {
                  type: 'text',
                  placeholder: '输入新名称',
                  maxlength: 32,
                  showCount: true,
                  value: newname.value,
                  onInput: value => {
                    newname.value = value
                  }
                }),
              positiveText: '确定',
              negativeText: '取消',
              maskClosable: true,
              onPositiveClick: () => {
                if (newname.value === collection.name) return
                if (newname.value === '') message.error('专栏名称不能为空！')
                if (newname.value && collection.id) {
                  // collectionsDataStore.rename(collection.id, newname.value).then(() => {
                  //   collection.name = newname.value
                  //   if (collectionStore.id === collection.id) {
                  //     collectionStore.name = newname.value
                  //   }
                  // })
                }
              }
            })
          }
        }
      },
      {
        label: '移除',
        key: 'remove',
        props: {
          onClick: () => {
            // collectionsDataStore.remove(collection.id)
          }
        }
      }
    ]
  },
}
const dropMethods = {
  handleDrop(ev: DragEvent, collectionId: string, isPublish: boolean) {
    const fileId = ev.dataTransfer?.getData('id')
    if (!fileId) return
    // console.log([fileId, collectionId])
    // productStore
    //   .allocation({
    //     id: fileId,
    //     collectionId: collectionId,
    //     isPublish: isPublish
    //   })
    //   .then(res => {
    //     collectionStore.removeSubfileById(fileId)
    //   })
    //   .catch(err => console.log(err))
  },
  handleDragEnter() {},
  handleDragOver() {},
  handleDragLeave() {}
}
const data = computed(() => albumListStore.data.sort((a, b) => {
  const sequence = userStore.albumSequence
  return sequence!.indexOf(a.id) - sequence!.indexOf(b.id)
}))
function handleMove(event: SortableEvent) {
  const oldIndex = event.oldIndex
  const newIndex = event.newIndex
  const albumId = event.item.id
  if(oldIndex === undefined || newIndex === undefined || albumId === undefined) return
  userStore.updateAlbumSequence(oldIndex, newIndex, albumId)
}
function handleAlbumClick(album: Album) {
  albumStore.fetchAndSet(album.id)
}
</script>
<template>
    <div class="sidebar">
      <n-space class="wrapper" :vertical="true" size="large">
        <n-space class="btn-group" :vertical="true" size="large">
          <router-link class="collapse-item" to="/manage/auth">
            <n-button class="collapse-item-btn" size="large" quaternary block>
                <n-space align="center">
                  <Icon icon="hugeicons:authorized" :height="24" />
                  <span>授权管理</span>
                </n-space>
            </n-button>
          </router-link>
          <!-- 布局管理 -->
          <!-- <n-button class="collapse-item-btn" size="large" quaternary block disabled>
            <n-space align="center">
              <Icon name="mingcute:layout-10-line" />
              <span>布局管理</span>
            </n-space>
          </n-button> -->
          <!-- 稿件管理 -->
          <router-link class="collapse-item" to="/manage/submission">
            <n-button 
              class="collapse-item-btn"
              size="large" 
              quaternary
              :bordered="false"
              block
              @dragenter.prevent="dropMethods.handleDragEnter"
              @dragover.prevent="dropMethods.handleDragOver"
              @dragleave.prevent="dropMethods.handleDragLeave"
              @drop="dropMethods.handleDrop($event, '', false)"
            >
              <n-space align="center">
                <Icon icon="material-symbols-light:folder-data-outline-rounded" :height="24" />
                <span>稿件管理</span>
              </n-space>
            </n-button>
          </router-link>
        </n-space>
        <!-- 折叠面板项 -->
        <n-collapse class="collapse-wrapper" :expanded-names="expandedNames" @update:expanded-names="handleExpandedNamesChange">
          <template #arrow>
            <Icon icon="material-symbols:arrow-right-rounded"  :height="24"/>
          </template>
          <!-- 作品专栏 -->
          <n-collapse-item class="collapse-item" name="1">
            <template #header>
              <n-button class="collapse-item-btn" text size="large">作品专栏</n-button>
            </template>
            <template #header-extra>
              <Icon class="collapse-item-icon" icon="material-symbols:add-rounded"  :height="'24'" @click="albumMethods.handleAddClick" />
            </template>
            <VueDraggable class="draggable" handle=".move" v-model="data" :itemKey="'id'" @end="handleMove($event)">
              <AlbumItem v-for="item in data" :key="item.id" :id="item.id" :item="item" @click="handleAlbumClick(item)" />
            </VueDraggable>
          </n-collapse-item>
          <!-- 轮播管理 -->
          <!-- 首推管理 -->
          <n-collapse-item class="collapse-item" name="2">
            <template #header>
              <n-button class="collapse-item-btn" text size="large">首页推荐</n-button>
            </template>
            <span>首推文件</span>
          </n-collapse-item>
          <!-- 分类管理 -->
          <n-collapse-item class="collapse-item" name="3">
            <template #header>
              <n-button class="collapse-item-btn" text size="large">分类推荐</n-button>
            </template>
            <!-- 首推：增加一个首推标记字段，并限制首推产品的数量，查询时就可以通过字段进行筛选 -->
            <span>首推文件</span>
          </n-collapse-item>
        </n-collapse>
      </n-space>
    </div>
</template>

<style lang="scss" scoped>
:deep(.n-button__content) {
  display: flex;
  flex-direction: row;
  width: 100%;
  font-size: 18px;
}
.sidebar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 10px 6px;
  overflow: hidden;
  box-sizing: border-box;
  border-right: 1px solid v-bind('themeVars.dividerColor');
  background-color: v-bind('themeVars.bodyColor');
  box-sizing: border-box;
}
.main {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 18px 6px 0px 12px;
  box-sizing: border-box;
  .wrapper {
    width: 100%;
    .btn-group {
      margin-bottom: 12px;
    }
  }
}

.collapse-wrapper {
  padding: 6px 3px;
  box-sizing: border-box;
}
.collapse-item {
  user-select: none;
  .collapse-item-btn {
    font-size: 18px;
    border-radius: 0;
  }
  .collapse-item-icon {
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
  }
  &:hover {
    .collapse-item-icon {
      opacity: 1;
    }
  }
}
</style>
