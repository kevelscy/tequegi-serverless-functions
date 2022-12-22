import { NextApiRequest, NextApiResponse } from 'next'

import { deleteOrderById, getOrderById } from 'lib/api/admin/order/controller'
import { verifyAdmin } from 'lib/utils/verifyAdmin'
import { connectDB } from 'lib/db/connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && req.query.id) return getOrderById(req, res)

  if (req.method === 'DELETE' && req.query.id && verifyAdmin(req, res)) return deleteOrderById(req, res)

  if (req.method !== 'GET' && req.method !== 'DELETE') {
    return res.status(405).json({
      data: null,
      error: 'METHOD_NOT_ALLOWED'
    })
  }
}

export default connectDB(handler)
