import { ArrangedViewModel } from './general'

export type BlogDbType = {
  name: string // maxLength: 15
  description: string // maxLength: 500
  websiteUrl: string // maxLength: 100
  createdAt: Date
  isMembership: boolean
}

export type BlogViewModel = Omit<BlogDbType, 'createdAt'> & {
  id: string
  createdAt: string
}

export type ArrangedBlogsViewModel = ArrangedViewModel<BlogViewModel>
