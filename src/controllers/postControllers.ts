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
import {
  handleCustomError,
  handleResponseError,
  handleResponseNotFoundError,
  HTTP_STATUS_CODES,
} from '../common'
import { postQueryRepository } from '../queryRepositories'
import { postService } from '../services'
import { postQueryService } from '../queryServices/postQueryService'

export const postControllers = {
  getArrangedPosts: async (
    req: GetArrangedPostsRequest,
    res: GetArrangedPostsResponse,
  ): Promise<void> => {
    const { query } = req

    const posts = await postQueryService.getArrangedPosts(query)
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
      handleResponseNotFoundError(res, 'NOT_FOUND_404', 'post')
    }
  },

  createPost: async (req: CreatePostRequest, res: CreatePostResponse): Promise<void> => {
    const { body } = req

    const createdPosId = await postService.createPost(body)

    try {
      if (createdPosId) {
        const createdPost = await postQueryRepository.findPost(createdPosId)
        if (createdPost) {
          res.status(HTTP_STATUS_CODES.CREATED_201).json(createdPost)
        } else {
          handleResponseError(res, 'BAD_REQUEST_400')
        }
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },

  updatePost: async (req: UpdatePostRequest, res: UpdatePostResponse): Promise<void> => {
    const { id } = req.params
    const { body } = req

    try {
      const updatedPostId = await postService.updatePost(id, body)

      if (updatedPostId) {
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },

  deletePost: async (req: DeletePostRequest, res: DeletePostResponse): Promise<void> => {
    const { id } = req.params

    try {
      const deletedPostId = await postService.deletePost(id)

      if (deletedPostId) {
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },
}
