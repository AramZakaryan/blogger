import { PostType } from '../post.type'

export type FindPostParams = Pick<PostType, 'id'>

export type CreatePostBody = Omit<PostType, 'id' | 'blogName'>

export type UpdatePostParams = FindPostParams

export type UpdatePostBody = Partial<CreatePostBody>
