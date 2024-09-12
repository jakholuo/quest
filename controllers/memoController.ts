import { Context } from 'hono'
import dayjs from 'dayjs'
import { marked } from 'marked'
import { Memo } from '../models'

const renderer = new marked.Renderer();
renderer.link = function(href: string, title: string, text: string) {
  var link = marked.Renderer.prototype.link.apply(this, arguments)
  return link.replace("<a","<a target='_blank'")
}

marked.setOptions({
  renderer: renderer
})

export const createMome = async (c: Context) => {
  const { content, tags } = await c.req.json()

  if (!content || !tags) {
    c.status(400)
    throw new Error('Please provide a content and tags list')
  }

  const memo = await Memo.create({
    content: marked.parse(content),
    tags,
  })

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
      content: memo.content,
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

  let query: any = {}

  if (prev) {
    const prevMemo = await Memo.findById(prev)
    if (!prevMemo) {
      c.status(400)
      throw new Error('Invalid prev mome id')
    }
    query.createdAt = { $lt: prevMemo.createdAt }
  }

  if (tags && tags.length > 0) {
    query.tags = { $in: tags }
  }

  const memos = await Memo.find(query)
    .sort({ createdAt: -1 })
    .limit(size)
    .select('_id content createdAt tags')

  return c.json({
    success: true,
    data: memos.map((item) => ({
      ...item.toObject(),
      tags: item.tags.map((tag: string) => (`<span class='tag-item'>#${tag}</span>`)),
      time: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
    }))
  })

}

export const findTags = async (c: Context) => {
  const tags = await Memo.distinct('tags');
    
  return c.json({
    success: true,
    data: tags
  });
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

  return c.json({
    success: true,
    message: 'Delete successfully'
  })
}
