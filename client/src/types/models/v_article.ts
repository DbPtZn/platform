import type { RemovedEnum } from '@/enums'

export interface VArticleSchema {
  id: string
  primaryId: string
  UID: string
  userId: string
  authorizeId: string
  columnId: string
  type: 'note' | 'course' | unknown
  isParsed: boolean
  editorVersion: string
  cover: string
  title: string
  content: string
  abbrev: string
  audio: string
  promoterSequence: string[]
  keyframeSequence: string[]
  subtitleSequence: string[]
  subtitleKeyframeSequence: string[]
  tags: string[]
  isPublish: boolean
  removed: RemovedEnum
  author: {
    penname: string
    avatar: string
    email: string
    website: string
  }
  detail: {
    wordage: number
    duration: number
    fileSize: number
  }
  meta: {
    views: number
    likes: number
    collections: number
    comments: number
  }
  createAt: Date
  updateAt: Date
}

export type VArticleCard = Omit<
  VArticleSchema,
  'content' | 'promoterSequence' | 'keyframeSequence' | 'subtitleSequence' | 'subtitleKeyframeSequence' | 'removed' | 'author' | 'detail' | 'meta'
>

export type VArticleType = Omit<
  VArticleSchema,
 'id'| 'userId' |'authorizeId' | 'columnId' | 'removed' | 'createAt' | 'updateAt'
> & { 
  id: string
  userId: string
  authorizeId: string
  columnId: string,
  createAt: string
  updateAt: string
}
