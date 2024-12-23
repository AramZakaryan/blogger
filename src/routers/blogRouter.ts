import router from 'express'
import { blogControllers } from '../controllers'
import { handleValidationErrors, authorizationValidator } from '../common'
import { blogBodyValidator } from '../common'
import { blogParamsValidator } from '../common'

export const blogRouter = router()

blogRouter.get('/', blogControllers.getBlogs)

blogRouter.get('/:id', blogParamsValidator, handleValidationErrors, blogControllers.findBlog)

blogRouter.post(
  '/',
  authorizationValidator,
  blogBodyValidator,
  handleValidationErrors,
  blogControllers.createBlog,
)

blogRouter.put(
  '/:id',
  authorizationValidator,
  blogParamsValidator,
  blogBodyValidator,
  handleValidationErrors,
  blogControllers.updateBlog,
)

blogRouter.delete(
  '/:id',
  authorizationValidator,
  blogParamsValidator,
  handleValidationErrors,
  blogControllers.deleteBlog,
)
