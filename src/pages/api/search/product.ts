import { NextApiRequest, NextApiResponse } from 'next'

import { searchProduct } from 'lib/api/search/product'
import { connectDB } from 'lib/db/connection'

export const config = {
  api: { bodyParser: false }
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') return searchProduct(req, res)

  if (req.method !== 'POST') {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
