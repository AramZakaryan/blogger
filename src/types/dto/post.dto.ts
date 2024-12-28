import { PostType } from '../postType'
import { WithId } from 'mongodb'

export type FindPostParams = { id: string }

export type CreatePostBody = Omit<WithId<PostType>, '_id' | 'blogName' | 'blogId'> & { blogId: string }

export type UpdatePostParams = FindPostParams

export type UpdatePostBody = CreatePostBody

export type DeletePostParams = FindPostParams
