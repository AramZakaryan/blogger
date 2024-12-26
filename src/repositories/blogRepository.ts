import { db } from '../db'
import { BlogDbType, BlogType, CreateBlogBody, UpdateBlogBody } from '../types'
import { blogCollection } from '../db/mongo'
import { blogControllers } from '../controllers'

class InsertOneResult<T> {}

export const blogRepository = {
  getBlogs: async (): Promise<BlogType[]> => {
    const blogs = await blogCollection.find({}).toArray()
    // const blogs = db.blogs.slice(-15)

    return blogs
  },

  findBlog: async (id: string): Promise<BlogType | null> => {
    const blog = await blogCollection.findOne({ id })
    // const blog = db.blogs.find((blog) => blog.id === id)

    return blog
  },

  createBlog: async (body: CreateBlogBody): Promise<any> => {
    const blog = {
      id: String(Date.now() + Math.random()),
      ...body,
    }

    const createdBlog = await blogCollection.insertOne(blog)
    // db.blogs.push(blog)

    return createdBlog
  },

  updateBlog: async (id: string, body: UpdateBlogBody): Promise<BlogType> => {
    const blogIndex = db.blogs.findIndex((blog) => blog.id === id)

    if (blogIndex !== -1) {
      db.blogs[blogIndex] = { ...db.blogs[blogIndex], ...body }
    }

    return db.blogs[blogIndex]
  },
  deleteBlog: async (id: string): Promise<BlogType | undefined> => {
    const blogIndex = db.blogs.findIndex((blog) => blog.id === id)

    let blog

    if (blogIndex !== -1) {
      ;[blog] = db.blogs.splice(blogIndex, 1)
    }

    return blog
  },
}
