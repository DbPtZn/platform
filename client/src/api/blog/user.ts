import axios from "axios"

export const user = {
  get<T>(uid: string) {
    return axios.get<T>(`/user/blog/${uid}`)
  }
}