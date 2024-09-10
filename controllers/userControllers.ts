import { Context } from 'hono'
import { User } from '../models'
import { genToken } from '../utils'

export const getToken = async (c: Context) => {
  const { name, password } = await c.req.json()

  if (!name || !password) {
    c.status(400)
    throw new Error('Please provide an name and password')
  }

  const user = await User.findOne({ name })
  if (!user) {
    c.status(401)
    throw new Error('No user found with this name')
  }

  if (!(await user.mathPassword(password))) {
    c.status(401)
    throw new Error('Invalid credentials')
  } else {
    const token = await genToken(user._id!.toString(), Bun.env.TOKEN_EXPIRE_TIME === "0" ? 0 : Math.floor(Date.now() / 1000 + Number(Bun.env.TOKEN_EXPIRE_TIME)))

    return c.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
      },
      token,
      message: 'User logged in successfully',
    })
  }
}