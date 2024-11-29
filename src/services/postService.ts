import { db } from '../db'
import { BlogType, PostDto, PostType } from '../types'
import { blogService } from './blogService'

export const postService = {
  getPosts: async () => {
    const posts = db.posts.slice(-15)
    // const posts = dataSet1.posts.slice(-15)
    return posts
  },

  findPost: async (id: string) => {
    const post = db.posts.find((post) => post.id === id)
    // const post = dataSet1.posts.find((post) => post.id === id)
    return post
  },

  createPost: async (body: PostDto): Promise<PostType> => {
    const blog = await blogService.findBlog(body.blogId)

    const post = {
      id: String(Date.now() + Math.random()),
      ...body,
      blogName: blog?.name || '',
    }

    db.posts.push(post)

    return post
  },
}
