import { RemovedEnum } from '@/enums'
import { maxios as axios } from './index'

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
  filter?: Partial<ArticleFilter>
}

export interface ParseArticleDto {
  id: string

  // title: string // 标题
  
  cover: string // 封面

  content: string // 内容

  // duration: number // 音频时长

  promoterSequence: Array<string> // 启动子序列

  keyframeSequence: Array<number> // 关键帧序列

  subtitleSequence: Array<string> // 字幕序列

  subtitleKeyframeSequence: Array<number> // 字幕关键帧序列
}

export interface RefuseDto {
  id: string
  msg: string
}

export interface AllotArticleDto {
  articleId: string
  albumId: string
}

export const submission = {
  getList<T>(dto: GetArticleListDto) {
    return axios.post<T>(`/submission/list?page=${dto.page}&limit=${dto.limit}`, dto.filter)
  },
  get<T>(id: string) {
    return axios.get<T>(`/submission/${id}`)
  },
  getEditions<T>(editionId: string) {
    return axios.get<T>(`/submission/editions/${editionId}`)
  },
  updateCurrentEdition<T>(id: string) {
    return axios.patch<T>(`/submission/current/${id}`)
  },
  getUnparsedFile<T>(id: string) {
    return axios.get<T>(`/submission/unparsedfile/${id}`)
  },
  parse<T>(dto: ParseArticleDto) {
    return axios.patch<T>(`/submission/parse`, dto)
  },
  allot<T>(dto: AllotArticleDto) {
    return axios.patch<T>(`/submission/allot`, dto)
  },
  updatePublishStatus<T>(id: string, status: boolean) {
    return axios.patch<T>(`/submission/publish/${id}?status=${status}`)
  },
  updateDisplayStatus<T>(id: string, status: boolean) {
    return axios.patch<T>(`/submission/display/${id}?status=${status}`)
  },
  refuse<T>(dto: RefuseDto) {
    return axios.patch<T>(`/submission/refuse`, dto)
  },
  delete<T>(id: string) {
    return axios.delete<T>(`/submission/${id}`)
  },
}