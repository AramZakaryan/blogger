import { postRepository } from '../repositories'
import { CreatePostBody, PostViewModel } from '../types'
import { blogQueryRepository, postQueryRepository } from '../queryRepositories'
import { toObjectId } from '../common/helpers/toObjectId'

export const postService = {
  createPost: async (body: CreatePostBody): Promise<PostViewModel | null> => {
    try {
      const blog = await blogQueryRepository.findBlog(body.blogId)

      if (!blog) return null

      const blogId = toObjectId(blog.id)

      if (!blogId) return null

      const post = {
        ...body,
        blogId,
        blogName: blog.name,
        createdAt: new Date(),
      }

      const id = await postRepository.createPost(post)

      if (!id) return null

      return await postQueryRepository.findPost(id)
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
