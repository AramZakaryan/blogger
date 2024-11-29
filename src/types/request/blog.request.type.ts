import { Request } from 'express'
import { BlogDto } from '../dto/blog.dto'

export type GetBlogsRequest = Request

export type FindBlogRequest = Request<{ id: string }>

export type CreateBlogRequest = Request<void, any, BlogDto>
