import router from 'express'
import { blogControllers } from '../controllers'
import {
  authorizationBearerValidator,
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

blogRouter.post(
  '/',
  // authorizationBearerValidator,
  blogBodyValidator,
  handleValidationErrors,
  blogControllers.createBlog,
)

blogRouter.get(
  '/:id/posts',
  blogParamsValidator,
  postQueryValidator,
  handleValidationErrors,
  blogControllers.getArrangedPostsOfBlog,
)

blogRouter.post(
  '/:id/posts',
  // authorizationBearerValidator,
  blogParamsValidator,
  postBodyValidatorWithoutBlogId,
  handleValidationErrors,
  blogControllers.createPostOfBlog,
)

blogRouter.get('/:id', blogParamsValidator, handleValidationErrors, blogControllers.findBlog)

blogRouter.put(
  '/:id',
  // authorizationBearerValidator,
  blogParamsValidator,
  blogBodyValidator,
  handleValidationErrors,
  blogControllers.updateBlog,
)

blogRouter.delete(
  '/:id',
  // authorizationBearerValidator,
  blogParamsValidator,
  handleValidationErrors,
  blogControllers.deleteBlog,
)
