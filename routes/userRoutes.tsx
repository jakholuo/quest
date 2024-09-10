import { Hono } from 'hono'
import { user } from '../controllers'

const users = new Hono()

users.post('/token', (c) => user.getToken(c))

export default users