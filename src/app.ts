import express, { Response, Request, NextFunction } from 'express'
import cors from 'cors'
import { PATHS } from './common'
import { blogRouter } from './routers'
import { postRouter } from './routers'
import { testingRouter } from './routers'
import { incorrectBodyMiddleware } from './middlewares'
import { HTTP_STATUS_CODES } from './common/httpStatusCodes'

export const app = express()

app.use(express.json())
app.use(cors())

app.use(incorrectBodyMiddleware)

app.get('/', (_, res: Response) => {
  res.status(HTTP_STATUS_CODES.OK_200).json({ version: '1.0.0' })
})

app.use(PATHS.TESTING, testingRouter)
app.use(PATHS.BLOGS, blogRouter)
app.use(PATHS.POSTS, postRouter)
