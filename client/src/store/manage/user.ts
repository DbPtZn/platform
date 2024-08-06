import { defineStore } from 'pinia'
// import type { UpdateColumnSequenceDto } from '@/dto'
import type { UserState } from '@/types'
import { manageApi } from '@/api'

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
        sessionStorage.setItem(`managerToken`, res.data as string)
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
      this.fetch().then(res => {
        const data = res.data
        if (data) {
          console.log(data)
          this.set(data)
        }
      })
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
