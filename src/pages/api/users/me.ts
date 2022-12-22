import { NextApiRequest, NextApiResponse } from 'next'

import { verifyToken } from 'lib/utils/verifyToken'
import { getUserMe } from 'lib/api/me/controllers'
import { connectDB } from 'lib/db/connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && verifyToken(req, res)) return getUserMe(req, res)

  if (req.method !== 'GET') {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
