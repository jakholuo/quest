import { Document, Schema, model } from 'mongoose'

interface IUser {
  name: string
  password: string
}

interface IUserDoc extends IUser, Document {
  mathPassword: (pass: string) => Promise<boolean>
}

const userSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.mathPassword = async function (enteredPassword: string) {
  return Bun.password.verifySync(enteredPassword, this.password)
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  this.password = await Bun.password.hash(this.password, {
    algorithm: 'bcrypt',
    cost: 4
  })
})

const User = model('User', userSchema)
export default User