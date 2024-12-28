import { Response } from 'express'
import { BlogViewModel } from '../blog.type'
import { OutputErrorsType } from '../general'

export type GetBlogsResponse = Response<BlogViewModel[] | OutputErrorsType>

export type FindBlogResponse = Response<BlogViewModel | OutputErrorsType>

export type CreateBlogResponse = Response<BlogViewModel | OutputErrorsType>

export type UpdateBlogResponse = Response<void | OutputErrorsType>

export type DeleteBlogResponse = Response<void | OutputErrorsType>
