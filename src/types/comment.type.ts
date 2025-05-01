import { ObjectId } from 'mongodb'
import { ArrangedViewModel } from './general'
import { PostViewModel } from './post.type'

export type CommentDbType = {
  content: string // minLength: 20; maxLength: 300
  // commentatorInfo: {
  //   userId: ObjectId
  //   userLogin: string // minLength: 3; maxLength: 10
  // }
  postId: ObjectId
  createdAt: Date
}

export type CommentViewModel = {
  id: string
  content: string
  // commentatorInfo: {
  //   userId: string
  //   userLogin: string
  // }
  postId: string
  createdAt: string
}

export type ArrangedCommentsViewModel = ArrangedViewModel<CommentViewModel>
