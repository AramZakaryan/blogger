import { blogRepository, postRepository } from '../repositories'
import {
  BlogType,
  BlogViewModel,
  CreateBlogBody,
  CreatePostBody,
  CreatePostOfBlogBody,
  PostViewModel,
} from '../types'
import { blogQueryRepository } from '../queryRepositories'
import { postService } from './postService'

export const blogService = {
  createBlog: async (body: CreateBlogBody): Promise<BlogViewModel | null> => {
    try {
      const blog: BlogType = {
        ...body,
        createdAt: new Date(),
        isMembership: false,
      }

      const id = await blogRepository.createBlog(blog)

      if (!id) return null

      return await blogQueryRepository.findBlog(id)
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  createPostOfBlog: async (
    blogId: string,
    body: CreatePostOfBlogBody,
  ): Promise<PostViewModel | null> => {
    const updatedBody: CreatePostBody = { ...body, blogId }

    return await postService.createPost(updatedBody)
  },
}
