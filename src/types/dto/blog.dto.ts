import { BlogDbType, BlogViewModel } from '../blog.type'
import { ArrangementQuery } from '../general'
import { PostDbType } from '../post.type'
import { GetArrangedPostsQuery } from './post.dto'

export type GetArrangedBlogsQuery = ArrangementQuery<BlogViewModel> & { searchNameTerm?: string }

export type CreateBlogBody = Omit<BlogDbType, 'isMembership' | 'createdAt'>

export type GetArrangedPostsOfBlogQuery = GetArrangedPostsQuery

export type CreatePostOfBlogParams = { id: string }

export type CreatePostOfBlogBody = Omit<PostDbType, 'blogName' | 'blogId' | 'createdAt'>

export type FindBlogParams = { id: string }

export type UpdateBlogParams = FindBlogParams

export type UpdateBlogBody = CreateBlogBody

export type DeleteBlogParams = FindBlogParams
