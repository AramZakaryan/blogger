import { ObjectId } from 'mongodb'

export type PostViewModel = PostType & { id: ObjectId }

export type PostType = {
  title: string // maxLength: 30
  shortDescription: string // maxLength: 100
  content: string // maxLength: 1000
  blogId: ObjectId
  blogName: string
  createdAt: Date
}
