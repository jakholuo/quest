import { Context } from 'hono'

// Error Handler
export const errorHandler = (c: Context) => {
  c.status(500)
  return c.json({
    success: false,
    message: c.error?.message,
    // stack: process.env.NODE_ENV === 'production' ? null : c.error?.stack,
  })
}

// Not Found Handler
export const notFound = (c: Context) => {
  c.status(404)
  return c.json({
    success: false,
    message: `Not Found - [${c.req.method}] ${c.req.url}`,
  })
}