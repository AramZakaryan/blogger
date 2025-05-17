import { ObjectId } from 'mongodb'
import { ArrangedViewModel } from './general'

export type CommentDbType = {
  content: string // minLength: 20; maxLength: 300
  commentatorInfo: CommentatorInfoDbType
  postId: ObjectId
  createdAt: Date
}

export type CommentViewModel = {
  id: string
  content: string
  commentatorInfo: CommentatorInfoViewModel
  createdAt: string
}

export type CommentatorInfoDbType = {
  userId: ObjectId
  userLogin: string // minLength: 3; maxLength: 10
}

export type CommentatorInfoViewModel = {
  userId: string
  userLogin: string
}
export type ArrangedCommentsViewModel = ArrangedViewModel<CommentViewModel>
