import { Hono } from 'hono'
import { memo } from '../controllers'
import { protect } from '../middlewares'
import { cache } from '../middlewares'

type Variables = {
  kvjs: any
}

const memos = new Hono<{ Variables: Variables }>()

memos.post('/create', protect, (c) => memo.createMome(c))
memos.post('/list', cache, (c) => memo.findMomes(c))
memos.get('/tags', protect, (c) => memo.findTags(c))
memos.get('/get', protect, (c) => memo.findMomeById(c))
memos.post('/update', protect, (c) => memo.updateMemo(c))
memos.post('/delete', protect, (c) => memo.deleteMemo(c))

export default memos