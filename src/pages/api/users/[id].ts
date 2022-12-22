import { NextApiRequest, NextApiResponse } from 'next'

import { connectDB } from 'lib/db/connection'
import { deleteUserById, getUserById } from 'lib/api/user/controllers'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.id) return getUserById(req, res)

  if (req.method === 'DELETE' && req.query.id) return deleteUserById(req, res)

  if (req.method !== 'GET' && req.method !== 'DELETE') {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
