import { NextApiRequest, NextApiResponse } from 'next'

import { connectDB } from 'lib/db/connection'
import { upgradeToAdmin } from 'lib/api/admin/upgradeToAdmin'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'PUT') return upgradeToAdmin(req, res)

  if (req.method !== 'PUT') {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
