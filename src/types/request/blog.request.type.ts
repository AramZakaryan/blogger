import { Request } from 'express'
import {
  CreateBlogBody,
  DeleteBlogParams,
  FindBlogParams,
  UpdateBlogBody,
  UpdateBlogParams,
} from '../dto'

export type GetAllBlogsRequest = Request

export type GetArrangedPostsByBlogRequest = Request<FindBlogParams>

export type FindBlogRequest = Request<FindBlogParams>

export type CreateBlogRequest = Request<{}, any, CreateBlogBody>

export type UpdateBlogRequest = Request<UpdateBlogParams, any, UpdateBlogBody>

export type DeleteBlogRequest = Request<DeleteBlogParams>
