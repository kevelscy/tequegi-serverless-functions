import { NextApiRequest, NextApiResponse } from 'next'

import { connectDB } from 'lib/db/connection'
import { signIn } from 'lib/api/signin/controllers'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return signIn(req, res)

  if (req.method !== 'POST') {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
