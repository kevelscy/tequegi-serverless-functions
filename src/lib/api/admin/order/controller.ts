import { NextApiRequest, NextApiResponse } from 'next'

import { OrderModel } from 'lib/db/models/Order'
import { UserModel } from 'lib/db/models/User'
import 'lib/db/models/Role'
import { ORDER_STATE } from 'lib/types/order'

export const getAllOrders = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const orders = await OrderModel.find().populate('users')
    // const productsNormalized = products.map(product => normalizeProductCategoryTitle(product.toJSON()))

    return res.status(200).json({
      data: orders,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `GET_ALL_ORDERS_ERROR - ${err}`
    })
  }
}

export const getOrderById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { orderId } = req.body
    const order = await OrderModel.findById(orderId).populate('user')

    return res.status(200).json({
      data: order,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `GET_ORDER_BY_ID_ERROR - ${err}`
    })
  }
}

export const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const order = req.body

    if (!order.userInfo || !order.productInfo) {
      return res.status(422).json({
        data: null,
        error: 'FIELDS_MISSING'
      })
    }

    const newOrder = new OrderModel({
      state: ORDER_STATE['PENDING'],
      user: null  
    })

    if (!newOrder) {
      return res.status(403).json({
        data: null,
        error: 'CREATE_ORDER_ERROR'
      })
    }

    const userUpdated: any = await UserModel.findOneAndUpdate(
      { id: order.userInfo.id },
      { $push: { orders: newOrder._id } },
      { new: true }
    )

    if (!userUpdated) {
      return res.status(500).json({
        data: null,
        error: 'ERROR_ORDER_MODEL_UPDATE'
      })
    }

    const orderPopulated = await (await newOrder.save())
      .populate('users', 'id')
      .then(doc => {
        const docObj = doc.toJSON()
        return docObj
      })

    if (!orderPopulated) {
      return res.status(403).json({
        data: null,
        error: 'CREATE_ORDER_POPULATED_ERROR'
      })
    }

    return res.status(200).json({
      data: orderPopulated,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `CREATE_ORDER - ${err}`
    })
  }
}

export const updateOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { order } = req.body
    const orderUpdated = await OrderModel.findByIdAndUpdate(order.id, { ...order })
  
    return res.status(200).json({
      data: orderUpdated,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `UPDATE_ORDER - ${err}`
    })
  }
}

export const deleteOrderById = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { id } = req.query
  
    if (!id) {
      return res.status(422).json({
          data: null,
          error: 'QUERY_MISSING'
        })
    }
  
    const orderDeleted =  await OrderModel.findByIdAndDelete(id)
    
    if (!orderDeleted) {
      return res.status(500).json({
        data: null,
        error: 'ORDER_NOT_DELETED'
      })
    }
  
    return res.status(200).json({
      data: true,
      error: null
    })

  } catch (err) {
    return res.status(500).json({
      data: null,
      error: `DELETE_ORDER_BY_ID_ERROR - ${err}`
    })
  }
}
