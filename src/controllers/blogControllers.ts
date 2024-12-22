import { blogService } from '../services'
import {
  CreateBlogRequest,
  CreateBlogResponse,
  DeleteBlogRequest,
  DeleteBlogResponse,
  FindBlogRequest,
  FindBlogResponse,
  GetBlogsRequest,
  GetBlogsResponse,
  OutputErrorsType,
  UpdateBlogRequest,
  UpdateBlogResponse,
} from '../types'
import { createBlogBodyValidator, updateBlogBodyValidator } from '../common'
import { findBlogParamsValidator } from '../common/validators/findBlogParamsValidator'

export const blogControllers = {
  getBlogs: async (req: GetBlogsRequest, res: GetBlogsResponse): Promise<void> => {
    const blogs = await blogService.getBlogs()

    res.json(blogs)
  },

  findBlog: async (req: FindBlogRequest, res: FindBlogResponse): Promise<void> => {
    const params = req.params
    const id = params.id

    const errorsParams = await findBlogParamsValidator(params)

    if (errorsParams.errorsMessages.length) {
      res.status(404).json(errorsParams)
      return
    }

    const blog = await blogService.findBlog(id)

    res.json(blog)
  },

  createBlog: async (req: CreateBlogRequest, res: CreateBlogResponse): Promise<void> => {
    const errors = createBlogBodyValidator(req.body)
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

    const errorsParams = await findBlogParamsValidator(params)

    if (errorsParams.errorsMessages.length) {
      res.status(404).json(errorsParams)
      return
    }

    const errorsBody = updateBlogBodyValidator(body)

    if (errorsBody.errorsMessages.length) {
      res.status(400).json(errorsBody)
      return
    }

    const updatedBlog = await blogService.updateBlog(id, body)

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

    const errorsParams = await findBlogParamsValidator(params)

    if (errorsParams.errorsMessages.length) {
      res.status(404).json(errorsParams)
      return
    }

    const deletedBlog = await blogService.deleteBlog(id)

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
