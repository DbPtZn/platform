import { maxios as axios } from './index'

export interface UpdateUserInfoDto {
  nickname: string
  avatar: string
  desc: string
}

export interface UpdateUserPwdDto {
  oldPwd: string
  newPwd: string
}

export interface UpdateUserConfigDto {
  autoDisplay: boolean
}

export interface UpdateAlbumSequenceDto {
  sequence: string[]
}

export const user = {
  get<T>() {
    return axios.get<T>('/user/info')
  },
  update<T>(dto: UpdateUserInfoDto) {
    return axios.patch<T>('/user/info', dto)
  },
  updatePassword<T>(dto: UpdateUserPwdDto) {
    return axios.patch<T>('/user/pwd', dto)
  },
  updateConfig<T>(dto: UpdateUserConfigDto) {
    return axios.patch<T>('/user/config', dto)
  },
  updateReceiverStatus<T>(status: number) {
    return axios.patch<T>('/user/receiver/' + status)
  },
  updateAlbumSequence<T>(dto: UpdateAlbumSequenceDto) {
    return axios.patch<T>('/user/albumSequence', dto)
  }
}