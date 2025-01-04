import { postRepository } from '../repositories'
import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
  FindPostRequest,
  FindPostResponse,
  GetArrangedPostsRequest,
  GetArrangedPostsResponse,
  UpdatePostRequest,
  UpdatePostResponse,
} from '../types'
import { handleResponseError, HTTP_STATUS_CODES } from '../common'
import { postQueryRepository } from '../queryRepositories'
import { postService } from '../services'

export const postControllers = {
  getArrangedPosts: async (
    req: GetArrangedPostsRequest,
    res: GetArrangedPostsResponse,
  ): Promise<void> => {
    const { query } = req

    const posts = await postService.getArrangedPosts(query)
    if (posts) {
      res.json(posts)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  findPost: async (req: FindPostRequest, res: FindPostResponse): Promise<void> => {
    const { id } = req.params

    const post = await postQueryRepository.findPost(id)

    if (post) {
      res.json(post)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  createPost: async (req: CreatePostRequest, res: CreatePostResponse): Promise<void> => {
    const { body } = req

    const post = await postService.createPost(body)

    if (post) {
      res.status(HTTP_STATUS_CODES.CREATED_201).json(post)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  updatePost: async (req: UpdatePostRequest, res: UpdatePostResponse): Promise<void> => {
    const { id } = req.params
    const { body } = req

    const post = await postRepository.updatePost(id, body)

    if (post) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  deletePost: async (req: DeletePostRequest, res: DeletePostResponse): Promise<void> => {
    const { id } = req.params

    const post = await postRepository.deletePost(id)

    if (post) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },
}
