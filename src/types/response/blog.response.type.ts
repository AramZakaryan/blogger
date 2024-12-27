import { Response } from 'express'
import { BlogDbType, BlogType } from '../blog.type'
import { OutputErrorsType } from '../general'

export type GetBlogsResponse = Response<BlogType[] | OutputErrorsType>

export type FindBlogResponse = Response<BlogType | OutputErrorsType>

export type CreateBlogResponse = Response<BlogType | OutputErrorsType>

export type UpdateBlogResponse = Response<void | OutputErrorsType>

export type DeleteBlogResponse = Response<void | OutputErrorsType>
