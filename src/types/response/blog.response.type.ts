import { Response } from 'express'
import { ArrangedBlogsViewModel, BlogViewModel } from '../blog.type'
import { OutputErrorsType } from '../general'
import { GetArrangedPostsResponse } from './post.response.type'

export type GetArrangedBlogsResponse = Response<ArrangedBlogsViewModel | OutputErrorsType>

export type GetArrangedPostsByBlogResponse = GetArrangedPostsResponse

export type FindBlogResponse = Response<BlogViewModel | OutputErrorsType>

export type CreateBlogResponse = Response<BlogViewModel | OutputErrorsType>

export type UpdateBlogResponse = Response<void | OutputErrorsType>

export type DeleteBlogResponse = Response<void | OutputErrorsType>
