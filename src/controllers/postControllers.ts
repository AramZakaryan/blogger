import { blogService, postService } from '../services'
import {
  CreatePostRequest,
  CreatePostResponse,
  FindPostRequest,
  FindPostResponse,
  GetPostsRequest,
  GetPostsResponse,
  UpdatePostRequest,
  UpdatePostResponse,
} from '../types'
import { createPostRequestValidator } from '../common/validators/createPostRequestValidator'
import { updateBlogRequestValidator } from '../common'
import { updatePostRequestValidator } from '../common/validators/updatePostRequestValidator'

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

    const errors = createPostRequestValidator(body)

    // check if there is an error of field body: if yes - don't continue with checking of existence of blogId
    if (errors.errorsMessages.findIndex((error) => error.field === 'body') > -1) {
      res.status(400).json(errors)
      return
    }

    // check if the blog with blogId in body exists
    const blogId = await blogService.findBlog(req.body.blogId)
    if (!blogId) {
      errors.errorsMessages.push({
        message: `blog with provided id does not exist`,
        field: 'blogId',
      })
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

    res.sendStatus(204)
  },

  // deletePost: async (req: Request, res: Response) => {
  //   const id = req.params.id
  //   res.json(`this is postControllers.deletePost, id is ${id}`)
  // },
}
