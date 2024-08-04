import { maxios as axios } from './index'
export interface CreateAlbumDto {
  name: string
  cover: string
  desc: string
}

export const album = {
  create<T>(dto: CreateAlbumDto) {
    return axios.post<T>('/album', dto)
  },
  getList<T>() {
    return axios.get<T>('/album/list')
  },
  get<T>(id: string) {
    return axios.get<T>(`/album/${id}`)
  },
}