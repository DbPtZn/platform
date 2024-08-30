import { defineStore } from 'pinia'
import type { Article, Album, AlbumState, Subfile } from '@/types'
import { manageApi } from '@/api'

type State = {
  data: Album[]
}

export const useAlbumListStore = defineStore('albumListStore',{
    state(): State {
      return {
        data: []
      }
    },
    actions: {
      create(dto: Parameters<typeof manageApi.album.create>[0]) {
        return manageApi.album.create<Album>(dto).then(res => {
          this.data.unshift(res.data)
        })
      },
      get() {
        return manageApi.album.getList<Album[]>().then(res => {
          // console.log(res.data)
          this.data = res.data
        })
      }
    },
    getters: {},
})