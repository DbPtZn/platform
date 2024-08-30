import { defineStore } from 'pinia'
// import type { UpdateColumnSequenceDto } from '@/dto'
import type { UserState } from '@/types'
import axios, { manageApi } from '@/api'
import jsrsasign from 'jsrsasign'
import router from '@/router'
import { RoutePathEnum } from '@/enums'
export const useUserStore = defineStore('userStore', {
  state(): UserState {
    return {
      id: '',
      UID: '',
      account: '',
      nickname: '',
      avatar: '',
      desc: '',
      info: {
        email: '',
        phone: ''
      },
      receiverConfig: {
        status: 0,
        autoParse: false,
        sizeLimit: 0
      },
      config: {
        autoDisplay: false
      },
      albumSequence: [],
      createAt: '',
      updateAt: ''
    }
  },
  actions: {
    /** 注册 */
    register(params: Parameters<typeof manageApi.auth.register>[0]) {
      return manageApi.auth.register(params)
    },
    /** 登录 */
    login(params: Parameters<typeof manageApi.auth.login>[0]) {
      return manageApi.auth.login(params).then(res => {
        console.log(res)
        if (!res.data) throw '登录失败'
        // 存储 token
        // 存储 sso-token 或 server-token （ 若存储了 sso-token, 则会在下一次请求 server 时触发 refreshToken，自动获取 server-token ）
        sessionStorage.setItem(res.data.type === 'sso' ? `ssoToken` : 'serverToken', res.data.token as string)

        // 请求用户信息
        this.fetch().then(res => {
          const data = res.data
          if (data) {
            this.set(data)
          }
        })
        return '登录成功'
      })
    },
    fetch() {
      return manageApi.user.get<UserState>()
    },
    set(data: UserState) {
      this.$patch(data)
    },
    fetchAndSet() {
      this.checkToken()
      this.fetch().then(res => {
        const data = res.data
        if (data) {
          console.log(data)
          this.set(data)
        }
      })
    },
    logout() {
      // 清除 token
      sessionStorage.removeItem('ssoToken')
      sessionStorage.removeItem('serverToken')
      // 跳转至登录页
      router.push(RoutePathEnum.LOGIN)
    },
    /** 检查 token 是否即将过期，及时刷新更新 token */
    async checkToken() {
      console.log('正在检查令牌...')
      const ssoToken = sessionStorage.getItem('ssoToken')
      if(ssoToken) {
        const payload = JSON.parse(jsrsasign.b64toutf8(ssoToken.split('.')[1]))
        const { exp, rfh } = payload // exp 是以秒为单位的时间戳
        const nowTimestamp = await axios.get(`/date`).then(res => Number(res.data)/1000)
        if(nowTimestamp > exp) return this.logout()
        if(nowTimestamp > rfh) {
          // 更新 token
          await axios.get('/auth/refresh', {
            headers: {
              Authorization: `Bearer ${ssoToken}`
            }
          }).then(resp => {
            if(resp?.data?.type === 'sso') {
              sessionStorage.setItem('ssoToken', resp?.data?.token as string)
              console.log('更新 sso-token 成功')
            }
          }).catch(err => {
            console.error('更新 sso-token 失败:')
            console.log(err)
          })
        }
        return
      }
      const serverToken = sessionStorage.getItem('serverToken')
      if(serverToken) {
        const payload = JSON.parse(jsrsasign.b64toutf8(serverToken.split('.')[1]))
        const { exp, rfh } = payload // exp 是以秒为单位的时间戳
        const nowTimestamp = await axios.get(`/date`).then(res => Number(res.data)/1000)
        if(nowTimestamp > exp) return this.logout()  // 已经到期，退出登录
        if(nowTimestamp >= rfh) {
          // server-token 即将过期，申请更新 server-token
          await axios.get('/auth/refresh', {
            headers: {
              Authorization: `Bearer ${serverToken}`
            }
          }).then(resp => {
            if(resp?.data?.type === 'server') {
              sessionStorage.setItem('serverToken', resp?.data?.token as string)
              console.log('更新 server-token 成功')
            }
          }).catch(err => {
            console.error('更新 server-token 失败！')
          })
        }
      }
    },
    updateAlbumSequence(oldIndex: number, newIndex: number, columnId: string) {
      this.albumSequence.splice(oldIndex, 1)
      this.albumSequence.splice(newIndex, 0, columnId)
      return manageApi.user.updateAlbumSequence({
        sequence: this.albumSequence
      })
    },
    updateReceiverStatus(status: 0 | 1 | 2) {
      return manageApi.user.updateReceiverStatus(status).then(res => {
        if (res.data) {
          this.receiverConfig.status = status
        }
      })
    },
    updatePassword(params: Parameters<typeof manageApi.user.updatePassword>[0]) {
      return manageApi.user.updatePassword(params)
    },
    update(params: Parameters<typeof manageApi.user.update>[0]) {
      return manageApi.user.update(params).then(res => {
        this.avatar = params.avatar
        this.nickname = params.nickname
        this.desc = params.desc
      })
    },
    updateConfig(params: Parameters<typeof manageApi.user.updateConfig>[0]) {
      return manageApi.user.updateConfig(params).then(res => {
        this.config.autoDisplay = params.autoDisplay
      })
    },
  },
  getters: {}
})
