import { useSubmissionStore } from './submission'
import { useAlbumListStore } from './album-list'
import { useAlbumStore } from './album'
import { useUserStore } from './user'

export const useManageStore = () => ({
  submissionStore: useSubmissionStore(),
  albumListStore: useAlbumListStore(),
  albumStore: useAlbumStore(),
  userStore: useUserStore()
})