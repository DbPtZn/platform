import axios from "axios"
export interface LoginDto {
  account: string
  password: string
  code?: string
}

export interface CreateUserDto {
  nickname?: string
  account: string
  password: string
  code: string
}

export const auth = {
  
  register<T>(data: CreateUserDto) {
    return axios({
      method: 'post',
      // baseURL: hostname,
      url: '/auth/register',
      data: data
    })
  },
  login<T>(data: LoginDto) {
    return axios({
      method: 'post',
      // baseURL: hostname,
      url: '/auth/login',
      data: data
    })
  }
}