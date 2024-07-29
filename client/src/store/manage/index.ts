import { useSubmissionStore } from './submission'
import { useColumnListStore } from './column-list'
import { useColumnStore } from './column'
import { useUserStore } from './user'

export const useManageStore = () => ({
  submissionStore: useSubmissionStore(),
  columnListStore: useColumnListStore(),
  columnStore: useColumnStore(),
  userStore: useUserStore()
})