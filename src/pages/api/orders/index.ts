import { NextApiRequest, NextApiResponse } from 'next'

import { createOrder, getAllOrders, updateOrder } from 'lib/api/admin/order/controller'
import { verifyAdmin } from 'lib/utils/verifyAdmin'
import { connectDB } from 'lib/db/connection'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET' && verifyAdmin(req, res)) return getAllOrders(req, res)

  if (req.method === 'POST') return createOrder(req, res)

  if (req.method === 'PUT' && verifyAdmin(req, res)) return updateOrder(req, res)

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
