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
      columnSequence: [],
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
      // return $fetch<UserState>('/api/user/info').then(data => {
      //   // console.log(data)
      //   this.set(data)
      // })
    },
    set(data: UserState) {
      this.$patch(data)
    },
    updateColumnSequence(oldIndex: number, newIndex: number, columnId: string) {
      // this.columnSequence.splice(oldIndex, 1)
      // this.columnSequence.splice(newIndex, 0, columnId)
      // return $fetch('/api/user/updateColumnSequence', {
      //   method: 'POST',
      //   body: { sequence: this.columnSequence }
      // })
    }
  },
  getters: {}
})
