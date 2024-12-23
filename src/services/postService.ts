import { db } from '../db'
import { CreatePostBody, PostType, UpdatePostBody } from '../types'
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

  createPost: async (body: CreatePostBody): Promise<PostType> => {
    const blog = await blogService.findBlog(body.blogId)

    const post = {
      id: String(Date.now() + Math.random()),
      ...body,
      blogName: blog?.name || '',
    }

    db.posts.push(post)

    return post
  },

  updatePost: async (id: string, body: UpdatePostBody): Promise<PostType> => {
    const postIndex = db.posts.findIndex((post) => post.id === id)

    if (postIndex !== -1) {
      db.posts[postIndex] = { ...db.posts[postIndex], ...body }
    }

    return db.posts[postIndex]
  },

  deletePost: async (id: string): Promise<PostType | undefined> => {
    const postIndex = db.posts.findIndex((post) => post.id === id)

    let post

    if (postIndex !== -1) {
      ;[post] = db.posts.splice(postIndex, 1)
    }

    return post
  },
}
