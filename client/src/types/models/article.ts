
import type { RemovedEnum } from '@/enums'
import type { ArticleUserInfo, AuthCode, ColumnType } from '.'


export interface Article {
  id: string
  UID: string
  editionId: string
  fromEditionId: string
  userId: string
  authcodeId: string
  columnId: string
  type: 'note' | 'course' | 'other'
  isParsed: boolean
  msg: string
  editorVersion: string
  cover: string
  title: string
  content: string
  abbrev: string
  audio: string
  promoterSequence: string[]
  keyframeSequence: number[]
  subtitleSequence: string[]
  subtitleKeyframeSequence: number[]
  tags: string[]
  isPublish: boolean
  removed: RemovedEnum
  penname: string
  email: string
  author: {
    penname?: string
    avatar?: string
    email?: string
    blog?: string
  }
  detail: {
    wordage?: number
    duration?: number
    fileSize?: number
  }
  meta: {
    views: number
    likes: number
    collections: number
    comments: number
  }
  createAt: string
  updateAt: string
}

export type Submission = Pick<
  Article,
  | 'id'
  | 'UID'
  | 'editionId'
  | 'fromEditionId'
  | 'columnId'
  | 'isParsed'
  | 'isPublish'
  | 'title'
  | 'msg'
  | 'editorVersion'
  | 'type'
  | 'abbrev'
  | 'author'
  | 'detail'
  | 'createAt'
  | 'updateAt'
> & {
  authcode: AuthCode
  column: ColumnType
}

export interface SubmissionState {
  docs: [],
  totalDocs: number,
  limit: number,
  totalPages: number,
  page: number,
  pagingCounter: number,
  hasPrevPage: boolean,
  hasNextPage: boolean,
  prevPage: number | null,
  nextPage: number | null,
  isParsed: 'true' | 'false' | 'all'
}

export type Subfile = Pick<
  Article,
  | 'id'
  | 'UID'
  | 'editionId'
  | 'fromEditionId'
  | 'authcodeId'
  | 'columnId'
  | 'isParsed'
  | 'isPublish'
  | 'title'
  | 'msg'
  | 'editorVersion'
  | 'type'
  | 'abbrev'
  | 'author'
  | 'createAt'
  | 'updateAt'
>

// export type ArticleCard = Omit<
//   ArticleSchema,
//   'content' | 'promoterSequence' | 'keyframeSequence' | 'subtitleSequence' | 'subtitleKeyframeSequence' | 'removed' | 'author' | 'detail' | 'meta'
// >

export type PublicArticleType = Omit<Article, | 'userId' | 'authcodeId' | 'removed' | 'createAt' | 'updateAt'> & {
  user: ArticleUserInfo
  createAt: string
  updateAt: string
}

// export type ArticleFilter = Omit<ArticleSchema, 'id' | 'userId' | 'authcodeId' | 'columnId' | 'createAt' | 'updateAt'> & {
//   id: string
//   userId: string
//   authcodeId: string
//   columnId: string
//   createAt: string
//   updateAt: string
// }



// export type Submission = Pick<
//   ArticleType,
//   | 'id'
//   | 'UID'
//   | 'editionId'
//   | 'fromEditionId'
//   | 'columnId'
//   | 'isParsed'
//   | 'isPublish'
//   | 'title'
//   | 'msg'
//   | 'editorVersion'
//   | 'type'
//   | 'abbrev'
//   | 'author'
//   | 'detail'
//   | 'createAt'
//   | 'updateAt'
// > & {
//   authcode: AuthCodeType
//   column: ColumnType
// }

// // export type ArticlePaginateResult = PaginateResult<Submission>

// // export type SubmissionState = Pick<
// //   ArticlePaginateResult,
// //   | 'docs'
// //   | 'totalDocs'
// //   | 'limit'
// //   | 'hasPrevPage'
// //   | 'hasNextPage'
// //   | 'page'
// //   | 'totalPages'
// //   | 'prevPage'
// //   | 'nextPage'
// //   | 'pagingCounter'
// // >

// export type ArticleListItem = Omit<
//   ArticleType,
//   'editionId' | 'fromEditionId' | 'authcodeId' | 'isParsed' | 'msg' | 'editorVersion' |'content' | 'audio' | 'promoterSequence' | 'keyframeSequence' | 'subtitleSequence' | 'subtitleKeyframeSequence' | 'removed'
// >



// id: '',
// UID: '',
// editionId: '',
// fromEditionId: '',
// authcodeId: '',
// isParsed: boolean,
// isPublish: boolean,
// title: '',
// msg: '',
// editorVersion: '',
// type: 'other',
// abbrev: '',
// author: {
//   penname: '',
//   avatar: '',
//   email: '',
//   blog: ''
// },
// detail: {
//   wordage: 0,
//   duration: 0,
//   fileSize: 0,
// },
// createAt: '',
// updateAt: ''
