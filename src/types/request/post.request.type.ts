import { Request } from 'express'
import { PostDto } from '../dto/post.dto'

export type GetPostsRequest = Request

export type FindPostRequest = Request<{ id: string }>

export type CreatePostRequest = Request<void, any, PostDto>
