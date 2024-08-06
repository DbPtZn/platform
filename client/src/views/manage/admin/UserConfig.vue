<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import { NButton, NSpace, useMessage } from 'naive-ui'
import type { DataTableColumns, FormInst, FormItemRule, FormRules, UploadFileInfo } from 'naive-ui'
import useStore from '@/store'
import { onMounted } from 'vue'
interface ModelType {
  autoDisplay: boolean 
}
const message = useMessage()
const { userStore } = useStore('manage')
/** 表单数据 */
const model = ref<ModelType>({
  autoDisplay: userStore.config?.autoDisplay || false, 
})
/** 表单规则 */
const rules: FormRules = {
  // autoDisplay: [
  // ],
}

const formRef = ref<FormInst | null>(null)
/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      console.log('submit!', model.value)
      userStore.updateConfig(model.value).then(() => {
        message.success('修改成功')
      })
    } else {
      console.log(errors)
    }
  })
}
</script>

<template>
  <div class="config">
    <n-card title="用户习惯" style="height: 100%; margin-bottom: 16px; border-radius: 0">
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item path="autosave" label="自动展示">
          <n-switch v-model:value="model.autoDisplay" />
        </n-form-item>
      </n-form>
      <n-space :justify="'end'">
        <n-button type="primary" @click="handleSubmit">保存</n-button>
      </n-space>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.config {
  z-index: 0;
  display: flex;
  flex-direction: column;
  // height: 100%;
}
</style>
