import { BlogType } from '../blog.type'
import { WithId } from 'mongodb'
import { PostType, PostViewModel } from '../post.type'

export type FindBlogParams = { id: string }

export type GetArrangedPostsByBlogQuery = {
  pageNumber?: number
  pageSize?: number
  sortBy?: keyof PostViewModel
  sortDirection?: 'asc' | 'desc'
}

export type CreateBlogBody = Omit<WithId<BlogType>, '_id' | 'isMembership'>

export type UpdateBlogParams = FindBlogParams

export type UpdateBlogBody = CreateBlogBody

export type DeleteBlogParams = FindBlogParams
