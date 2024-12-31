import { BlogType, BlogViewModel } from '../blog.type'
import { WithId } from 'mongodb'
import { ArrangementQuery } from '../general'

export type GetArrangedBlogsQuery = ArrangementQuery<BlogViewModel> & { searchNameTerm?: string }

export type FindBlogParams = { id: string }

export type GetArrangedPostsByBlogQuery = ArrangementQuery<BlogViewModel>

export type CreateBlogBody = Omit<WithId<BlogType>, '_id' | 'isMembership' | 'createdAt'>

export type UpdateBlogParams = FindBlogParams

export type UpdateBlogBody = CreateBlogBody

export type DeleteBlogParams = FindBlogParams
