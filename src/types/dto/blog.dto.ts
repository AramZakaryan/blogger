import { BlogType } from '../blog.type'

export type FindBlogParams = Pick<BlogType, 'id'>

export type CreateBlogBody = Omit<BlogType, 'id'>

export type UpdateBlogParams = FindBlogParams

export type UpdateBlogBody = Partial<CreateBlogBody>

export type DeleteBlogParams = FindBlogParams
