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
import { old_createPostBodyValidator } from '../common'
import { old_updatePostBodyValidator } from '../common'
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

    const errorsBody = old_createPostBodyValidator(body)

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

    const errorsParams = await findPostParamsValidator(params)

    if (errorsParams.errorsMessages.length) {
      res.status(404).json(errorsParams)
      return
    }

    const errorsBody = old_updatePostBodyValidator(body)

    const errorsBlogId = await findBlogIdValidator(body.blogId)

    const errors = {
      errorsMessages: [...errorsBody.errorsMessages, ...errorsBlogId.errorsMessages],
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
    const params = req.params
    const id = params.id

    const errorsParams = await findPostParamsValidator(params)

    if (errorsParams.errorsMessages.length) {
      res.status(404).json(errorsParams)
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
