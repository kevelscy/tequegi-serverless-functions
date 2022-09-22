import { NextApiRequest, NextApiResponse } from 'next'

import { getAllCategories, createCategory, updateCategory } from 'lib/api/category/controllers'
import { verifyAdmin } from 'lib/utils/verifyAdmin'
import { connectDB } from 'lib/db/connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return getAllCategories(req, res)

  if (req.method === 'POST') return createCategory(req, res)

  if (req.method === 'PUT') return updateCategory(req, res)

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
