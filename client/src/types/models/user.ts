

export interface UserSchema {
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
  columnSequence: string[]
  createAt: Date
  updateAt: Date
}


export type UserType = Omit<
  UserSchema,
 'id' | 'removed' | 'encryptedPassword' | 'createAt' | 'updateAt'
> & { 
  id: string
  createAt: string
  updateAt: string
}

export type UserState = UserType

export type UserListItem = Pick<
  UserType,
  'UID' | 'nickname' | 'avatar' | 'desc' | 'createAt' | 'updateAt'
> 

export type ArticleUserInfo = Pick<
  UserType,
  'UID' | 'nickname' | 'avatar'
> 
