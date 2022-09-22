import { NextApiRequest, NextApiResponse } from 'next'

import { signUp } from 'lib/api/signup/controllers'
import { connectDB } from 'lib/db/connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return signUp(req, res)

  if (req.method !== 'POST') {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
