import { NextApiRequest, NextApiResponse } from 'next'

import { getAllUsers, createUser, updateUser, deleteUserById } from 'lib/api/user/controllers'
import { verifyAdmin } from 'lib/utils/verifyAdmin'
import { connectDB } from 'lib/db/connection'
import { THandler } from 'lib/types/api'

const handler: THandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return getAllUsers(req, res)

  if (req.method === 'POST' && verifyAdmin(req, res)) return createUser(req, res)

  if (req.method === 'PUT' && verifyAdmin(req, res)) return updateUser(req, res)

  if (req.method === 'DELETE' && verifyAdmin(req, res)) return deleteUserById(req, res)

  if (
    req.method !== 'GET' &&
    req.method !== 'POST' &&
    req.method !== 'PUT' &&
    req.method !== 'DELETE'
  ) {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
