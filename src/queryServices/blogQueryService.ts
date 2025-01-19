import {
  ArrangedBlogsViewModel,
  ArrangedPostsViewModel,
  GetArrangedBlogsQuery,
  GetArrangedPostsByBlogQuery,
  PostViewModel,
} from '../types'
import { blogQueryRepository, postQueryRepository } from '../queryRepositories'
import { STATUS_CODES } from 'node:http'
import { HTTP_STATUS_CODES } from '../common'

export const blogQueryService = {
  getArrangedBlogs: async (
    query: GetArrangedBlogsQuery,
  ): Promise<ArrangedBlogsViewModel | null> => {
    const queryNormalized: Required<GetArrangedBlogsQuery> = {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
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
    blogId: PostViewModel['blogId'],
  ): Promise<ArrangedPostsViewModel | null> => {
    // check if blog exists
    const blog = await blogQueryRepository.findBlog(blogId)
    if (!blog) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
          errorsMessages: [
            {
              message: 'blog with provided id does not exist',
              field: 'params',
            },
          ],
        }),
      )
    }

    const queryNormalized: Required<GetArrangedPostsByBlogQuery> = {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
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
}
