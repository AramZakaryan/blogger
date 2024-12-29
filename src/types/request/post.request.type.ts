import { Request } from 'express'
import {
  CreatePostBody,
  CreatePostByBlogBody,
  CreatePostByBlogParams,
  DeletePostParams,
  FindPostParams,
  UpdatePostBody,
  UpdatePostParams,
} from '../dto'

export type GetPostsRequest = Request

export type FindPostRequest = Request<FindPostParams>

export type CreatePostRequest = Request<{}, any, CreatePostBody>

export type CreatePostByBlogRequest = Request<CreatePostByBlogParams, any, CreatePostByBlogBody>

export type UpdatePostRequest = Request<UpdatePostParams, any, UpdatePostBody>

export type DeletePostRequest = Request<DeletePostParams>
