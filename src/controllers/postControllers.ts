import { blogService, postService } from '../services'
import {
  CreatePostRequest,
  CreatePostResponse,
  FindPostRequest,
  FindPostResponse,
  GetPostsRequest,
  GetPostsResponse,
} from '../types'
import { postRequestValidator } from '../common/validators/postRequestValidator'

export const postControllers = {
  getPosts: async (req: GetPostsRequest, res: GetPostsResponse) => {
    const posts = await postService.getPosts()
    res.json(posts)
  },

  findPost: async (req: FindPostRequest, res: FindPostResponse) => {
    const id = req.params.id
    const post = await postService.findPost(id)
    res.json(post)
  },

  createPost: async (req: CreatePostRequest, res: CreatePostResponse) => {
    const body = req.body

    const errors = postRequestValidator(body)

    /** checking if the blog with blogId in body exists */
    const blogId = await blogService.findBlog(req.body.blogId)
    if (!blogId) {
      errors.errorsMessages.push({
        message: 'blog with this id does not exist',
        field: 'blogId',
      })
    }

    if (errors.errorsMessages.length) {
      res.status(400).json(errors)
      return
    }

    const post = await postService.createPost(body)

    res.status(201).json(post)
  },
  // updatePost: async (req: Request, res: Response) => {
  //   const id = req.params.id
  //   res.json(`this is postControllers.update, id is ${id}`)
  // },
  // deletePost: async (req: Request, res: Response) => {
  //   const id = req.params.id
  //   res.json(`this is postControllers.deletePost, id is ${id}`)
  // },
}
