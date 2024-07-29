

export interface UploadFileSchema {
  id: string
  userId: string
  type: 'image' | 'audio'
  name: string
  extname: string
  size: number
  md5: string
  path: string
  createdAt: Date
  updatedAt: Date
}
