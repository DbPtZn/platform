import { darkTheme } from 'naive-ui'
import { defineStore } from 'pinia'

export interface State {
  theme: 'dark' | 'light'
}
export const useSettingStore = defineStore('settingStore', {
  state(): State {
    return {
      theme: 'dark',
    }
  },
  actions: {
    useDark() {
      this.theme = 'dark'
    },
    useLight() {
      this.theme = 'light'
    },
    getCurrentTheme() {
      return this.theme ? 'dark': 'light'
    }
  },
  getters: {
    //
  }
})
