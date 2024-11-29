import { Request, Response } from 'express'
import { blogService } from '../services/blogService'

export const blogControllers = {
  getBlogs: async (req: Request, res: Response) => {
    const blogs = await blogService.getBlogs()
    res.json(blogs)
  },

  findBlog: async (req: Request, res: Response) => {
    const id = req.params.id
    const blog = await blogService.findBlog(id)
    res.json(blog)
  },

  // createBlog: async (req: Request, res: Response) => {
  //   res.json(`this is blogControllers.createBlog`)
  // },
  // updateBlog: async (req: Request, res: Response) => {
  //   const id = req.params.id
  //   res.json(`this is blogControllers.update, id is ${id}`)
  // },
  // deleteBlog: async (req: Request, res: Response) => {
  //   const id = req.params.id
  //   res.json(`this is blogControllers.deleteBlog, id is ${id}`)
  // },
}
