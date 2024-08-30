<script lang="ts" setup>
import { RoutePathEnum } from '@/enums'
import useStore from '@/store'
import axios from 'axios'
import { useMessage, useThemeVars, FormRules, FormItemRule } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
interface ModelType {
  account: string
  password: string
  code?: string
}
const router = useRouter()
const message = useMessage()
const themeVars = useThemeVars()
const { userStore } = useStore('manage')
const formRef = ref()
const model = ref<ModelType>({
  account: import.meta.env.VITE_ACCOUNT || '',
  password: import.meta.env.VITE_PASSWORD || '',
  code: ''
})
const rules: FormRules = {
  account: [
    {
      required: true,
      message: '不能包含 & 符号',
      validator(rule: any, value: string) {
        if (value.includes('&')) return false
        return true
      },
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码'
    }
  ]
}
function handleLogin() {
  submit()
}

const submit = () => {
  const isLoginByEmail = loginMode.value === 'loginByEmail'
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      userStore
        .login({
          account: model.value.account,
          password: isLoginByEmail ? 'undefined' : model.value.password,
          code: isLoginByEmail ? model.value.code : ''
        })
        .then(res => {
          message.success('登录成功')
          router.push(RoutePathEnum.MANAGE)
        })
        .catch(err => {
          console.log(err)
          message.error('登录失败！')
        })
    } else {
      message.error('表单校验失败！')
      console.log(errors)
    }
  })
}

function handleToRegister() {
  router.push('./register')
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

const loginMode = ref<'loginByPass' | 'loginByEmail'>('loginByPass')
const hostname = import.meta.env.VITE_BASE_URL

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
  <div class="login">
    <div class="wrapper">
      <div class="tip">欢迎登录</div>
      <n-tabs :value="loginMode" size="large" animated justify-content="space-evenly" @update:value="loginMode = $event">
        <n-tab-pane name="loginByPass" tab="密码登录">
          <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
            <n-form-item path="account" label="账号">
              <n-input class="form-input" v-model:value="model.account" type="text" placeholder="帐号" />
            </n-form-item>
            <n-form-item path="password" label="密码">
              <n-input class="form-input" v-model:value="model.password" type="password" placeholder="密码" />
            </n-form-item>
          </n-form>
          <n-button block class="confirm" @click="handleLogin">登录</n-button>
        </n-tab-pane>
        <n-tab-pane name="loginByEmail" tab="邮箱登录">
          <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
            <n-form-item path="account" label="账号">
              <n-auto-complete v-model:value="model.account" :options="autoCompleteOptions" placeholder="请输入邮箱" />
            </n-form-item>
            <n-form-item path="code" label="验证码">
              <n-input class="form-input" v-model:value="model.code" :type="'text'" placeholder="验证码">
                <template #suffix>
                  <n-button :disabled="!isEnableEmailVerify" :size="'small'" @click="handleSendCode">{{ codeTxt }}</n-button>
                </template>
              </n-input>
            </n-form-item>
          </n-form>
          <n-tooltip :disabled="isEnableEmailVerify"  trigger="hover">
            <template #trigger>
              <n-button block :disabled="!isEnableEmailVerify" class="confirm" @click="handleLogin">登录</n-button>
            </template>
            目标服务器不支持邮箱验证码登录
          </n-tooltip>
        </n-tab-pane>
      </n-tabs>
      
      <div class="footer">
        <span>没有帐号？<a @click="handleToRegister">去注册</a></span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.svg-code {
  display: flex;
  align-items: center;
}
.code {
  height: 100%;
  display: flex;
  align-items: center;
}
.login {
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
    padding: 0 24px;
    margin: 0 auto;
    margin-bottom: 64px;
  }
  .tip {
    width: 100%;
    display: flex;
    align-items: center;
    font-size: 26px;
    margin: 15px auto 20px auto;
  }
  .form-input {
    // width: 280px;
    transition: border-bottom 0.5s;
  }
  .confirm {
    height: 40px;
    border: none;
    color: #ffffff;
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
