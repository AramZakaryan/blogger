import { PostDbType, PostViewModel } from '../postDbType'
import { WithId } from 'mongodb'
import { ArrangementQuery } from '../general'

export type GetArrangedPostsQuery = ArrangementQuery<PostViewModel>

export type FindPostParams = { id: string }

export type CreatePostBody = CreatePostOfBlogBody & { blogId: string }

export type CreatePostOfBlogBody = Omit<
  WithId<PostDbType>,
  '_id' | 'blogName' | 'blogId' | 'createdAt'
>

export type CreatePostByBlogParams = { id: string }

export type UpdatePostParams = FindPostParams

export type UpdatePostBody = CreatePostBody

export type DeletePostParams = FindPostParams
