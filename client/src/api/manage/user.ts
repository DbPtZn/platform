import { maxios as axios } from './index'

export const user = {
  get<T>() {
    return axios.get<T>('/user/info')
  },
  updateReceiverStatus<T>(status: number) {
    return axios.patch<T>('/user/receiver/' + status)
  }
}