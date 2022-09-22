import { Schema, model, models, Model } from 'mongoose'
import { ICategorySchema } from 'lib/types/product/category'

const categorySchema = new Schema<ICategorySchema>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, 'title cannot be grater than 100 characters'],
    unique: true
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [300, 'description cannot be grater than 300 characters']
  },
  published: {
    type: Boolean,
    required: true,
    default: false
  },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, {
  timestamps: true,
  versionKey: false
})

categorySchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const CategoryModel: Model<ICategorySchema> = models.Category || model<ICategorySchema>('Category', categorySchema)
