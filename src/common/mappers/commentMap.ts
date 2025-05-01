import { CommentDbType, CommentViewModel, PostDbType, PostViewModel } from '../../types'
import { WithId } from 'mongodb'

export const commentMap = (comment: WithId<CommentDbType>): CommentViewModel => ({
  id: comment._id.toString(),
  content: comment.content,
  // commentatorInfo: {
  //   userId: comment.commentatorInfo.userId.toString(),
  //   userLogin: comment.commentatorInfo.userLogin,
  // },
  postId: comment.postId.toString(),
  createdAt: comment.createdAt.toISOString(),
})
