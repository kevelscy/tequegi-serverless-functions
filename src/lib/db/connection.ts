import { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'

import type { THandler } from 'lib/types/api'

export const connectDB = (handler: THandler) => async (req: NextApiRequest, res: NextApiResponse) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res)
  }

  // Use new db connection
  await mongoose.connect(process.env.MONGODB_URI)
  return handler(req, res)
}
