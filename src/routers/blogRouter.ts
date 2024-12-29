import router from 'express'
import { blogControllers } from '../controllers'
import { handleValidationErrors, authorizationValidator, createPostBodyByBlogValidator } from '../common'
import { blogBodyValidator } from '../common'
import { blogParamsValidator } from '../common'
import { blogQueryValidator } from '../common'

export const blogRouter = router()

blogRouter.get('/', blogControllers.getAllBlogs)

blogRouter.get(
  '/:id/posts',
  blogParamsValidator,
  blogQueryValidator,
  handleValidationErrors,
  blogControllers.getArrangedPostsByBlog,
)

blogRouter.get('/:id', blogParamsValidator, handleValidationErrors, blogControllers.findBlog)

blogRouter.post(
  '/',
  authorizationValidator,
  blogBodyValidator,
  handleValidationErrors,
  blogControllers.createBlog,
)

blogRouter.post(
  '/:id/posts',
  authorizationValidator,
  blogParamsValidator,
  createPostBodyByBlogValidator,
  handleValidationErrors,
  blogControllers.createPostByBlog,
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
