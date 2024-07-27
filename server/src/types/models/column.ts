
import type { RemovedEnum } from "src/enum"
import type { Subfile } from "."

export interface ColumnSchema {
  _id: string
  userId: string
  UID: string
  name: string
  cover: string
  desc: string
  isPublish: boolean
  removed: RemovedEnum
  createAt: Date
  updateAt: Date
}

export type ColumnType = Omit<ColumnSchema, '_id' | 'userId' | 'removed' | 'createAt' | 'updateAt'> & {
  _id: string
  userId: string
  createAt: string
  updateAt: string
}

export type ColumnState = Pick<ColumnType, '_id' | 'name' | 'isPublish'> & {
  subfiles: Subfile[]
}