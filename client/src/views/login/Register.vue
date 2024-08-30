<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'
import { RoutePathEnum } from '@/enums'
import { FormInst, FormItemRule, FormRules, useMessage, useThemeVars } from 'naive-ui'
import axios from 'axios'
interface ModelType {
  account: string
  password: string
  code: string
}

// electron 环境下向主进程询问本地服务的端口号


const router = useRouter()
const { userStore } = useStore('manage')
const formRef = ref<FormInst | null>(null)
const allowRegister = import.meta.env.VITE_VIEW_REGISTER === 'true'
const hostname = import.meta.env.VITE_BASE_URL
const message = useMessage()
const themeVars = useThemeVars()
/** 表单数据 */
const model = ref<ModelType>({
  account: import.meta.env.VITE_ACCOUNT || '',
  password: import.meta.env.VITE_PASSWORD || '',
  code: ''
})
console.log(model.value)
/** 表单规则 */
const rules: FormRules = {
  nickname: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'blur'
    },
    {
      message: '姓名长度不能超过18个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 18
      }
    }
  ],
  account: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      message: '密码长度应该在8~24个字符之间',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length >= 8 && value.length <= 24 
      }
    }
  ]
}
/** 自动补全邮箱地址 */
const autoCompleteOptions = computed(() => {
  // 可能还需要清理空格（空字符），防止用户输入的时候多了空字符
  return ['@qq.com', '@gmail.com', '@163.com', '@139.com'].map(suffix => {
    const prefix = model.value.account!.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
})
/** 提交注册 */
function handleRegister(e: MouseEvent) {
  e.preventDefault()
  if(isQuerying.value) return message.loading('正在连接服务器...')
  if(!isHostValid.value) return message.error('无法连接服务器！')
  formRef.value?.validate(errors => {
    if (!errors) {
      userStore
        .register(
          {
            account: model.value.account,
            password: model.value.password,
            code: model.value.code,
          }
        )
        .then(res => {
          console.log(res)
          router.push(RoutePathEnum.LOGIN)
        })
        .catch(err => {
          const data = err?.response?.data || '注册失败！'
          console.log(data.message)
          if(data) {
            if(typeof data === 'string') return message.error(data)
            if(Array.isArray(data.message)) return data.message.forEach(msg => message.error(msg))
            message.error('注册失败！')
          }
         
          // console.log(err)
        })
    } else {
      message.error('表单校验失败！')
      console.log(errors)
    }
  })
}

function handleToLogin() {
  router.push(RoutePathEnum.LOGIN)
}

/** ------------------------------- 邮箱 验证 --------------------------- */

const codeTxt = ref('获取验证码')
function handleSendCode() {
  if(isQuerying.value) return message.loading('正在连接服务器...')
  if(!isHostValid.value) return message.error('无法连接服务器！')
  // TODO: 发送验证码
  console.log(`${hostname}/auth/sendCode/${model.value.account}`)
  axios.get(`${hostname}/auth/sendCode/${model.value.account}`).then(res => {
    // message.success('验证码已发送！')
    let count = 60
    const timer = setInterval(() => {
      codeTxt.value = `${--count}秒后重发`
      if(count <= 0) {
        clearInterval(timer)
        codeTxt.value = '获取验证码'
      }
    }, 1000)
  }).catch(err => {
    message.error('验证码发送失败！')
  })
}

/** ------------------------------- 服务器 验证 --------------------------- */
const isQuerying = ref(false)
const isHostValid = ref(false) // 服务器是否有效
const isEnableEmailVerify = ref(false)  // 是否开启邮箱验证
onMounted(() => {
  // 默认自动获取焦点
  isQuerying.value = true
  axios.get<boolean>(`${hostname}/hello`)
    .then(res => {
      isEnableEmailVerify.value = res.data
      console.log(isEnableEmailVerify.value)
      isHostValid.value = true
    }).catch(err => {
      isHostValid.value = false
    }).finally(() => {
      isQuerying.value = false
    })
})
</script>

<template>
  <div class="register">
    <div class="wrapper">
      <div class="tip">欢迎注册</div>
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item path="account" label="账号 ( 仅支持邮箱注册 )">
          <n-auto-complete v-model:value="model.account" :options="autoCompleteOptions" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input class="form-input" v-model:value="model.password" type="password" placeholder="密码" :show-password-on="'click'" />
        </n-form-item>
        <n-form-item v-if="isEnableEmailVerify" path="code" label="验证码">
          <n-input class="form-input" v-model:value="model.code" :type="'text'" placeholder="验证码">
            <template #suffix>
              <n-button :size="'small'" @click="handleSendCode">{{ codeTxt }}</n-button>
            </template>
          </n-input>
        </n-form-item>
      </n-form>

      <n-button block class="confirm" @click="handleRegister">注册</n-button>
      <div class="footer">
        <span>已有帐号？<a @click="handleToLogin">去登录</a></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.register {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  color: v-bind('themeVars.textColor1');
  background-color: v-bind('themeVars.cardColor');
  .wrapper {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    margin-bottom: 64px;
  }
  .tip {
    width: 100%;
    display: flex;
    align-items: center;
    // justify-content: center;
    font-size: 26px;
    margin: 25px auto 30px auto;
  }
  .confirm {
    // width: 280px;
    height: 40px;
    border: none;
    font-weight: bold;
    letter-spacing: 8px;
    border-radius: 10px;
    cursor: pointer;
  }
}
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 24px;
  a {
    cursor: pointer;
    color: plum;
  }
}
</style>
