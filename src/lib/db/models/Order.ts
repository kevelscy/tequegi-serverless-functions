import { Schema, model, models, Model } from 'mongoose'
import { IOrderSchema } from 'lib/types/order'

const orderSchema = new Schema<IOrderSchema>({
  state: {
    type: String,
    required: true
  },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: false }
}, {
  timestamps: true,
  versionKey: false
})

orderSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const OrderModel: Model<IOrderSchema> = models.Order || model<IOrderSchema>('Order', orderSchema)
