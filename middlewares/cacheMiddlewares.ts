import { Context, Next } from 'hono'
import kvjs from '../utils/kv'

export const cache = async (c: Context, next: Next) => {

  try {
    c.set('kvjs', kvjs)
    await next()   
  } catch (error) {
    await next()   
  }

}