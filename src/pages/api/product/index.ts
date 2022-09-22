import { NextApiRequest, NextApiResponse } from 'next'

import { getAllProducts } from 'lib/api/product/controllers'
import { connectDB } from 'lib/db/connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return getAllProducts(req, res)

  if (req.method !== 'GET') {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
