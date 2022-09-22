import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

import { UserModel } from 'lib/db/models/User'
import { RoleModel } from 'lib/db/models/Role'
import { IUserToSignUp } from 'lib/types/user'
import { normalizeUserRoles } from 'lib/utils/normalizeUserRoles'

export const signUp = async (req: NextApiRequest, res: NextApiResponse) => {
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
        error: 'SIGN_UP_USER_ERROR'
      })
    }

    const roleBasic: any = await RoleModel.findOneAndUpdate(
      { name: 'BASIC' },
      { $push: { users: newUser._id }
    })

    if (!roleBasic) {
      return res.status(500).json({
        data: null,
        error: 'ERROR_ROLE_MODEL'
      })
    }

    console.log('roleBasic', roleBasic)

    newUser.roles.push(roleBasic._id)

    const userPopulated = await (await newUser.save())
      .populate('roles', 'name')
        .then(doc => normalizeUserRoles(doc.toJSON()))
        .catch(err => console.error('Sign Up - userPopulated - err', err))

    return res.status(201).json({
      data: userPopulated,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `SIGN_UP_ERROR - ${err}`
    })
  }
}
