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

blogRouter.post(
  '/',
  authorizationValidator,
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
  authorizationValidator,
  blogParamsValidator,
  postBodyValidatorWithoutBlogId,
  handleValidationErrors,
  blogControllers.createPostOfBlog,
)

blogRouter.get('/:id', blogParamsValidator, handleValidationErrors, blogControllers.findBlog)

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
