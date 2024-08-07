import { RemovedEnum } from 'src/enum'

export class ArticleFilter {
  albumId?: string
  type?: 'note' | 'course' | 'other'
  isParsed?: boolean
  isPublish?: boolean
  removed?: RemovedEnum
  penname?: string
  email?: string
}
