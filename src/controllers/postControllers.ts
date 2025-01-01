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
import { HTTP_STATUS_CODES, postMap } from '../common'

export const postControllers = {
  getArrangedPosts: async (
    req: GetArrangedPostsRequest,
    res: GetArrangedPostsResponse,
  ): Promise<void> => {
    const query = req.query

    const posts = await postRepository.getArrangedPosts(query)
    if (posts) {
      res.json(posts)
    } else {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'something went wrong',
            field: 'unknown',
          },
        ],
      })
    }
  },

  findPost: async (req: FindPostRequest, res: FindPostResponse): Promise<void> => {
    const params = req.params
    const id = params.id

    const post = await postRepository.findPost(id)

    if (post) {
      res.json(postMap(post))
    } else {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'something went wrong',
            field: 'unknown',
          },
        ],
      })
    }
  },

  createPost: async (req: CreatePostRequest, res: CreatePostResponse): Promise<void> => {
    const body = req.body

    const createdPost = await postRepository.createPost(body)

    if (createdPost) {
      res.status(HTTP_STATUS_CODES.CREATED_201).json(postMap(createdPost))
    } else {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'something went wrong',
            field: 'unknown',
          },
        ],
      })
    }
  },

  updatePost: async (req: UpdatePostRequest, res: UpdatePostResponse): Promise<void> => {
    const params = req.params
    const id = params.id
    const body = req.body

    const updatedPost = await postRepository.updatePost(id, body)

    if (updatedPost) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    } else {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'something went wrong',
            field: 'unknown',
          },
        ],
      })
    }
  },

  deletePost: async (req: DeletePostRequest, res: DeletePostResponse): Promise<void> => {
    const params = req.params
    const id = params.id

    const deletedPost = await postRepository.deletePost(id)

    if (deletedPost) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    } else {
      res.status(HTTP_STATUS_CODES.BAD_REQUEST_400).json({
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
