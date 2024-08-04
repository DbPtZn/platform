
import type { RemovedEnum } from '@/enums'
import type { ArticleUserInfo, AuthCode, Album } from '.'


export interface Article {
  id: string
  UID: string
  editionId: string
  fromEditionId: string
  userId: string
  authcodeId: string
  albumId: string
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
  avatar: string
  author: {
    blog?: string
  }
  wordage: number
  duration: number
  detail: {
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
  | 'albumId'
  | 'isParsed'
  | 'isPublish'
  | 'title'
  | 'msg'
  | 'editorVersion'
  | 'type'
  | 'abbrev'
  | 'penname'
  | 'email'
  | 'avatar'
  | 'author'
  | 'duration'
  | 'wordage'
  | 'detail'
  | 'createAt'
  | 'updateAt'
> & {
  authcode?: AuthCode
  album?: Album
}

export interface SubmissionState {
  items: Submission[],
  meta: {
    totalItems: number,
    itemCount: number,
    itemsPerPage: number,
    totalPages: number,
    currentPage: number
  },
  links: undefined
  isParsed: 'true' | 'false' | 'all'
}

export type ParsedArticleFile = Pick<
  Article,
  | 'title'
  | 'content'
  | 'promoterSequence'
  | 'keyframeSequence'
  | 'subtitleSequence'
  | 'subtitleKeyframeSequence'
>

// export interface SubmissionState {
//   docs: Submission[],
//   totalDocs: number,
//   limit: number,
//   totalPages: number,
//   page: number,
//   pagingCounter: number,
//   hasPrevPage: boolean,
//   hasNextPage: boolean,
//   prevPage: number | null,
//   nextPage: number | null,
//   isParsed: 'true' | 'false' | 'all'
// }

export type Subfile = Pick<
  Article,
  | 'id'
  | 'UID'
  | 'editionId'
  | 'fromEditionId'
  | 'authcodeId'
  | 'albumId'
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

// export type ArticleFilter = Omit<ArticleSchema, 'id' | 'userId' | 'authcodeId' | 'albumId' | 'createAt' | 'updateAt'> & {
//   id: string
//   userId: string
//   authcodeId: string
//   albumId: string
//   createAt: string
//   updateAt: string
// }



// export type Submission = Pick<
//   ArticleType,
//   | 'id'
//   | 'UID'
//   | 'editionId'
//   | 'fromEditionId'
//   | 'albumId'
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
//   album: albumType
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
