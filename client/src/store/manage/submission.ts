import { defineStore } from 'pinia'
import type { Album, ParsedArticleFile, Submission, SubmissionChild, SubmissionState } from '@/types'
import { manageApi } from '@/api'

export const useSubmissionStore = defineStore('submissionStore', {
  state(): SubmissionState {
    return {
      items: [],
      meta: {
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: 10,
        totalPages: 0,
        currentPage: 1
      },
      links: undefined,
      isParsed: 'all'
    }
  },
  actions: {
    fetch(dto: Parameters<typeof manageApi.submission.getList>[0]) {
      return manageApi.submission.getList<SubmissionState>(dto)
    },
    fetchAndSet(dto: Parameters<typeof manageApi.submission.getList>[0]) {
      return this.fetch(dto).then(res => {
        // console.log(res.data.items[0])
        // this.$patch(res.data)
        this.items = res.data.items.map(item => {
          return {
            ...item,
            key: item.id,
            isLeaf: item.isMultiEdition ? false : true
          }
        })
        this.meta = res.data.meta
        this.links = res.data.links
      })
    },
    fetchEditions(editionId: string) {
      return manageApi.submission.getEditions<SubmissionChild[]>(editionId)
    },
    updateCurrentEdition(id: string) {
      return manageApi.submission.updateCurrentEdition<SubmissionChild>(id).then(res => {
        const index = this.items.findIndex(item => item.id === id)
        if(index !== -1) {
          this.items[index].isCurrent = true
          this.items[index].album = res.data.album
          this.items[index].albumId = res.data.albumId
          this.items[index].isDisplayed = res.data.isDisplayed
          this.items[index].isPublished = res.data.isPublished
        }
        return res.data
      })
    },
    getUnparsedFile(id: string) {
      return manageApi.submission.getUnparsedFile<ParsedArticleFile>(id)
    },
    parse(dto: Parameters<typeof manageApi.submission.parse>[0]) {
      return manageApi.submission.parse(dto)
    },
    allot(dto: Parameters<typeof manageApi.submission.allot>[0]) {
      return manageApi.submission.allot<Album>(dto).then(res => {
        this.items.some(item => {
          if (item.id === dto.articleId) {
            item.album = res.data
            return true
          }
          // if (item.isLeaf !== undefined || item.children) {
          //   item.children = []
          //   item.isLeaf = false
          // }
        })
      })
    },
    updatePublishStatus(id: string, status: boolean) {
      return manageApi.submission.updatePublishStatus(id, status).then(() => {
        const index = this.items.findIndex(item => item.id === id)
        if(index !== -1) this.items[index].isPublished = status
      })
    },
    updateDisplayStatus(id: string, status: boolean) {
      return manageApi.submission.updateDisplayStatus(id, status).then(() => {
        const index = this.items.findIndex(item => item.id === id)
        if(index !== -1) this.items[index].isDisplayed = status
      })
    },
    refuse(dto: Parameters<typeof manageApi.submission.refuse>[0]) {
      return manageApi.submission.refuse(dto).then(() => {
        const index = this.items.findIndex(item => item.id === dto.id)
        if(index !== -1) this.items.splice(index, 1)
      })
    },
    delete(id: string) {
      return manageApi.submission.delete(id).then(() => {
        const index = this.items.findIndex(item => item.id === id)
        if(index !== -1) this.items.splice(index, 1)
      })
    }
  },
  getters: {
    getDocs(): Submission[] {
      return this.items
    },
    getPage(): number {
      return this.meta.currentPage || 1
    },
    getTotalPages(): number {
      return this.meta.totalPages
    },
    getTotalDocs(): number {
      return this.meta.totalItems
    },
  }
})
