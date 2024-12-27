import { PostDbType } from '../post.type'

export type FindPostParams = { id: string }

export type CreatePostBody = Omit<PostDbType, '_id' | 'blogName' | 'blogId'> & { blogId: string }

export type UpdatePostParams = FindPostParams

export type UpdatePostBody = CreatePostBody

export type DeletePostParams = FindPostParams
