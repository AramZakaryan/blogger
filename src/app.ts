import express, { Response } from 'express'
import cors from 'cors'
import { HTTP_STATUS_CODES, PATHS } from './common'
import { authRouter, blogRouter, postRouter, testingRouter, userRouter } from './routers'
import { incorrectBodyMiddleware } from './middlewares'
import { config } from 'dotenv'

export const app = express()

app.use(express.json())
app.use(cors())

app.use(incorrectBodyMiddleware)

config()
const version = process.env.VERSION

app.get('/', (_, res: Response) => {
  res.status(HTTP_STATUS_CODES.OK_200).json({ version })
})

app.use(PATHS.TESTING, testingRouter)
app.use(PATHS.BLOGS, blogRouter)
app.use(PATHS.POSTS, postRouter)
app.use(PATHS.USERS, userRouter)
app.use(PATHS.AUTH, authRouter)
