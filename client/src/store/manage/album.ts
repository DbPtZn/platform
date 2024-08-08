import { defineStore } from 'pinia'
import type { Subfile, AlbumState } from '@/types'
import _ from 'lodash'
import { SortType } from '@/enums'
import { manageApi } from '@/api'

export const useAlbumStore = defineStore('albumStore',{
    state(): AlbumState {
      return {
        id: '',
        name: '',
        isDisplayed: false,
        subfiles: []
      }
    },
    actions: {
      fetchAndSet(id: string) {
        return manageApi.album.get<AlbumState>(id).then(res => {
          this.id = res.data.id
          this.name = res.data.name
          this.isDisplayed = res.data.isDisplayed
          this.subfiles = res.data.subfiles
        })
      },
      getSubfiles(sortType?: SortType) {
        switch (sortType) {
          case SortType.UPDATE:
            return this.getSubfilesSortUpdateAt
          case SortType.NAME:
            return this.getSubfilesSortByName
          case SortType.CREATE:
            return this.getSubfilesSortByCreateAt
          case SortType.UPDATE_REVERSE:
            return this.getSubfilesSortUpdateAtReverse
          case SortType.NAME_REVERSE:
            return this.getSubfilesSortByNameReverse
          case SortType.CREATE_REVERSE:
            return this.getSubfilesSortByCreateAtReverse
          default:
            return this.getSubfilesSortUpdateAt
        }
      },
    },
    getters: {
      getSubfilesSortByName(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => item.title) : []
      },
      getSubfilesSortUpdateAt(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.updateAt)) : []
      },
      getSubfilesSortByCreateAt(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.createAt)) : []
      },
      // reverse
      getSubfilesSortByNameReverse(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => item.title).reverse() : []
      },
      getSubfilesSortUpdateAtReverse(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.updateAt)).reverse() : []
      },
      getSubfilesSortByCreateAtReverse(): Subfile[] {
        return this.subfiles ? _.sortBy(this.subfiles, item => new Date(item.createAt)).reverse() : []
      }
    },
})