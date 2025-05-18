import express, { Response } from 'express'
import cors from 'cors'
import { HTTP_STATUS_CODES, PATHS } from './common'
import { authRouter, blogRouter, commentRouter, postRouter, testingRouter, userRouter } from './routers'
import { incorrectBodyMiddleware } from './middlewares'
import { config } from 'dotenv'
import path from 'node:path'

export const app = express()

app.use(express.json())
app.use(cors())

app.use(incorrectBodyMiddleware)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

config()

const version = process.env.VERSION

app.get('/', (_, res: Response) => {
  res.status(HTTP_STATUS_CODES.OK_200).json({ server_version : version })
})

app.use(PATHS.TESTING, testingRouter)
app.use(PATHS.BLOGS, blogRouter)
app.use(PATHS.POSTS, postRouter)
app.use(PATHS.COMMENTS, commentRouter)
app.use(PATHS.USERS, userRouter)
app.use(PATHS.AUTH, authRouter)

app.get('/views', (_, res) => {
  res.render('index', {})
})
