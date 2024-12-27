import { Response } from 'express'
import { BlogDbType } from '../blog.type'
import { OutputErrorsType } from '../general'

export type GetBlogsResponse = Response<BlogDbType[] | OutputErrorsType>

export type FindBlogResponse = Response<BlogDbType | OutputErrorsType>

export type CreateBlogResponse = Response<BlogDbType | OutputErrorsType>

export type UpdateBlogResponse = Response<void | OutputErrorsType>

export type DeleteBlogResponse = Response<void | OutputErrorsType>
