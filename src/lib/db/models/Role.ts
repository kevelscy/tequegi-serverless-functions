import { Schema, model, models, Model } from 'mongoose'
import { IRoleSchema } from 'lib/types/user/role'

const roleSchema = new Schema<IRoleSchema>({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [30, 'description cannot be grater than 30 characters'],
    unique: true
  },
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, {
  timestamps: true,
  versionKey: false
})

roleSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const RoleModel: Model<IRoleSchema> = models.Role || model<IRoleSchema>('Role', roleSchema)
