import { Request, Response } from 'express'

export const blogControllers = {
  getAllBlogs: async (req: Request, res: Response) => {
    res.json('this is blogControllers.getAllBlogs')
  },

  findBlog: async (req: Request, res: Response) => {
    const id = req.params.id
    res.json(`this is blogControllers.findBlog, id is ${id}`)
  },

  createBlog: async (req: Request, res: Response) => {
    res.json(`this is blogControllers.createBlog`)
  },
  updateBlog: async (req: Request, res: Response) => {
    const id = req.params.id
    res.json(`this is blogControllers.update, id is ${id}`)
  },
  deleteBlog: async (req: Request, res: Response) => {
    const id = req.params.id
    res.json(`this is blogControllers.deleteBlog, id is ${id}`)
  },
}
