import type { Types } from 'mongoose'

export interface IRoleSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  name: string
  users: Types.ObjectId[]
}

export interface IRoleReturnedDB {
  name: string,
  createdAt: string
  updatedAt: string
  id: string
  _id?: Types.ObjectId
}
