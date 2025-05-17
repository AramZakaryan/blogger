import { blogRepository } from '../repositories'
import {
  ArrangedBlogsViewModel,
  ArrangedPostsViewModel,
  BlogDbType,
  BlogViewModel,
  CreateBlogBody,
  CreatePostBody,
  CreatePostOfBlogBody,
  GetArrangedBlogsQuery,
  GetArrangedPostsOfBlogQuery,
  PostViewModel,
  UpdateBlogBody,
} from '../types'
import { blogQueryRepository, postQueryRepository } from '../queryRepositories'
import { postService } from './postService'
import { HTTP_STATUS_CODES } from '../common'
import { ObjectId } from 'mongodb'

export const blogService = {
  createBlog: async (body: CreateBlogBody): Promise<BlogViewModel['id'] | null> => {
    try {
      const createdBlogId = await blogRepository.createBlog(body)

      if (!createdBlogId) return null

      return createdBlogId
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  createPostOfBlog: async (
    blogId: PostViewModel['blogId'],
    body: CreatePostOfBlogBody,
  ): Promise<PostViewModel['id'] | null> => {
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

    const extendedBody: CreatePostBody = { ...body, blogId }

    return await postService.createPost(extendedBody)
  },

  updateBlog: async (
    id: BlogViewModel['id'],
    body: UpdateBlogBody,
  ): Promise<BlogViewModel['id'] | null> => {
    // check if blog exists
    const blog = await blogQueryRepository.findBlog(id)
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

    try {
      return await blogRepository.updateBlog(id, body)
    } catch (err) {
      return null
    }
  },

  deleteBlog: async (id: BlogViewModel['id']): Promise<BlogViewModel['id'] | null> => {
    // check if blog exists
    const blog = await blogQueryRepository.findBlog(id)
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

    try {
      return await blogRepository.deleteBlog(id)
    } catch (err) {
      return null
    }
  },
}
