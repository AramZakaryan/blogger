import { db } from '../db'
import { BlogDto, BlogType } from '../types'

export const blogService = {
  getBlogs: async (): Promise<BlogType[]> => {
    const blogs = db.blogs.slice(-15)

    return blogs
  },

  findBlog: async (id: string): Promise<BlogType | undefined> => {
    const blog = db.blogs.find((blog) => blog.id === id)

    return blog
  },

  createBlog: async (body: BlogDto): Promise<BlogType> => {
    const blog = {
      id: String(Date.now() + Math.random()),
      ...body,
    }

    db.blogs.push(blog)

    return blog
  },
}
