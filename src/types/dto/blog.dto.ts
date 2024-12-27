import { BlogDbType } from '../blog.type'

export type FindBlogParams = { id: string }

export type CreateBlogBody = Omit<BlogDbType, '_id'>

export type UpdateBlogParams = FindBlogParams

export type UpdateBlogBody = CreateBlogBody

export type DeleteBlogParams = FindBlogParams
