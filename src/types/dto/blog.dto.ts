import { BlogType, BlogViewModel } from '../blog.type'
import { WithId } from 'mongodb'
import { ArrangementQuery } from '../general'
import { GetArrangedPostsQuery } from './post.dto'

export type GetArrangedBlogsQuery = ArrangementQuery<BlogViewModel> & { searchNameTerm?: string }

export type FindBlogParams = { id: string }

export type GetArrangedPostsByBlogQuery = GetArrangedPostsQuery

export type CreateBlogBody = Omit<WithId<BlogType>, '_id' | 'isMembership' | 'createdAt'>

export type UpdateBlogParams = FindBlogParams

export type UpdateBlogBody = CreateBlogBody

export type DeleteBlogParams = FindBlogParams
