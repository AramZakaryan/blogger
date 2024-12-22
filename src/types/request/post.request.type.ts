import { Request } from 'express'
import {
  CreatePostBody,
  DeletePostParams,
  FindPostParams,
  UpdatePostBody,
  UpdatePostParams,
} from '../dto'

export type GetPostsRequest = Request

export type FindPostRequest = Request<FindPostParams>

export type CreatePostRequest = Request<{}, any, CreatePostBody>

export type UpdatePostRequest = Request<UpdatePostParams, any, UpdatePostBody>

export type DeletePostRequest = Request<DeletePostParams>
