import { Request } from 'express'
import {
  CreatePostBody,
  CreatePostByBlogBody,
  CreatePostByBlogParams,
  DeletePostParams,
  FindPostParams,
  GetArrangedPostsQuery,
  UpdatePostBody,
  UpdatePostParams,
} from '../dto'

export type GetArrangedPostsRequest = Request<{}, any, {}, GetArrangedPostsQuery>

export type FindPostRequest = Request<FindPostParams>

export type CreatePostRequest = Request<{}, any, CreatePostBody>

export type CreatePostByBlogRequest = Request<CreatePostByBlogParams, any, CreatePostByBlogBody>

export type UpdatePostRequest = Request<UpdatePostParams, any, UpdatePostBody>

export type DeletePostRequest = Request<DeletePostParams>
