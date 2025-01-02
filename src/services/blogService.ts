import { blogRepository } from '../repositories'
import {
  ArrangedBlogsViewModel,
  ArrangedPostsViewModel,
  BlogType,
  BlogViewModel,
  CreateBlogBody,
  CreatePostBody,
  CreatePostOfBlogBody,
  GetArrangedBlogsQuery,
  GetArrangedPostsByBlogQuery,
  PostViewModel,
} from '../types'
import { blogQueryRepository, postQueryRepository } from '../queryRepositories'
import { postService } from './postService'

export const blogService = {
  getArrangedBlogs: async (
    query: GetArrangedBlogsQuery,
  ): Promise<ArrangedBlogsViewModel | null> => {
    const queryNormalized: Required<GetArrangedBlogsQuery> = {
      pageNumber: query.pageNumber || 1,
      pageSize: query.pageSize || 10,
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
      searchNameTerm: query.searchNameTerm || '',
    }

    try {
      let blogs = await blogQueryRepository.getArrangedBlogs(queryNormalized)

      blogs ??= []

      let blogsCount = await blogQueryRepository.getBlogsCount(queryNormalized.searchNameTerm)

      blogsCount ??= 0

      const pagesCount = Math.ceil(blogsCount / queryNormalized.pageSize)

      return {
        pagesCount,
        page: queryNormalized.pageNumber,
        pageSize: queryNormalized.pageSize,
        totalCount: blogsCount,
        items: blogs,
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  getArrangedPostsOfBlog: async (
    query: GetArrangedPostsByBlogQuery,
    blogId: string,
  ): Promise<ArrangedPostsViewModel | null> => {
    const queryNormalized: Required<GetArrangedPostsByBlogQuery> = {
      pageNumber: query.pageNumber || 1,
      pageSize: query.pageSize || 10,
      sortBy: query.sortBy || 'createdAt',
      sortDirection: query.sortDirection || 'desc',
    }

    try {
      let posts = await postQueryRepository.getArrangedPosts(queryNormalized, blogId)

      posts ??= []

      let postsCount = await postQueryRepository.getPostsCount(blogId)

      postsCount ??= 0

      const pagesCount = Math.ceil(postsCount / queryNormalized.pageSize)

      return {
        pagesCount,
        page: queryNormalized.pageNumber,
        pageSize: queryNormalized.pageSize,
        totalCount: postsCount,
        items: posts,
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  createBlog: async (body: CreateBlogBody): Promise<BlogViewModel | null> => {
    try {
      const blog: BlogType = {
        ...body,
        createdAt: new Date(),
        isMembership: false,
      }

      const id = await blogRepository.createBlog(blog)

      if (!id) return null

      return await blogQueryRepository.findBlog(id)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  createPostOfBlog: async (
    blogId: string,
    body: CreatePostOfBlogBody,
  ): Promise<PostViewModel | null> => {
    const updatedBody: CreatePostBody = { ...body, blogId }

    return await postService.createPost(updatedBody)
  },
}
