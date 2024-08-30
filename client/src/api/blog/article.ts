import { RemovedEnum } from '@/enums'
import axios from 'axios'

export interface ArticleFilter {
  authcodeId: string
  columnId: string
  type: string
  isParsed: string
  isPublish: string
  removed: RemovedEnum
  penname: string
  email: string
}

export interface GetArticleListDto {
  page: number,
  limit: number
  UID: string
  filter?: Partial<ArticleFilter>
}

export const article = {
  getList<T>(dto: GetArticleListDto) {
    return axios.post<T>(`/article/list?page=${dto.page}&limit=${dto.limit}&UID=${dto.UID}`, dto.filter)
  },
  getByAgentId<T>(id: string) {
    // console.log('getByAgentId', id)
    return axios.get<T>(`/article/${id}`)
  },
  getById<T>(id: string) {
    console.log('getById', id)
    return axios.get<T>(`/article?id=${id}`)
  }
}