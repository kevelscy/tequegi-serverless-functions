import { NextApiRequest, NextApiResponse } from 'next'

import { normalizeUserRoles } from 'lib/utils/normalizeUserRoles'
import { decodeAccessToken } from 'lib/utils/decodeAccessToken'
import { UserModel } from 'lib/db/models/User'
import 'lib/db/models/Role'

export const getUserMe = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      return res.status(422).json({
        data: null,
        error: 'TOKEN_MISSING'
      })
    }

    const { id } = decodeAccessToken(token)

    const userFounded = await UserModel.findById(id).populate('roles', 'name')

    if (!userFounded) {
      return res.status(404).json({
        data: null,
        error: 'USER_NOT_FOUNDED'
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
      error: `GET_ME_ERROR - ${err}`
    })
  }
}
