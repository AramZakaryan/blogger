import { PostType, PostViewModel } from '../post.type'
import { WithId } from 'mongodb'
import { ArrangementQuery } from '../general'

export type GetArrangedPostsQuery = ArrangementQuery<PostViewModel>

export type FindPostParams = { id: string }

export type CreatePostBody = CreatePostByBlogBody & { blogId: string }

export type CreatePostByBlogBody = Omit<
  WithId<PostType>,
  '_id' | 'blogName' | 'blogId' | 'createdAt'
>

export type CreatePostByBlogParams = { id: string }

export type UpdatePostParams = FindPostParams

export type UpdatePostBody = CreatePostBody

export type DeletePostParams = FindPostParams
