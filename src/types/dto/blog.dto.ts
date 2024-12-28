import { BlogType } from '../blog.type'
import { WithId } from 'mongodb'

export type FindBlogParams = { id: string }

export type CreateBlogBody = Omit<WithId<BlogType>, '_id' | 'isMembership'>

export type UpdateBlogParams = FindBlogParams

export type UpdateBlogBody = CreateBlogBody

export type DeleteBlogParams = FindBlogParams
