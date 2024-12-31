import { ObjectId } from 'mongodb'
import { ArrangedViewModel } from './general'

export type BlogType = {
  name: string // maxLength: 15
  description: string // maxLength: 500
  websiteUrl: string // maxLength: 100
  createdAt: Date
  isMembership: boolean
}

export type BlogViewModel = Omit<BlogType, 'createdAt'> & {
  id: string
  createdAt: string
}

export type ArrangedBlogsViewModel = ArrangedViewModel<BlogViewModel>
