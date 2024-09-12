import { Hono } from 'hono'
import { Memo } from '../models'
import marked from '../utils/marked'
import IndexPage from '../pages/index'
import MemoPage from '../pages/memo'
import dayjs from 'dayjs'

const index = new Hono()

index.get('/', async (c) => {
  const memos = await Memo.find()
    .sort({ createdAt: -1 })
    .limit(Number(Bun.env.INDEX_PAGE_SIZE))
    .select('_id content createdAt tags')
  
  return c.html(
    <IndexPage memos={memos.map(item => (
      {
        ...item.toObject(),
        content: marked.parse(item.content),
        tags: item.tags.map((tag: string) => (`<span class='tag-item'>#${tag}</span>`)),
        time: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      }
    ))} />
  )
})

index.get('/m/:id', async (c) => {
  const { id } = await c.req.param()

  if (!id) {
    c.status(404)
    throw new Error('Please provide a id')
  }

  const memo = await Memo.findById(id)

  if (!memo) {
    c.status(404)
    throw new Error('Invalid memo data')
  }
  
  return c.html(
    <MemoPage title={memo.content.replace(/<[^>]*>/g, '').slice(0, 20)} keywords={memo.tags.join(',')} description={memo.content.replace(/<[^>]*>/g, '').slice(0, 100)} memo={{
      ...memo.toObject(),
      content: marked.parse(memo.content),
      tags: memo.tags.map((tag: string) => (`<span class='tag-item'>#${tag}</span>`)),
      time: dayjs(memo.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }} />
  )
})

export default index