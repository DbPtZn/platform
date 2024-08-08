
import type { RemovedEnum } from "@/enums"
import type { Subfile } from "."

export interface Album {
  id: string
  userId: string
  UID: string
  name: string
  cover: string
  desc: string
  isDisplayed: boolean
  removed: RemovedEnum
  createAt: string
  updateAt: string
}

export type AlbumType = Omit<Album, 'id' | 'userId' | 'removed' | 'createAt' | 'updateAt'> & {
  id: string
  userId: string
  createAt: string
  updateAt: string
}

export type AlbumState = Pick<AlbumType, 'id' | 'name' | 'isDisplayed'> & {
  subfiles: Subfile[]
}