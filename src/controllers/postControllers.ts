import { postRepository } from '../repositories'
import {
  CreatePostRequest,
  CreatePostResponse,
  DeletePostRequest,
  DeletePostResponse,
  FindPostRequest,
  FindPostResponse,
  GetPostsRequest,
  GetPostsResponse,
  UpdatePostRequest,
  UpdatePostResponse,
} from '../types'
import { postMap } from '../common'
import { HTTP_STATUS_CODES } from '../common/httpStatusCodes'

export const postControllers = {
  getPosts: async (req: GetPostsRequest, res: GetPostsResponse) => {
    const posts = await postRepository.getPosts()

    if (posts) {
      res.json(posts.map(postMap))
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

  createPost: async (req: CreatePostRequest, res: CreatePostResponse) => {
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

  updatePost: async (req: UpdatePostRequest, res: UpdatePostResponse) => {
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

  deletePost: async (req: DeletePostRequest, res: DeletePostResponse) => {
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
