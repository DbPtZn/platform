import { defineStore } from 'pinia'
// import type { GetArticleDto } from '@/dto'
import type {  Submission, SubmissionState } from '@/types'
import { RemovedEnum } from '@/enums'

export const useSubmissionStore = defineStore('submissionStore', {
  state(): SubmissionState {
    return {
      docs: [],
      totalDocs: 2,
      limit: 2,
      totalPages: 2,
      page: 1,
      pagingCounter: 2,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: 2,

      isParsed: 'all'
    }
  },
  actions: {
    // fetch(dto: GetArticleDto) {
    //   this.isParsed !== 'all' && (
    //     dto.filter = {
    //       ...dto.filter,
    //       isParsed: this.isParsed === 'true'
    //     }
    //   )
    // }
  },
  getters: {
    getDocs(): Submission[] {
      return this.docs
    },
    getPage(): number {
      return this.page || 1
    },
    getTotalPages(): number {
      return this.totalPages
    },
    getTotalDocs(): number {
      return this.totalDocs
    },
  }
})
