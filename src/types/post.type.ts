import { ObjectId } from 'mongodb'
import { ArrangedViewModel } from './general'

export type PostDbType = {
  title: string // maxLength: 30
  shortDescription: string // maxLength: 100
  content: string // maxLength: 1000
  blogId: ObjectId
  blogName: string
  createdAt: Date
}

export type PostViewModel = Omit<PostDbType, 'blogId' | 'createdAt'> & {
  id: string
  blogId: string
  createdAt: string
}

export type ArrangedPostsViewModel = ArrangedViewModel<PostViewModel>
