import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { serveStatic } from 'hono/bun'
import { prettyJSON } from 'hono/pretty-json'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { Users, Pages, Memos } from './routes'
import { errorHandler, notFound } from './middlewares'
import connectDB from './config/db'

const app = new Hono().basePath('/')

connectDB()

app.use('*', logger(), prettyJSON())

app.use(
  '*',
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  })
)

app.use('/public/*', serveStatic({ root: './' }))

app.route('/', Pages)
app.route('/api/users', Users)
app.route('/api/memo', Memos)

app.onError((err, c) => {
  const error = errorHandler(c)
  return error
})

app.notFound((c) => {
  const error = notFound(c)
  return error
})

app.use(compress())

const port = Bun.env.PORT || 8848

export default {
  port,
  fetch: app.fetch,
}