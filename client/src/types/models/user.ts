

export interface User {
  id: string
  UID: string
  account: string
  encryptedPassword: string
  nickname: string
  avatar: string
  desc: string
  info: {
    email: string,
    phone: string
  }
  receiverConfig: {
    status: 0 | 1 | 2
    autoParse: boolean
    sizeLimit: number
  }
  albumSequence: string[]
  createAt: string
  updateAt: string
}


// export type UserType = Omit<
//   User,
//  'id' | 'removed' | 'encryptedPassword' | 'createAt' | 'updateAt'
// > & { 
//   id: string
//   createAt: string
//   updateAt: string
// }

export type UserState = User

export type UserListItem = Pick<
  User,
  'UID' | 'nickname' | 'avatar' | 'desc' | 'createAt' | 'updateAt'
> 

export type ArticleUserInfo = Pick<
  User,
  'UID' | 'nickname' | 'avatar'
> 
