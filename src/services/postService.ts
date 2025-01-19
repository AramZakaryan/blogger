import { postRepository } from '../repositories'
import {
  ArrangedPostsViewModel,
  CreatePostBody,
  GetArrangedPostsQuery,
  PostViewModel,
  UpdatePostBody,
} from '../types'
import { blogQueryRepository, postQueryRepository } from '../queryRepositories'
import { HTTP_STATUS_CODES, toObjectId } from '../common'
import { ObjectId } from 'mongodb'

export const postService = {
  createPost: async (body: CreatePostBody): Promise<PostViewModel['id'] | null> => {
    try {
      // check if blog exists (body.blogId)
      const blog = await blogQueryRepository.findBlog(body.blogId)
      if (!blog) {
        throw new Error(
          JSON.stringify({
            statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
            errorsMessages: [
              {
                message: 'blog with provided id does not exist',
                field: 'blogId',
              },
            ],
          }),
        )
      }

      return await postRepository.createPost(body, blog.name)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  updatePost: async (id: PostViewModel['id'], body: UpdatePostBody): Promise<PostViewModel['id'] | null> => {
    // check if post exists
    const post = await postQueryRepository.findPost(id)
    if (!post) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
          errorsMessages: [
            {
              message: 'post with provided id does not exist',
              field: 'params',
            },
          ],
        }),
      )
    }

    // check if blog exists (body.blogId)
    const blog = await blogQueryRepository.findBlog(body.blogId)
    if (!blog) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
          errorsMessages: [
            {
              message: 'blog with provided id does not exist',
              field: 'blogId',
            },
          ],
        }),
      )
    }

    const blogName = blog.name

    try {
      return await postRepository.updatePost(id, body, blogName)
    } catch (err) {
      return null
    }
  },
  deletePost: async (id: PostViewModel['id']): Promise<PostViewModel['id'] | null> => {
    // check if post exists
    const post = await postQueryRepository.findPost(id)
    if (!post) {
      throw new Error(
        JSON.stringify({
          statusCode: HTTP_STATUS_CODES.NOT_FOUND_404,
          errorsMessages: [
            {
              message: 'post with provided id does not exist',
              field: 'params',
            },
          ],
        }),
      )
    }

    try {
      return await postRepository.deletePost(id)
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
