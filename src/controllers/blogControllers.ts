import { blogRepository } from '../repositories'
import {
  CreateBlogRequest,
  CreateBlogResponse,
  DeleteBlogRequest,
  DeleteBlogResponse,
  FindBlogRequest,
  FindBlogResponse,
  GetBlogsRequest,
  GetBlogsResponse,
  UpdateBlogRequest,
  UpdateBlogResponse,
} from '../types'
import { blogMap } from '../common'

export const blogControllers = {
  getBlogs: async (req: GetBlogsRequest, res: GetBlogsResponse): Promise<void> => {
    const blogs = await blogRepository.getBlogs()

    if (blogs) {
      res.json(blogs.map(blogMap))
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

  findBlog: async (req: FindBlogRequest, res: FindBlogResponse): Promise<void> => {
    const params = req.params
    const id = params.id

    const blog = await blogRepository.findBlog(id)

    if (blog) {
      res.json(blogMap(blog))
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

  createBlog: async (req: CreateBlogRequest, res: CreateBlogResponse): Promise<void> => {
    const body = req.body

    const createdBlog = await blogRepository.createBlog(body)

    if (createdBlog) {
      res.status(201).json(blogMap(createdBlog))
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

  updateBlog: async (req: UpdateBlogRequest, res: UpdateBlogResponse): Promise<void> => {
    const params = req.params
    const id = params.id
    const body = req.body

    const updatedBlog = await blogRepository.updateBlog(id, body)

    if (updatedBlog) {
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

  deleteBlog: async (req: DeleteBlogRequest, res: DeleteBlogResponse): Promise<void> => {
    const params = req.params
    const id = params.id

    const deletedBlog = await blogRepository.deleteBlog(id)

    if (deletedBlog) {
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
