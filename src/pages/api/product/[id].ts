import { NextApiRequest, NextApiResponse } from 'next'

import { deleteProductById, getProductById, updateProduct } from 'lib/api/product/controllers'
import { connectDB } from 'lib/db/connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') return getProductById(req, res)
  if (req.method === 'PUT') return updateProduct(req, res)
  if (req.method === 'DELETE') return deleteProductById(req, res)

  if (
    req.method !== 'GET' &&
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
