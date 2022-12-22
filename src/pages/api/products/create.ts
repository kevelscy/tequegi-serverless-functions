import { NextApiRequest, NextApiResponse } from 'next'

import { createProduct } from 'lib/api/product/controllers'
import { connectDB } from 'lib/db/connection'

export const config = {
  api: { bodyParser: false }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return createProduct(req, res)

  if (req.method !== 'POST') {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
