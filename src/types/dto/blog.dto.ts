import { BlogDbType, BlogViewModel } from '../blog.type'
import { WithId } from 'mongodb'
import { ArrangementQuery } from '../general'
import { PostDbType } from '../post.type'
import { GetArrangedPostsQuery } from './post.dto'

export type GetArrangedBlogsQuery = ArrangementQuery<BlogViewModel> & { searchNameTerm?: string }

export type CreateBlogBody = Omit<WithId<BlogDbType>, '_id' | 'isMembership' | 'createdAt'>

export type GetArrangedPostsOfBlogQuery = GetArrangedPostsQuery

export type CreatePostOfBlogParams = { id: string }

export type CreatePostOfBlogBody = Omit<
  WithId<PostDbType>,
  '_id' | 'blogName' | 'blogId' | 'createdAt'
>

export type FindBlogParams = { id: string }

export type UpdateBlogParams = FindBlogParams

export type UpdateBlogBody = CreateBlogBody

export type DeleteBlogParams = FindBlogParams
