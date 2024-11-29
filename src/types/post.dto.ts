import { PostType } from './post.type'

export type PostDto = Omit<PostType, 'id' | 'blogName'>
