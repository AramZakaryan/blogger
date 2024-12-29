import { BlogType } from '../blog.type'
import { WithId } from 'mongodb'
import { ArrangementQuery } from '../general'

export type GetArrangedBlogsQuery = ArrangementQuery

export type FindBlogParams = { id: string }

export type GetArrangedPostsByBlogQuery = Omit<ArrangementQuery, 'SearchNameTerm'>

export type CreateBlogBody = Omit<WithId<BlogType>, '_id' | 'isMembership'>

export type UpdateBlogParams = FindBlogParams

export type UpdateBlogBody = CreateBlogBody

export type DeleteBlogParams = FindBlogParams
