import { ObjectId } from 'mongodb'

export type PostDbType = {
  _id: ObjectId
  title: string // maxLength: 30
  shortDescription: string // maxLength: 100
  content: string // maxLength: 1000
  blogId: ObjectId
  blogName: string
  createdAt: Date
}

export type PostType = Omit<PostDbType, '_id'> & { id: ObjectId }
