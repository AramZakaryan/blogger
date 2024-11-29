import { db } from '../db/db'

export const blogService = {
  getBlogs: async () => {
    const blogs = db.blogs.slice(-15)
    // const blogs = dataSet1.blogs.slice(-15)
    return blogs
  },

  findBlog: async (id: string) => {
    const blog = db.blogs.find((blog) => blog.id === id)
    // const blog = dataSet1.blogs.find((blog) => blog.id === id)
    return blog
  },
}
