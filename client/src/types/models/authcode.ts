

export interface AuthCode {
  id: string
  userId: string
  name: string
  code: string
  desc: string
  disabled: boolean
  createAt: Date
  updateAt: Date
}

// export type AuthCodeType = Omit<
// AuthCodeSchema,
//  'id'| 'userId' | 'createAt' | 'updateAt'
// > & { 
//   _id: string
//   createAt: string
//   updateAt: string
// }