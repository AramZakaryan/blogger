import { ObjectId } from 'mongodb'

export type BlogType = {
  id: string
  name: string // maxLength: 15
  description: string // maxLength: 500
  websiteUrl: string // maxLength: 100
}

export type BlogDbType = {
  _id: ObjectId
  name: string // maxLength: 15
  description: string // maxLength: 500
  websiteUrl: string // maxLength: 100
  createdAt: Date
}
