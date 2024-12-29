import { Response } from 'express'
import { BlogViewModel } from '../blog.type'
import { OutputErrorsType } from '../general'
import { PostViewModel } from '../post.type'

export type GetBlogsResponse = Response<BlogViewModel[] | OutputErrorsType>

export type GetArrangedPostsByBlogResponse = Response<PostViewModel[] | OutputErrorsType>

export type FindBlogResponse = Response<BlogViewModel | OutputErrorsType>

export type CreateBlogResponse = Response<BlogViewModel | OutputErrorsType>

export type UpdateBlogResponse = Response<void | OutputErrorsType>

export type DeleteBlogResponse = Response<void | OutputErrorsType>
