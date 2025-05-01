import router from 'express'
import { blogControllers } from '../controllers'
import {
  authorizationValidator,
  blogBodyValidator,
  blogParamsValidator,
  blogQueryValidator,
  postBodyValidator,
  handleValidationErrors,
  postQueryValidator,
  postBodyValidatorWithoutBlogId,
} from '../middlewares'

export const blogRouter = router()

blogRouter.get('/', blogQueryValidator, handleValidationErrors, blogControllers.getArrangedBlogs)

blogRouter.get(
  '/:id/posts',
  blogParamsValidator,
  postQueryValidator,
  handleValidationErrors,
  blogControllers.getArrangedPostsOfBlog,
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
  postBodyValidatorWithoutBlogId,
  handleValidationErrors,
  blogControllers.createPostOfBlog,
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
