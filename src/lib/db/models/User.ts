// import { prop, Ref, pre, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
// import { hashSync } from 'bcryptjs'
// import { Role } from './Role'

// @modelOptions({
//   schemaOptions: {
//     timestamps: true,
//     versionKey: false
//     // toJSON: {
//     //   virtuals: true,
//     //   transform: (doc, objReturn) => {
//     //     objReturn.id = objReturn._id
//     //     delete objReturn._id
//     //     return objReturn
//     //   }
//     // },
//     // toObject: {
//     //   virtuals: true,
//     //   transform: (doc, objReturn) => {
//     //     objReturn.id = objReturn._id
//     //     delete objReturn._id
//     //     return objReturn
//     //   }
//     // }
//   }
// })

// @pre<User>('save', async function () {
//   this.password = hashSync(this.password)
// })

// export class User {
//   @prop({ type: String, unique: true, trim: true, maxlength: [100, 'username cannot be grater than 100 characters'] })
//     email: string

//   @prop({ type: String, unique: true, trim: true })
//     phone: string

//   @prop({ type: String, required: true })
//     password: string

//   @prop({ type: String, trim: true, lowercase: true })
//     photoUrl: string

//   @prop({ type: String, trim: true, maxlength: [30, 'firstname cannot be grater than 30 characters'] })
//     firstname: string

//   @prop({ type: String, unique: true, trim: true, maxlength: [30, 'lastname cannot be grater than 30 characters'] })
//     lastname: string

//   @prop({ type: String, lowercase: true, maxlength: [300, 'address cannot be grater than 300 characters'] })
//     address: string

//   @prop({ ref: () => Role })
//     roles: Ref<Role>[]
  
//   public static async userExistByPhone (this: ReturnModelType<typeof User>, phone: string) {
//     const userFounded = await this.exists({ phone: phone })
//     return userFounded
//   }
// }

import { IUserSchema } from 'lib/types/user'
import { Schema, model, models, Model } from 'mongoose'

const userSchema = new Schema<IUserSchema>({
  phone: {
    type: String,
    required: true,
    maxlength: [30, 'phone cannot be grater than 30 characters'],
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstname: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'name cannot be grater than 100 characters']
  },
  lastname: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'lastname cannot be grater than 100 characters']
  },
  address: {
    type: String,
    required: false,
    trim: true,
    maxlength: [300, 'lastname cannot be grater than 300 characters']
  },
  roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }]
}, {
  timestamps: true,
  versionKey: false
})

userSchema.methods.userExistByPhone = function(phone: string) {
  return this.model('User').find({ phone: phone })
}

userSchema.set('toJSON', {
  transform: function (document, returnedObject, options) {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const UserModel: Model<IUserSchema> = models.User || model<IUserSchema>('User', userSchema)
