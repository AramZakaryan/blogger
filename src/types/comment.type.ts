import { ObjectId } from 'mongodb'
import { ArrangedViewModel } from './general'

export type CommentDbType = {
  content: string // minLength: 20; maxLength: 300
  commentatorInfo: {
    userId: ObjectId
    userLogin: string // minLength: 3; maxLength: 10
  }
  createdAt: Date
}

export type CommentViewModel = Omit<CommentDbType, 'createdAt' | 'commentatorInfo'> & {
  id: string
  commentatorInfo: {
    userId: string
    userLogin: string
  }
  createdAt: string
}
