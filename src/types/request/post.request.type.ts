import { Request } from 'express'
import { CreatePostBody, FindPostParams, UpdatePostParams } from '../dto'

export type GetPostsRequest = Request

export type FindPostRequest = Request<FindPostParams>

export type CreatePostRequest = Request<void, any, CreatePostBody>

export type UpdatePostRequest = Request<UpdatePostParams, any, CreatePostBody>
