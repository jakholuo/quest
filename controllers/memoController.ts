import { Context } from 'hono'
import dayjs from 'dayjs'
import marked from '../utils/marked'
import { Memo } from '../models'

export const createMome = async (c: Context) => {
  const { content, tags } = await c.req.json()

  if (!content || !tags) {
    c.status(400)
    throw new Error('Please provide a content and tags list')
  }

  const memo = await Memo.create({
    content,
    tags,
  })

  const kvjs = c.get('kvjs')
  const listArr = kvjs.keys('list_*')
  const delCache = kvjs.del(...[...listArr, 'index'])
  // console.log('缓存删除数量', delCache)

  if (!memo) {
    c.status(400)
    throw new Error('Invalid memo data')
  }

  return c.json({
    success: true,
    data: {
      _id: memo._id,
    },
    message: 'Public Memo successfully',
  })
}

export const findMomeById = async (c: Context) => {
  const { id } = await c.req.query()

  if (!id) {
    c.status(400)
    throw new Error('Please provide a id')
  }

  const memo = await Memo.findById(id)

  if (!memo) {
    c.status(400)
    throw new Error('Invalid memo data')
  }

  return c.json({
    success: true,
    data: {
      _id: memo._id,
      content: marked.parse(memo.content),
      createdAt: memo.createdAt
    }
  })
}

export const findMomes = async (c: Context) => {
  const { size=Number(Bun.env.INDEX_PAGE_SIZE), prev, tags } = await c.req.json()
  if (size <= 0 || size >= 100) {
    c.status(400)
    throw new Error('Invalid size num')
  }

  const kvjs = c.get('kvjs')
  let keyName = `list_size${size}_`
  let query: any = {}
  let memos: any[] = []

  if (prev) {
    const prevMemo = await Memo.findById(prev)
    if (!prevMemo) {
      c.status(400)
      throw new Error('Invalid prev mome id')
    }
    keyName += `${prev}_`
    query.createdAt = { $lt: prevMemo.createdAt }
  }

  if (tags && tags.length > 0) {
    keyName += JSON.stringify(tags)
    query.tags = { $in: tags }
  }

  const cacheContent = kvjs.get(keyName)
  if (!cacheContent) {
    memos = await Memo.find(query)
    .sort({ createdAt: -1 })
    .limit(size)
    .select('_id content createdAt tags')
    memos = memos.map(item => ({
      ...item.toObject(),
      content: marked.parse(item.content),
      tags: item.tags.map((tag: string) => (`<span class='tag-item'>#${tag}</span>`)),
      time: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }))
    kvjs.set(keyName, JSON.stringify(memos), Number(Bun.env.CACHE_SECONDS))
  } else {
    console.log('走缓存')
    memos = JSON.parse(cacheContent)
  }

  return c.json({
    success: true,
    data: memos
  })

}

export const findTags = async (c: Context) => {
  const tags = await Memo.distinct('tags');
    
  return c.json({
    success: true,
    data: tags
  });
}

export const updateMemo = async (c: Context) => {
  const { id, content, tags } = await c.req.json()

  if (!id || !content || !tags) {
    c.status(400)
    throw new Error('Invalid memo data')
  }

  const memo = await Memo.findByIdAndUpdate(id, { content, tags })

  if (!memo) {
    c.status(400)
    throw new Error('Invalid memo id')
  }

  const kvjs = c.get('kvjs')
  kvjs.del(`memo_${id}`)

  return c.json({
    success: true,
    data: {
      _id: memo._id,
    },
    message: 'Update successfully'
  })
}

export const deleteMemo = async (c: Context) => {
  const { id } = await c.req.json()

  if (!id) {
    c.status(400)
    throw new Error('Invalid memo id')
  }

  const memo = await Memo.findByIdAndDelete(id)

  if (!memo) {
    c.status(404)
    throw new Error('Invalid memo id')
  }

  const kvjs = c.get('kvjs')
  kvjs.del(`memo_${id}`)

  return c.json({
    success: true,
    message: 'Delete successfully'
  })
}
