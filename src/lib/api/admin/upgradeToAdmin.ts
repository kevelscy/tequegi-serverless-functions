import { NextApiRequest, NextApiResponse } from 'next'
import { RoleModel } from 'lib/db/models/Role'
import { UserModel } from 'lib/db/models/User'

export const upgradeToAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.body

    console.log(id)

    if (!id) {
      return res.status(422).json({
          data: null,
          error: 'FIELDS_MISSING'
        })
    }

    const userFounded = await (await UserModel.findById(id)).populate('roles', 'name')

    if (!userFounded) {
      return res.status(405).json({
        data: null,
        error: 'USER_NOT_FOUNDED'
      })
    }

    const roleAdmin = await RoleModel.findOne({ 'name': 'ADMIN' })
  
    if (!roleAdmin) {
      return res.status(404).json({
        data: null,
        error: 'ROLE_ADMIN_NOT_FOUND'
      })
    }

    const userIsAdmin = userFounded.roles.some(role => role._id.toString() === roleAdmin._id.toString())

    if (userIsAdmin) {
      return res.status(402).json({
        data: null,
        error: 'USER_IS_ADMIN'
      })
    }

    await UserModel.findByIdAndUpdate(id, { '$push': { roles: roleAdmin._id } })
  
    return res.status(200).json({
      data: true,
      error: null
    })
    
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: 'UPGRADE_TO_ADMIN_ERROR'
    })
  }
}
