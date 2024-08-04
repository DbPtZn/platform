//axios二次封装
import axios, { AxiosResponse } from 'axios'
import { RoutePathEnum } from '@/enums'
import router from '@/router'

// 使用 mock 的时候不能设置默认
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
// 添加请求拦截器
// 在发送请求之前做些什么
axios.interceptors.request.use(config => {
  if (!config?.headers) {
    throw new Error(`Expected 'config' and 'config.headers' not to be undefined`)
  }
  // 每次请求都附带 token
  // const managerToken = sessionStorage.getItem('managerToken') || ''
  // if (managerToken) {
  //   config.headers.set('Authorization', `Bearer ${managerToken}`)
  // }
  return config
})
// 添加响应拦截器
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response
  },
  err => {
    // 对响应错误做点什么
    if (err.response?.status) {
      switch (err.response?.status) {
        case 401:
          // sessionStorage.removeItem('managerToken')
          // router.push({ path: RoutePathEnum.LOGIN })
          console.log('权限不足')
          break
        case 403:
          console.log('服务器禁止请求')
      }
    }
    return Promise.reject(err)
  }
)

export default axios
export * from './manage'
export * from './blog'
export * from './platform'
