import { Hono } from 'hono'
import { Memo } from '../models'
import { cache } from '../middlewares'
import marked from '../utils/marked'
import IndexPage from '../pages/index'
import MemoPage from '../pages/memo'
import dayjs from 'dayjs'

type Variables = {
  kvjs: any
}

const index = new Hono<{ Variables: Variables }>()

index.get('/', cache, async (c) => {
  const kvjs = c.get('kvjs')
  const cacheContent = kvjs.get('index')
  let memos: any[] = []
  if (!cacheContent) {
    memos = await Memo.find()
    .sort({ createdAt: -1 })
    .limit(Number(Bun.env.INDEX_PAGE_SIZE))
    .select('_id content createdAt tags')
    memos = memos.map(item => ({
      ...item.toObject(),
      content: marked.parse(item.content),
      tags: item.tags.map((tag: string) => (`<span class='tag-item'>#${tag}</span>`)),
      time: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }))
    kvjs.set('index', JSON.stringify(memos), Number(Bun.env.CACHE_SECONDS))
  } else memos = JSON.parse(cacheContent)
  return c.html(
    <IndexPage memos={memos} />
  )
})

index.get('/m/:id', cache, async (c) => {
  const { id } = await c.req.param()

  if (!id) {
    c.status(404)
    throw new Error('Please provide a id')
  }

  const kvjs = c.get('kvjs')
  const cacheContent = kvjs.get(`memo_${id}`)

  let memo: any = {}
  if(!cacheContent) {
    memo = await Memo.findById(id)
    memo = {
      ...memo.toObject(),
      content: marked.parse(memo.content),
      tags: memo.tags.map((tag: string) => (`<span class='tag-item'>#${tag}</span>`)),
      time: dayjs(memo.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }
    kvjs.set(`memo_${id}`, JSON.stringify(memo), Number(Bun.env.CACHE_SECONDS))
  } else memo = JSON.parse(cacheContent)

  if (!memo) {
    c.status(404)
    throw new Error('Invalid memo data')
  }
  
  return c.html(
    <MemoPage title={memo.content.replace(/<[^>]*>/g, '').slice(0, 20)} keywords={memo.tags.join(',')} description={memo.content.replace(/<[^>]*>/g, '').slice(0, 100)} memo={memo} />
  )
})

export default index