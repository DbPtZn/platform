import axios from 'axios'

export const album = {
  getList<T>(uid: string) {
    return axios.get<T>(`/album/blog/list/${uid}`)
  },
  get<T>(id: string) {
    // console.log('getById', id)
    return axios.get<T>(`/album/blog/${id}`)
  }
}