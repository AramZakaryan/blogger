import { Request } from 'express'
import {
  CreateBlogBody,
  CreatePostOfBlogParams,
  CreatePostOfBlogBody,
  DeleteBlogParams,
  FindBlogParams,
  GetArrangedBlogsQuery,
  GetArrangedPostsOfBlogQuery,
  UpdateBlogBody,
  UpdateBlogParams,
} from '../dto'

export type GetArrangedBlogsRequest = Request<{}, any, {}, GetArrangedBlogsQuery>

export type CreateBlogRequest = Request<{}, any, CreateBlogBody>

export type GetArrangedPostsOfBlogRequest = Request<
  FindBlogParams,
  any,
  {},
  GetArrangedPostsOfBlogQuery
>

export type CreatePostOfBlogRequest = Request<CreatePostOfBlogParams, any, CreatePostOfBlogBody>

export type FindBlogRequest = Request<FindBlogParams>

export type UpdateBlogRequest = Request<UpdateBlogParams, any, UpdateBlogBody>

export type DeleteBlogRequest = Request<DeleteBlogParams>
