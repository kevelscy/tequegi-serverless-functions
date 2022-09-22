import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

import { RoleModel } from 'lib/db/models/Role'
import { UserModel } from 'lib/db/models/User'

import type { IUserSchema, IUserToSignUp } from 'lib/types/user'
import { normalizeUserRoles } from 'lib/utils/normalizeUserRoles'
import { IRoleReturnedDB } from 'lib/types/user/role'

export const getAllUsers = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const users = await UserModel.find().populate('roles', 'name')
    const usersNormalized = users.map(user => normalizeUserRoles(user.toJSON()))

    return res.status(200).json({
      data: usersNormalized,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `GET_ALL_USERS_ERROR - ${err}`
    })
  }
}

export const getUserById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
  
    const userFounded = await UserModel.findById(id).populate('roles', 'name')

    if (!userFounded) {
      return res.status(404).json({
        data: null,
        error: 'USER_NOT_FOUND'
      })
    }

    const userNormalized = normalizeUserRoles(userFounded.toJSON())

    return res.status(200).json({
      data: userNormalized,
      error: null
    })
    
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `GET_USER_BY_ID_ERROR - ${err}`
    })
  }
}

export const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user: IUserToSignUp = req.body

    if (!user.phone || !user.password) {
      return res.status(422).json({
          data: null,
          error: 'FIELDS_MISSING'
        })
    }

    const userExists = await UserModel.exists({ phone: user.phone })

    if (userExists) {
      return res.status(409).json({
          data: null,
          error: 'USER_EXISTS'
        })
    }

    const newUser = new UserModel({
      password: await bcrypt.hash(user.password, 10),
      firstname: user.firstname || null,
      lastname: user.lastname,
      address: user.address,
      phone: user.phone,
      roles: [],
      orders: []
    })

    if (!newUser) {
      return res.status(403).json({
        data: null,
        error: 'CREATE_USER_ERROR'
      })
    }

    const roleBasic: any = await RoleModel.findOneAndUpdate(
      { name: 'BASIC' },
      { $push: { users: newUser._id }
    })

    if (!roleBasic) {
      return res.status(500).json({
        data: null,
        error: 'ERROR_USER_MODEL_ROLE'
      })
    }

    console.log('roleBasic', roleBasic)

    newUser.roles.push(roleBasic._id)

    const userPopulated = await (await newUser.save())
      .populate('roles', 'name')
        .then(doc => normalizeUserRoles(doc.toJSON()))
        .catch(err => console.error('Create User - userPopulated - err', err))

    return res.status(201).json({
      data: userPopulated,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `CREATE_USER_ERROR - ${err}`
    })
  }
}

export const updateUser = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = req.body
  
    if (!user) {
      return res.status(422).json({
          data: null,
          error: 'USER_MISSING'
        })
    }

    const userUpdated = await UserModel.findByIdAndUpdate(user.id, user)
    const userNormalized = normalizeUserRoles(userUpdated.toJSON())
  
    return res.status(200).json({
      data: userNormalized,
      error: null
    })
    
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `UPDATE_USER_ERROR - ${err}`
    })
  }
}

export const deleteUserById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
  
    if (!id) {
      return res.status(422).json({
          data: null,
          error: 'FIELDS_MISSING'
        })
    }
  
    const userDeleted =  await UserModel.findByIdAndDelete(id)
    
    if (!userDeleted) {
      return res.status(500).json({
        data: null,
        error: 'USER_NOT_DELETED'
      })
    }
  
    return res.status(200).json({
      data: true,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `DELETE_USER_BY_ID_ERROR - ${err}`
    })
  }
}
