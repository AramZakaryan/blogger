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
import { handleResponseError, HTTP_STATUS_CODES } from '../common'
import { blogService } from '../services'
import { blogRepository } from '../repositories'
import { blogQueryRepository } from '../queryRepositories'

export const blogControllers = {
  getArrangedBlogs: async (
    req: GetArrangedBlogsRequest,
    res: GetArrangedBlogsResponse,
  ): Promise<void> => {
    const { query } = req

    const blogs = await blogService.getArrangedBlogs(query)

    if (blogs) {
      res.json(blogs)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  findBlog: async (req: FindBlogRequest, res: FindBlogResponse): Promise<void> => {
    const { id } = req.params

    const blog = await blogQueryRepository.findBlog(id)

    if (blog) {
      res.json(blog)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  getArrangedPostsOfBlog: async (
    req: GetArrangedPostsByBlogRequest,
    res: GetArrangedPostsByBlogResponse,
  ): Promise<void> => {
    const { query } = req
    const { id } = req.params

    const posts = await blogService.getArrangedPostsOfBlog(query, id)

    if (posts) {
      res.json(posts)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  createBlog: async (req: CreateBlogRequest, res: CreateBlogResponse): Promise<void> => {
    const { body } = req

    const createdBlog = await blogService.createBlog(body)

    if (createdBlog) {
      res.status(HTTP_STATUS_CODES.CREATED_201).json(createdBlog)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  createPostOfBlog: async (
    req: CreatePostByBlogRequest,
    res: CreatePostByBlogResponse,
  ): Promise<void> => {
    const { id } = req.params
    const { body } = req

    const createdPost = await blogService.createPostOfBlog(id, body)

    if (createdPost) {
      res.status(HTTP_STATUS_CODES.CREATED_201).json(createdPost)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  updateBlog: async (req: UpdateBlogRequest, res: UpdateBlogResponse): Promise<void> => {
    const { id } = req.params
    const { body } = req

    const blog = await blogRepository.updateBlog(id, body)

    if (blog) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  deleteBlog: async (req: DeleteBlogRequest, res: DeleteBlogResponse): Promise<void> => {
    const { id } = req.params

    const blog = await blogRepository.deleteBlog(id)

    if (blog) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },
}
