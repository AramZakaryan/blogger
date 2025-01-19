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
  UpdateBlogBody,
} from '../types'
import { blogQueryRepository, postQueryRepository } from '../queryRepositories'
import { postService } from './postService'
import { HTTP_STATUS_CODES } from '../common'
import { ObjectId } from 'mongodb'

export const blogService = {
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

    const updatedBody: CreatePostBody = { ...body, blogId }

    return await postService.createPost(updatedBody)
  },

  updateBlog: async (id: string, body: UpdateBlogBody): Promise<ObjectId | null> => {
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

  deleteBlog: async (id: string): Promise<ObjectId | null> => {
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
