import { maxios as axios } from './index'

export const upload = {
  uploadImg(formdata: FormData) {
    return axios.post('/upload/img', formdata)
  }
}