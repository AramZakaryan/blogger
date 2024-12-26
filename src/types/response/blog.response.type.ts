import { Response } from 'express'
import { BlogType } from '../blog.type'
import { OutputErrorsType } from '../general'
import { InsertOneResult } from 'mongodb'

export type GetBlogsResponse = Response<BlogType[] | OutputErrorsType>

export type FindBlogResponse = Response<BlogType | OutputErrorsType>

export type CreateBlogResponse = Response<InsertOneResult<BlogType> | OutputErrorsType>

export type UpdateBlogResponse = Response<void | OutputErrorsType>

export type DeleteBlogResponse = Response<void | OutputErrorsType>
