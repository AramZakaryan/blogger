import { Request } from 'express'
import { CreateBlogBody, FindBlogParams, UpdateBlogBody, UpdateBlogParams } from '../dto'

export type GetBlogsRequest = Request

export type FindBlogRequest = Request<FindBlogParams>

export type CreateBlogRequest = Request<void, any, CreateBlogBody>

export type UpdateBlogRequest = Request<UpdateBlogParams, any, UpdateBlogBody>
