import { postRepository } from '../repositories'
import { CreatePostBody, CreatePostByBlogBody, PostType } from '../types'
import { WithId } from 'mongodb'

export const blogServices = {
  createPostByBlog: async (
    blogId: string,
    body: CreatePostByBlogBody,
  ): Promise<WithId<PostType> | null> => {
    const updatedBody: CreatePostBody = { ...body, blogId }

    return await postRepository.createPost(updatedBody)
  },
}
