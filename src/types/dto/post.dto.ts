import { GetArrangedCommentsQuery } from './comment.dto'
import { CreatePostOfBlogBody } from './blog.dto'
import { ArrangementQuery } from '../general'
import { PostDbType, PostViewModel } from '../post.type'
import { CommentDbType } from '../comment.type'
import { WithId } from 'mongodb'

export type GetArrangedCommentsOfPostQuery = GetArrangedCommentsQuery

export type CreateCommentOfPostParams = { id: string }

export type CreateCommentOfPostBody = Omit<
  CommentDbType,
  'commentatorInfo' | 'postId' | 'createdAt'
> & {
  commentatorInfo: {
    userId: string
    userLogin: string
  }
}

export type GetArrangedPostsQuery = ArrangementQuery<PostViewModel>

export type CreatePostBody = CreatePostOfBlogBody & {
  blogId: string
}

export type FindPostParams = { id: string }

export type UpdatePostParams = FindPostParams

export type UpdatePostBody = CreatePostBody

export type DeletePostParams = FindPostParams
