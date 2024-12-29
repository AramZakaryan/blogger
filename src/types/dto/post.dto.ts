import { PostType } from '../post.type'
import { WithId } from 'mongodb'

export type FindPostParams = { id: string }

export type CreatePostBody = CreatePostByBlogBody & { blogId: string }

export type CreatePostByBlogBody = Omit<WithId<PostType>, '_id' | 'blogName' | 'blogId'>

export type CreatePostByBlogParams = { id: string }

export type UpdatePostParams = FindPostParams

export type UpdatePostBody = CreatePostBody

export type DeletePostParams = FindPostParams
