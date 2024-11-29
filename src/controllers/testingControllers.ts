import { Request, Response } from 'express'
import { setDB } from '../db'

export const testingControllers = {
  clearDb: async (req: Request, res: Response) => {
    setDB()
    res.sendStatus(204)
  },
}
