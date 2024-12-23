import { postService } from '../services'
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

export const postControllers = {
  getPosts: async (req: GetPostsRequest, res: GetPostsResponse) => {
    const posts = await postService.getPosts()

    if (posts) {
      res.json(posts)
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

  findPost: async (req: FindPostRequest, res: FindPostResponse): Promise<void> => {
    const params = req.params
    const id = params.id

    const post = await postService.findPost(id)

    if (post) {
      res.json(post)
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

  createPost: async (req: CreatePostRequest, res: CreatePostResponse) => {
    const body = req.body

    const createdPost = await postService.createPost(body)

    res.status(201).json(createdPost)
  },

  updatePost: async (req: UpdatePostRequest, res: UpdatePostResponse) => {
    const params = req.params
    const id = params.id
    const body = req.body

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
