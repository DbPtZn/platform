import { defineStore } from 'pinia'
// import type { GetArticleDto } from '@/dto'
import type {  Submission, SubmissionState } from '@/types'
import { RemovedEnum } from '@/enums'
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
    fetch(dto: Parameters<typeof manageApi.article.getList>[0]) {
      return manageApi.article.getList<SubmissionState>(dto)
    },
    fetchAndSet(dto: Parameters<typeof manageApi.article.getList>[0]) {
      return this.fetch(dto).then(res => {
        console.log(res.data.items[0])
        // this.$patch(res.data)
        this.items = res.data.items
        this.meta = res.data.meta
        this.links = res.data.links
      })
    },
    getUnparsedFile<T>(id: string) {
      return manageApi.article.getUnparsedFile<T>(id)
    },
    parse<T>(dto: Parameters<typeof manageApi.article.parse>[0]) {
      return manageApi.article.parse<T>(dto)
    },
    delete(id: string) {
      return manageApi.article.delete(id)
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
