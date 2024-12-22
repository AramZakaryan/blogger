import { blogService, postService } from '../services'
import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
  FindPostRequest,
  FindPostResponse,
  GetPostsRequest,
  GetPostsResponse,
  OutputErrorsType,
  UpdatePostRequest,
  UpdatePostResponse,
} from '../types'
import { createPostBodyValidator } from '../common'
import { updatePostRequestValidator } from '../common'
import { findBlogParamsValidator } from '../common/validators/findBlogParamsValidator'
import { findPostParamsValidator } from '../common/validators/findPostParamsValidator'
import { findBlogIdValidator } from '../common/validators/findBlogIdValidator'

export const postControllers = {
  getPosts: async (req: GetPostsRequest, res: GetPostsResponse) => {
    const posts = await postService.getPosts()
    res.json(posts)
  },

  findPost: async (req: FindPostRequest, res: FindPostResponse): Promise<void> => {
    const params = req.params
    const id = params.id
    const errorsParams = await findPostParamsValidator(params)

    if (errorsParams.errorsMessages.length) {
      res.status(404).json(errorsParams)
      return
    }

    const post = await postService.findPost(id)

    res.json(post)
  },

  createPost: async (req: CreatePostRequest, res: CreatePostResponse) => {
    const body = req.body

    const errorsBody = createPostBodyValidator(body)

    const errorsBlogId = await findBlogIdValidator(body.blogId)

    const errors = {
      errorsMessages: [...errorsBody.errorsMessages, ...errorsBlogId.errorsMessages],
    }

    if (errors.errorsMessages.length) {
      res.status(400).json(errors)
      return
    }

    const createdPost = await postService.createPost(body)

    res.status(201).json(createdPost)
  },

  updatePost: async (req: UpdatePostRequest, res: UpdatePostResponse) => {
    const params = req.params
    const id = params.id
    const body = req.body

    const errors = updatePostRequestValidator(params, body)

    // check if a post with the provided id (received as a parameter) exists
    const postId = await postService.findPost(id)
    if (!postId) {
      errors.errorsMessages.push({
        message: `post with provided id does not exist`,
        field: 'params',
      })
    }

    // check if a blog with the provided id (received as a parameter) exists
    if (body.blogId) {
      const blog = await blogService.findBlog(body.blogId)
      if (!blog) {
        errors.errorsMessages.push({
          message: `blog with provided id does not exist`,
          field: 'blogId',
        })
      }
    }

    if (errors.errorsMessages.length) {
      res.status(400).json(errors)
      return
    }

    const updatedPost = await postService.updatePost(id, body)

    if (updatedPost) {
      res.sendStatus(204)
    } else {
      res.status(400).json({
        errorsMessages: [
          {
            message: 'something went wrong',
            field: 'unknown',
          },
        ],
      })
    }
  },

  deletePost: async (req: DeletePostRequest, res: DeletePostResponse) => {
    const id = req.params.id

    /** object for accumulating errors */
    const errors: OutputErrorsType = {
      errorsMessages: [],
    }

    // check if a post with the provided id (received as a parameter) exists
    const post = await postService.findPost(id)
    if (!post) {
      errors.errorsMessages.push({
        message: `post with provided id does not exist`,
        field: 'params',
      })
    }

    if (errors.errorsMessages.length) {
      res.status(400).json(errors)
      return
    }

    const deletedPost = await postService.deletePost(id)

    if (deletedPost) {
      res.sendStatus(204)
    } else {
      res.status(400).json({
        errorsMessages: [
          {
            message: 'something went wrong',
            field: 'unknown',
          },
        ],
      })
    }
  },
}
