import { postRepository } from '../repositories'
import { CreatePostBody, CreatePostOfBlogBody, PostType } from '../types'
import { WithId } from 'mongodb'

export const blogServices = {
  createPostOfBlog: async (
    blogId: string,
    body: CreatePostOfBlogBody,
  ): Promise<WithId<PostType> | null> => {
    const updatedBody: CreatePostBody = { ...body, blogId }

    return await postRepository.createPost(updatedBody)
  },
}
