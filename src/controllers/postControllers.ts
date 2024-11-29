import { Request, Response } from 'express'
import { postService } from '../services/postService'

export const postControllers = {
  getPosts: async (req: Request, res: Response) => {
    const posts = await postService.getPosts()
    res.json(posts)
  },

  findPost: async (req: Request, res: Response) => {
    const id = req.params.id
    const post = await postService.findPost(id)
    res.json(post)
  },

  // createPost: async (req: Request, res: Response) => {
  //   res.json(`this is postControllers.createPost`)
  // },
  // updatePost: async (req: Request, res: Response) => {
  //   const id = req.params.id
  //   res.json(`this is postControllers.update, id is ${id}`)
  // },
  // deletePost: async (req: Request, res: Response) => {
  //   const id = req.params.id
  //   res.json(`this is postControllers.deletePost, id is ${id}`)
  // },
}
