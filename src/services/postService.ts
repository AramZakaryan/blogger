import { postRepository } from '../repositories'
import {
  ArrangedPostsViewModel,
  CommentViewModel,
  CreateCommentBody,
  CreateCommentOfPostBody,
  CreatePostBody,
  CreatePostOfBlogBody,
  GetArrangedPostsQuery,
  PostViewModel,
  UpdatePostBody, UserViewForMeModel,
} from '../types'
import { blogQueryRepository, postQueryRepository } from '../queryRepositories'
import { HTTP_STATUS_CODES, toObjectId } from '../common'
import { ObjectId } from 'mongodb'
import { commentService } from './commentService'

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

  createCommentOfPost: async (
    postId: string,
    body: CreateCommentOfPostBody,
    user: UserViewForMeModel,
  ): Promise<PostViewModel['id'] | null> => {
    // check if post exists
    const post = await postQueryRepository.findPost(postId)
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

    const extendedBody: CreateCommentBody = { ...body, postId }

    return await commentService.createComment(extendedBody, user)
  },

  updatePost: async (
    id: PostViewModel['id'],
    body: UpdatePostBody,
  ): Promise<PostViewModel['id'] | null> => {
    // check if post exists (params)
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
