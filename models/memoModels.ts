import { Document, Schema, model } from 'mongoose'

interface IMemo {
  content: string
  tags: string[]
  createdAt: string
}

interface IMemoDoc extends IMemo, Document {
  mathPassword: (pass: string) => Promise<boolean>
}

const memoSchema = new Schema<IMemoDoc>(
  {
    content: { type: String, required: true },
    tags: { type: [], required: true },
  },
  {
    timestamps: true,
  }
)

const Memo = model('Memo', memoSchema)
export default Memo