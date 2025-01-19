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
import {
  handleCustomError,
  handleResponseError,
  handleResponseNotFoundError,
  HTTP_STATUS_CODES,
} from '../common'
import { blogService } from '../services'
import { blogRepository } from '../repositories'
import { blogQueryRepository, postQueryRepository } from '../queryRepositories'
import { blogQueryService } from '../queryServices'
import { blogCollection } from '../db'

export const blogControllers = {
  getArrangedBlogs: async (
    req: GetArrangedBlogsRequest,
    res: GetArrangedBlogsResponse,
  ): Promise<void> => {
    const { query } = req

    const blogs = await blogQueryService.getArrangedBlogs(query)

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
      handleResponseNotFoundError(res, 'NOT_FOUND_404', 'blog')
    }
  },

  getArrangedPostsOfBlog: async (
    req: GetArrangedPostsByBlogRequest,
    res: GetArrangedPostsByBlogResponse,
  ): Promise<void> => {
    const { query } = req
    const { id } = req.params

    try {
      const posts = await blogQueryService.getArrangedPostsOfBlog(query, id)

      if (posts) {
        res.json(posts)
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
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

    try {
      const createdPostId = await blogService.createPostOfBlog(id, body)

      if (createdPostId) {
        const createdPost = await postQueryRepository.findPost(createdPostId)
        if (createdPost) {
          res.status(HTTP_STATUS_CODES.CREATED_201).json(createdPost)
        } else {
          handleResponseError(res, 'BAD_REQUEST_400')
        }
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },

  updateBlog: async (req: UpdateBlogRequest, res: UpdateBlogResponse): Promise<void> => {
    const { id } = req.params
    const { body } = req

    try {
      const updatedBlogId = await blogService.updateBlog(id, body)

      if (updatedBlogId) {
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },

  deleteBlog: async (req: DeleteBlogRequest, res: DeleteBlogResponse): Promise<void> => {
    const { id } = req.params

    try {
      const deletedBlogId = await blogService.deleteBlog(id)

      if (deletedBlogId) {
        res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
      } else {
        handleResponseError(res, 'BAD_REQUEST_400')
      }
    } catch (error) {
      handleCustomError(res, error)
    }
  },
}
