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
import { HTTP_STATUS_CODES } from '../common'
import { blogService } from '../services'
import { blogRepository } from '../repositories'
import { blogQueryRepository } from '../queryRepositories'
import { handleResponseError } from '../common/helpers/handleResponseError'

export const blogControllers = {
  getArrangedBlogs: async (
    req: GetArrangedBlogsRequest,
    res: GetArrangedBlogsResponse,
  ): Promise<void> => {
    const { query } = req

    const blogs = await blogQueryRepository.getArrangedBlogs(query)

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
    const { id } = req.params
    const { query } = req

    const posts = await blogQueryRepository.getArrangedPostsOfBlog(id, query)

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

    const updatedBlog = await blogRepository.updateBlog(id, body)

    if (updatedBlog) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },

  deleteBlog: async (req: DeleteBlogRequest, res: DeleteBlogResponse): Promise<void> => {
    const { id } = req.params

    const deletedBlog = await blogRepository.deleteBlog(id)

    if (deletedBlog) {
      res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
    } else {
      handleResponseError(res, 'BAD_REQUEST_400')
    }
  },
}
