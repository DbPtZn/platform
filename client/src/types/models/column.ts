
import type { RemovedEnum } from "@/enums"
import type { Subfile } from "."

export interface Column {
  id: string
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

export type ColumnType = Omit<Column, 'id' | 'userId' | 'removed' | 'createAt' | 'updateAt'> & {
  id: string
  userId: string
  createAt: string
  updateAt: string
}

export type ColumnState = Pick<ColumnType, 'id' | 'name' | 'isPublish'> & {
  subfiles: Subfile[]
}