export * from './manage'
export * from './blog'
export * from './common'
import { useManageStore } from './manage'
import { useBlogStore } from './blog'
import { useCommonStore } from './common'

function useStore(): ReturnType<typeof useCommonStore>
function useStore(key: 'common'): ReturnType<typeof useCommonStore>
function useStore(key: 'manage'): ReturnType<typeof useManageStore>
function useStore(key: 'blog'):  ReturnType<typeof useBlogStore>
function useStore(key?: 'manage' | 'blog' | 'common') {
  // if(!key) return useDefaultStore()
  switch (key) {
    case 'manage':
      return useManageStore()
    case 'blog':
      return useBlogStore()
    case 'common':
      return useCommonStore()
    default:
      return useCommonStore()
  }
}

export default useStore