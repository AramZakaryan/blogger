import router from 'express'
import { blogControllers } from '../controllers'
import { handleValidationErrors, authorizationValidator } from '../common'
import { createBlogBodyValidator } from '../common'

export const blogRouter = router()

blogRouter.get('/', blogControllers.getBlogs)

blogRouter.get('/:id', blogControllers.findBlog)

blogRouter.post(
  '/',
  authorizationValidator,
  createBlogBodyValidator,
  handleValidationErrors,
  blogControllers.createBlog,
)

blogRouter.put('/:id', authorizationValidator, blogControllers.updateBlog)

blogRouter.delete('/:id', authorizationValidator, blogControllers.deleteBlog)
