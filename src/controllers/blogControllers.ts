import { blogRepository } from '../repositories'
import {
  CreateBlogRequest,
  CreateBlogResponse,
  CreatePostByBlogRequest,
  CreatePostByBlogResponse,
  DeleteBlogRequest,
  DeleteBlogResponse,
  FindBlogRequest,
  FindBlogResponse,
  GetArrangedBlogsRequest,
  GetArrangedBlogsResponse,
  GetArrangedPostsByBlogRequest,
  GetArrangedPostsByBlogResponse,
  UpdateBlogRequest,
  UpdateBlogResponse,
} from '../types'
import { blogMap, HTTP_STATUS_CODES, postMap } from '../common'
import { blogServices } from '../services'

export const blogControllers = {
  getArrangedBlogs: async (
    req: GetArrangedBlogsRequest,
    res: GetArrangedBlogsResponse,
  ): Promise<void> => {
    const query = req.query

    const blogs = await blogRepository.getArrangedBlogs(query)

    if (blogs) {
      res.json(blogs)
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

  findBlog: async (req: FindBlogRequest, res: FindBlogResponse): Promise<void> => {
    const params = req.params
    const id = params.id

    const blog = await blogRepository.findBlog(id)

    if (blog) {
      res.json(blogMap(blog))
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

  getArrangedPostsOfBlog: async (
    req: GetArrangedPostsByBlogRequest,
    res: GetArrangedPostsByBlogResponse,
  ): Promise<void> => {
    const params = req.params
    const id = params.id
    const query = req.query

    const posts = await blogRepository.getArrangedPostsOfBlog(id, query)

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

  createBlog: async (req: CreateBlogRequest, res: CreateBlogResponse): Promise<void> => {
    const body = req.body

    const createdBlog = await blogRepository.createBlog(body)

    if (createdBlog) {
      res.status(HTTP_STATUS_CODES.CREATED_201).json(blogMap(createdBlog))
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

  createPostOfBlog: async (
    req: CreatePostByBlogRequest,
    res: CreatePostByBlogResponse,
  ): Promise<void> => {
    const params = req.params
    const blogId = params.id
    const body = req.body

    const createdPost = await blogServices.createPostOfBlog(blogId, body)

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

  updateBlog: async (req: UpdateBlogRequest, res: UpdateBlogResponse): Promise<void> => {
    const params = req.params
    const id = params.id
    const body = req.body

    const updatedBlog = await blogRepository.updateBlog(id, body)

    if (updatedBlog) {
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

  deleteBlog: async (req: DeleteBlogRequest, res: DeleteBlogResponse): Promise<void> => {
    const params = req.params
    const id = params.id

    const deletedBlog = await blogRepository.deleteBlog(id)

    if (deletedBlog) {
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
