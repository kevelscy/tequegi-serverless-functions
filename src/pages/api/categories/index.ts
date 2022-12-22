import { NextApiRequest, NextApiResponse } from 'next'

import { getAllCategories, createCategory } from 'lib/api/category/controllers'
import { connectDB } from 'lib/db/connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return getAllCategories(req, res)
  if (req.method === 'POST') return createCategory(req, res)

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
