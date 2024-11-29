import { blogService } from '../services'
import {
  BlogDto,
  BlogType,
  CreateBlogRequest,
  CreateBlogResponse,
  FindBlogRequest,
  FindBlogResponse,
  GetBlogsRequest,
  GetBlogsResponse,
  OutputErrorsType,
} from '../types'
import { blogRequestValidator } from '../common'

export const blogControllers = {
  getBlogs: async (req: GetBlogsRequest, res: GetBlogsResponse) => {
    const blogs = await blogService.getBlogs()

    res.json(blogs)
  },

  findBlog: async (req: FindBlogRequest, res: FindBlogResponse) => {
    const id = req.params.id

    const blog = await blogService.findBlog(id)

    res.json(blog)
  },

  createBlog: async (req: CreateBlogRequest, res: CreateBlogResponse) => {
    const errors = blogRequestValidator(req.body)
    if (errors.errorsMessages.length) {
      res.status(400).json(errors)
      return
    }

    const body = req.body

    const blog = await blogService.createBlog(body)

    res.status(201).json(blog)
  },

  // updateBlog: async (req: Request, res: Response) => {
  //   const id = req.params.id
  //   res.json(`this is blogControllers.update, id is ${id}`)
  // },
  // deleteBlog: async (req: Request, res: Response) => {
  //   const id = req.params.id
  //   res.json(`this is blogControllers.deleteBlog, id is ${id}`)
  // },
}
