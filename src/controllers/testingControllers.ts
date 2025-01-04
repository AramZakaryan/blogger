import { Request, Response } from 'express'
import { setDB } from '../db'
import { HTTP_STATUS_CODES } from '../common'

export const testingControllers = {
  clearDb: async (req: Request, res: Response) => {
    await setDB()
    res.sendStatus(HTTP_STATUS_CODES.NO_CONTENT_204)
  },
}
