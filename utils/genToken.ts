import { sign } from 'hono/jwt'

const genToken = (id: string, exp?: number) => {
  let payload: any = { id }
  if (exp) payload.exp = exp
  return sign(payload, Bun.env.JWT_SECRET || '')
}

export default genToken