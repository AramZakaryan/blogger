import { db } from '../db'
import { BlogType, CreateBlogBody, UpdateBlogBody } from '../types'

export const blogService = {
  getBlogs: async (): Promise<BlogType[]> => {
    const blogs = db.blogs.slice(-15)

    return blogs
  },

  findBlog: async (id: string): Promise<BlogType | undefined> => {
    const blog = db.blogs.find((blog) => blog.id === id)

    return blog
  },

  createBlog: async (body: CreateBlogBody): Promise<BlogType> => {
    const blog = {
      id: String(Date.now() + Math.random()),
      ...body,
    }

    db.blogs.push(blog)

    return blog
  },

  updateBlog: async (id: string, body: UpdateBlogBody): Promise<BlogType> => {
    const blogIndex = db.blogs.findIndex((blog) => blog.id === id)

    if (blogIndex !== -1) {
      db.blogs[blogIndex] = { ...db.blogs[blogIndex], ...body }
    }

    return db.blogs[blogIndex]
  },
}
