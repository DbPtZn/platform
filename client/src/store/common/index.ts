import { useSettingStore } from './setting'
export const useCommonStore = () => ({
  settingStore: useSettingStore()
})