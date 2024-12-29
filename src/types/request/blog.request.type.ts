import { Request } from 'express'
import {
  CreateBlogBody,
  DeleteBlogParams,
  FindBlogParams,
  GetArrangedBlogsQuery,
  GetArrangedPostsByBlogQuery,
  UpdateBlogBody,
  UpdateBlogParams,
} from '../dto'

export type GetArrangedBlogsRequest = Request<{}, any, {}, GetArrangedBlogsQuery>

export type GetArrangedPostsByBlogRequest = Request<
  FindBlogParams,
  any,
  {},
  GetArrangedPostsByBlogQuery
>

export type FindBlogRequest = Request<FindBlogParams>

export type CreateBlogRequest = Request<{}, any, CreateBlogBody>

export type UpdateBlogRequest = Request<UpdateBlogParams, any, UpdateBlogBody>

export type DeleteBlogRequest = Request<DeleteBlogParams>
