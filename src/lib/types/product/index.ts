import type{ Types } from 'mongoose'

export interface IProductSchema {
  id: Types.ObjectId
  title: string
  image: {
    url: string
    publicId: string
    width: number
    height: number
    format: 'png' | 'jpg' | 'jpeg' | 'webp'
  }
  price: number
  published: boolean
  description?: string
  category: Types.ObjectId
}

export interface IProduct {
  id: string
  title: string
  image: {
    url: string
    publicId: string
    width: number
    height: number
    format: 'png' | 'jpg' | 'jpeg' | 'webp'
  }
  price: number
  published: boolean
  description?: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface IProductToCreate {
  title: string
  description: string
  image: File
  price: number
  category: string
  published: boolean
}
