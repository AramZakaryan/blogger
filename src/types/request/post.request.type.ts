import { Request } from 'express'
import {
  CreateCommentOfPostParams, CreateCommentOfPostBody,
  CreatePostBody, CreatePostOfBlogParams, CreatePostOfBlogBody,
  DeletePostParams,
  FindPostParams,
  GetArrangedCommentsOfPostQuery,
  GetArrangedPostsQuery,
  UpdatePostBody,
  UpdatePostParams,
} from '../dto'

export type GetArrangedCommentOfPostRequest = Request<
  FindPostParams,
  any,
  {},
  GetArrangedCommentsOfPostQuery
>

export type CreateCommentOfPostRequest = Request<CreateCommentOfPostParams, any, CreateCommentOfPostBody>

export type GetArrangedPostsRequest = Request<{}, any, {}, GetArrangedPostsQuery>

export type CreatePostRequest = Request<{}, any, CreatePostBody>

export type FindPostRequest = Request<FindPostParams>

export type UpdatePostRequest = Request<UpdatePostParams, any, UpdatePostBody>

export type DeletePostRequest = Request<DeletePostParams>
