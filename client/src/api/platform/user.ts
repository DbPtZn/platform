import axios from "axios"


export const user = {
  getList<T>() {
    return axios.get<T>('/user/list')
  }
}