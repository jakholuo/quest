import * as mongoose from 'mongoose'
import { User } from '../models'

const connectDB = async () => {
  try {
    if (Bun.env.MONGO_URI !== undefined) {
      const conn = await mongoose.connect(Bun.env.MONGO_URI, {
        autoIndex: true,
      })

      console.log(`MongoDB Connected: ${conn.connection.host}`)

      const userExists = await User.findOne({ name: Bun.env.ADMIN_USERNAME });
      if (userExists) {
        return;
      }
      await User.create({
        name: Bun.env.ADMIN_USERNAME,
        password: Bun.env.ADMIN_PASSWORD,
      })
      console.log('Admin user created');
    }
  } catch (err: any) {
    console.error(`Error: ${err.message}`)
    process.exit(1)
  }
}

export default connectDB