import { maxios as axios } from './index'
export interface UpdateAuthcodeDto {
  id: string
  name: string
  code: string
  desc: string
  disabled: boolean
}

export const authcode = {
  getAll<T>() {
    return axios.get<T>('/authcode')
  },
  get<T>(id: string) {
    return axios.get<T>(`/authcode/${id}`)
  },
  add<T>() {
    return axios.post<T>('/authcode')
  },
  update<T>(dto: UpdateAuthcodeDto) {
    return axios.patch<T>(`/authcode`, dto)
  },
  delete<T>(id: string) {
    return axios.delete<T>(`/authcode/${id}`)
  },
}