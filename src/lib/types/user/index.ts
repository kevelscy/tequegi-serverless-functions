import type { Types } from 'mongoose'
import { TOrderState } from '../order'

export type TRole = 'ADMIN' | 'BASIC'

export type TRoles = { name: TRole, _id?: string }[]
export type TOrders = { state: TOrderState, _id?: string }[]

export interface IUserSchema {
  id?: Types.ObjectId
  _id?: Types.ObjectId
  phone: string
  password: string
  roles: TRoles | Types.ObjectId[]
  orders: TOrders | Types.ObjectId[]
  firstname?: string
  lastname?: string
  address?: string
}
export interface IAuth {
  phone?: string
  password: string
  firstname?: string
  lastname?: string
  address?: string
  roles: TRole[]
  createdAt: string
  updatedAt: string
  id: string
  token?: string
}

export interface IUserToSignUp {
  firstname?: string
  lastname?: string
  phone: string
  password: string
  address?: string
}

export interface IUserToSignIn {
  phone: string
  password: string
}
