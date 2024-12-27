import { ObjectId } from 'mongodb'

export type BlogDbType = {
  _id: ObjectId
  name: string // maxLength: 15
  description: string // maxLength: 500
  websiteUrl: string // maxLength: 100
  createdAt: Date
  isMembership: boolean
}

export type BlogType = Omit<BlogDbType, '_id'> & { id: ObjectId }
