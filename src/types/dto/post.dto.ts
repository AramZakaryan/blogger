import { GetArrangedCommentsQuery } from './comment.dto'
import { CreatePostOfBlogBody } from './blog.dto'
import { ArrangementQuery } from '../general'
import { PostViewModel } from '../post.type'

export type GetArrangedCommentsOfPostQuery = GetArrangedCommentsQuery

export type CreateCommentOfPostParams = { id: string }

export type CreateCommentOfPostBody = {
  content: string
}

export type GetArrangedPostsQuery = ArrangementQuery<PostViewModel>

export type CreatePostBody = CreatePostOfBlogBody & {
  blogId: string
}

export type FindPostParams = { id: string }

export type UpdatePostParams = FindPostParams

export type UpdatePostBody = CreatePostBody

export type DeletePostParams = FindPostParams
