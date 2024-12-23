import express, { Response, Request, NextFunction } from 'express'
import cors from 'cors'
import { PATHS } from './common'
import { blogRouter } from './routers'
import { postRouter } from './routers'
import { testingRouter } from './routers'

export const app = express()

app.use(express.json())
app.use(cors())

// Custom error-handling middleware for checking req.body
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Check if it’s a JSON parse error
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      errorsMessages: [
        {
          message: 'body is incorrect',
          field: 'body',
        },
      ],
    })
  } else {
    // Not a JSON parse error, let other error handlers (or default) handle it
    next(err)
  }
})

app.get('/', (_, res: Response) => {
  res.status(200).json({ version: '1.0.0' })
})

app.use(PATHS.TESTING, testingRouter)
app.use(PATHS.BLOGS, blogRouter)
app.use(PATHS.POSTS, postRouter)
