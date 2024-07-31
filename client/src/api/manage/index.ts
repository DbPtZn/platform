import { auth } from './auth'
import { user } from './user'
import { column } from './column'
import { article } from './article'
import { authcode } from './authcode'
import { submission } from './submission'
import axios, { AxiosResponse } from 'axios'

// 为该用户创建请求体实例
export const maxios = axios.create()

maxios.interceptors.request.use(config => {
  if (!config?.headers) {
    throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
  }
  // console.log('manager axios')
  // if (!config.baseURL) {
  //   const hostname = sessionStorage.getItem('hostname') || ''
  //   config.baseURL = hostname
  // }

  if (!config.headers.get('Authorization')) {
    const managerToken = sessionStorage.getItem('managerToken') || ''
    if (managerToken) {
      config.headers.set('Authorization', `Bearer ${managerToken}`)
    }
  }

  return config
})

maxios.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response
  },
  err => {
    if (err.response?.status) {
      switch (err.response?.status) {
        case 401:
          console.log('权限不足')
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
  column,
  article,
  authcode,
  submission
}
