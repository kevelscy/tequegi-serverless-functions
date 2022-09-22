import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import { normalizeUserRoles } from 'lib/utils/normalizeUserRoles'
import { UserModel } from 'lib/db/models/User'
import { IUserToSignIn } from 'lib/types/user'
import 'lib/db/models/Role'

export const signIn = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { phone, password } = req.body as IUserToSignIn
    const userDB = await UserModel.findOne({ phone }).populate('roles', 'name')

    console.log('userDB', userDB)

    if (!userDB) {
      return res.status(401).json({
        data: null,
        error: 'CREDENTIALS_ERROR'
      })
    }

    const usersNormalized = normalizeUserRoles(userDB.toJSON())

    if (!usersNormalized) {
      return res.status(401).json({
        data: null,
        error: 'NORMALIZE_USER_ERROR'
      })
    }

    const passwordValidated = bcrypt.compareSync(password, usersNormalized.password)
    const token = jwt.sign(
      {
        id: usersNormalized.id || usersNormalized._id,
        isAdmin: usersNormalized.roles.some(role => role.name === 'ADMIN')
      },
      process.env.JWT_KEY_SECRET, { expiresIn: '1h'}
    )

    if (!passwordValidated || !token) {
      return res.status(403).json({
        data: null,
        error: 'SIGNIN_VALIDATE_ERROR'
      })
    }
  
    return res.status(200).json({
      data: { ...usersNormalized, token },
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `SIGN_IN_ERROR - ${err}`
    })
  }
}
