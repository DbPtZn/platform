import { auth } from './auth'
import { user } from './user'
import { album } from './album'
import { article } from './article'
import { authcode } from './authcode'
import { submission } from './submission'
import { upload } from './upload'
import axios, { AxiosError, AxiosResponse } from 'axios'
import router from '@/router'

function getSsoToken() {
  return sessionStorage.getItem(`ssoToken`)
}

function getServerToken() {
  return sessionStorage.getItem(`serverToken`)
}

let promise: Promise<boolean> | null = null
async function refreshToken() {
  // https://www.bilibili.com/video/BV1oK421e7cr 无感刷新详细讲解
  if (promise) return promise
  promise = new Promise(async resolve => {
    // 不能使用 maxios, 否则会覆盖掉 header 
    await axios.get('/auth/identify', {
      headers: {
        Authorization: `Bearer ${getSsoToken()}`,
      },
      __isRefreshToken: true
    } as any).then(resp => {
      console.log('resp:', resp)
      if(resp?.data?.token) {
        // 刷新成功，重新设置 server-token
        // console.log('刷新成功，重新设置 server-token')
        sessionStorage.setItem(`serverToken`, resp.data.token)
      }
      // 约定: 比如刷新成功后返回一个值来判断是否刷新成功
      resolve(resp?.data?.type === 'server')
    }).catch(err => {
      resolve(false)
    })
  })

  promise.finally(() => {
    promise = null
  })

  return promise
}

function isRefreshRequest(config: any) {
  return !!config.__isRefreshToken
}

// 为该用户创建请求体实例
export const maxios = axios.create()
// console.log(import.meta.env.VITE_BASE_URL)
maxios.defaults.baseURL = import.meta.env.VITE_BASE_URL
maxios.interceptors.request.use(config => {
  if (!config?.headers) {
    throw new Error(`ExpCected 'config' and 'config.headers' not to be undefined`)
  }
  // console.log('Config Authorization:', config.headers.get('Authorization'))
  if (!config.headers.get('Authorization')) {
    const serverToken = getServerToken()
    if (serverToken) {
      config.headers.set('Authorization', `Bearer ${serverToken}`)
    }
    if(['/user/pwd'].includes(config.url!)) {
      const ssoToken = getSsoToken()
      if(ssoToken) config.headers.Authorization = `Bearer ${ssoToken}`
    }
  }
  defense = 0
  return config
})
let defense = 0 // 防御措施，防止无限重试
maxios.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response
  },
  async (err: AxiosError) => {
    if (err.response?.status) {
      switch (err.response?.status) {
        case 401:
          /** ------------ ↓ 防御性策略 ↓ ------------ */
          // 短时间达到 10 次 401 错误，则抛出错误不要继续请求
          if(defense > 10) {
            defense = 0
            return Promise.reject(err)
          }
          defense ++
          /** ------------ ↑ 防御性策略 ↑ ------------ */
          const response = err.response
          if(getSsoToken()) {
            if(!isRefreshRequest(response.config)) {
              const isSuccess = await refreshToken()
              if(isSuccess) {
                // 刷新成功，重新发起请求
                response.config.headers.set('Authorization', `Bearer ${getServerToken()}`)
                const resp = await maxios.request(response.config)
                return resp
              } else {
                console.log('刷新失败，无权限，跳转到登录页')
                // 刷新失败，无权限，跳转到登录页
                sessionStorage.removeItem('ssoToken')
                sessionStorage.removeItem('serverToken')
                router.push('/login')
              }
            } else {
              console.log('ssoToken 请求报 401，ssoToken 无效，跳转到登录页')
              // ssoToken 请求报 401，ssoToken 无效，跳转到登录页
              sessionStorage.removeItem('ssoToken')
              sessionStorage.removeItem('serverToken')
              router.push('/login')
            }
          } else {
            console.log('无权限，且没有 ssoToken')
            // 无权限，且没有 ssoToken, 直接跳转到登录页
            sessionStorage.removeItem('serverToken')
            router.push('/login')
          }
          break
        case 403:
          console.log('服务器禁止请求')
          break
      }
    }
    console.log(err)
    return Promise.reject(err)
  }
)

export const manageApi = {
  user,
  auth,
  album,
  article,
  authcode,
  submission,
  upload
}
