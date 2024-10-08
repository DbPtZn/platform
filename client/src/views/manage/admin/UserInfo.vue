<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { NButton, NSpace, useMessage } from 'naive-ui'
import type { DataTableColumns, FormInst, FormItemRule, FormRules, UploadFileInfo } from 'naive-ui'
import useStore from '@/store'
import { onMounted } from 'vue'
interface ModelType {
  avatar: string
  nickname: string
  desc: string
}

const { userStore } = useStore('manage')
const message = useMessage()
const baseurl = import.meta.env.VITE_BASE_URL
/** 表单数据 */
const model = ref<ModelType>({
  avatar: userStore.avatar,
  nickname: userStore.nickname,
  desc: userStore.desc
})
/** 表单规则 */
const rules: FormRules = {
  nickname: [
    {
      required: true,
      message: '名称不能为空',
      trigger: 'blur'
    },
    {
      message: '名称长度不能超过18个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 18
      }
    }
  ],
  // email: [],
  // phone: [],
  desc: [
    {
      required: false,
      message: '请输入描述',
      trigger: 'blur'
    },
    {
      message: '描述长度不能超过60个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 60
      }
    }
  ]
}
const formRef = ref<FormInst | null>(null)

function handleFinish(args: { file: UploadFileInfo; event?: ProgressEvent }) {
  if (args.event) {
    console.log(args.event.currentTarget)
    const path = (args.event.currentTarget as XMLHttpRequest).response
    console.log(path)
    model.value.avatar = path
  }
}
const accessToken = sessionStorage.getItem('serverToken')
/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      // console.log(model.value)
      userStore.update(model.value).then(() => {
        message.success('修改成功')
      })
    } else {
      console.log(errors)
    }
  })
}
function handleError(ev: Event) {
  const target = ev.target as HTMLImageElement
  target.src = './empty.png'
}
</script>

<template>
  <div class="user-info">
    <n-card title="个人信息管理" style="margin-bottom: 16px; border-radius: 0">
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <!-- 用户头像 -->
        <n-form-item path="avatar" label="头像">
          <n-upload
            :action="`${baseurl}/upload/img`"
            :show-file-list="false"
            :headers="{
              Authorization: `Bearer ${accessToken}`
            }"
            @finish="handleFinish"
          >
            <img class="avatar" :src="model.avatar" style="width: 100%" @error="handleError" />
          </n-upload>
        </n-form-item>
        <!-- 用户账号（不可更改） -->
        <n-form-item path="account" label="账号">
          <n-input v-model:value="userStore.account" type="text" placeholder="账号" disabled />
        </n-form-item>
        <!-- 用户昵称 -->
        <n-form-item path="nickname" label="昵称">
          <n-input v-model:value="model.nickname" type="text" placeholder="昵称" />
        </n-form-item>
        <!-- 用户邮箱 -->
        <!-- <n-form-item path="email" label="邮箱">
            <n-input v-model:value="model.email" type="text" placeholder="邮箱" />
          </n-form-item> -->
        <!-- 用户手机 -->
        <!-- <n-form-item path="phone" label="手机号">
            <n-input v-model:value="model.phone" type="text" placeholder="手机号" />
          </n-form-item> -->
        <!-- 个人主页 -->
        <!-- <n-form-item path="homepage" label="个人主页">
            <n-input v-model:value="model.homepage" type="text" placeholder="https://" />
          </n-form-item> -->
        <!-- 用户简介 -->
        <n-form-item path="desc" label="简介">
          <n-input v-model:value="model.desc" type="text" placeholder="简介" />
        </n-form-item>
      </n-form>
      <n-space :justify="'end'">
        <n-button type="primary" @click="handleSubmit">保存</n-button>
      </n-space>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  height: 80px;
  width: 80px;
}
.user-info {
  z-index: 0;
  display: flex;
  flex-direction: column;
  // width: 50%;
  // height: 100%;
}
</style>
