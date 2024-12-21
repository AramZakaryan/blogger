import { blogService } from '../services'
import {
  CreateBlogRequest,
  CreateBlogResponse,
  FindBlogRequest,
  FindBlogResponse,
  GetBlogsRequest,
  GetBlogsResponse,
  UpdateBlogRequest,
  UpdateBlogResponse,
} from '../types'
import { createBlogRequestValidator, updateBlogRequestValidator } from '../common'

export const blogControllers = {
  getBlogs: async (req: GetBlogsRequest, res: GetBlogsResponse): Promise<void> => {
    const blogs = await blogService.getBlogs()

    res.json(blogs)
  },

  findBlog: async (req: FindBlogRequest, res: FindBlogResponse): Promise<void> => {
    const id = req.params.id

    const blog = await blogService.findBlog(id)

    res.json(blog)
  },

  createBlog: async (req: CreateBlogRequest, res: CreateBlogResponse): Promise<void> => {
    const errors = createBlogRequestValidator(req.body)
    if (errors.errorsMessages.length) {
      res.status(400).json(errors)
      return
    }

    const body = req.body

    const createdBlog = await blogService.createBlog(body)

    res.status(201).json(createdBlog)
  },

  updateBlog: async (req: UpdateBlogRequest, res: UpdateBlogResponse): Promise<void> => {
    const params = req.params
    const id = params.id
    const body = req.body

    const errors = updateBlogRequestValidator(params, body)

    // check if a blog with the provided id (received as a parameter) exists
    const blog = await blogService.findBlog(id)
    if (!blog) {
      errors.errorsMessages.push({
        message: `blog with provided id does not exist`,
        field: 'params',
      })
    }

    if (errors.errorsMessages.length) {
      res.status(400).json(errors)
      return
    }

    const updatedBlog = await blogService.updateBlog(id, body)

    res.sendStatus(204)
  },

  // deleteBlog: async (req: Request, res: Response) => {
  //   const id = req.params.id
  //   res.json(`this is blogControllers.deleteBlog, id is ${id}`)
  // },
}
