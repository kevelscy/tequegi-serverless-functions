import type { Types } from 'mongoose'

export interface ICategorySchema {
  id: Types.ObjectId
  title: string
  description: string
  published: boolean
  products: Types.ObjectId[]
}

export interface ICategory {
  id: string
  title: string
  description: string
  published: boolean
  products: string[]
  createdAt: string
  updatedAt: string
}

export interface ICategoryToCreate {
  title: string
  description: string
  published: boolean
  products: string[]
}