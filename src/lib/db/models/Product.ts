import { Schema, model, models, Model } from 'mongoose'
import { IProductSchema } from 'lib/types/product'

const productSchema = new Schema<IProductSchema>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'title cannot be grater than 100 characters'],
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: [300, 'description cannot be grater than 300 characters']
  },
  image: {
    url: {
      type: String,
      required: true,
      trim: true
    },

    publicId: {
      type: String,
      required: true,
      trim: true
    },

    width: {
      type: Number,
      required: false
    },

    height: {
      type: Number,
      required: false
    },

    format: {
      type: String,
      required: false
    }
  },
  price: {
    type: Number,
    required: true,
    maxlength: [10, 'price cannot be grater than 10 characters']
  },
  published: {
    type: Boolean,
    required: true
  },
  category: { type: Schema.Types.ObjectId, ref: 'Category' }
}, {
  timestamps: true,
  versionKey: false
})

productSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const ProductModel: Model<IProductSchema> = models.Product || model<IProductSchema>('Product', productSchema)
