import router from 'express'
import { blogControllers, postControllers } from '../controllers'
import {
  authorizationValidator,
  blogParamsValidator,
  blogQueryValidator,
  commentQueryValidator,
  handleValidationErrors,
  postBodyValidator,
  postBodyValidatorWithoutBlogId,
  postQueryValidator,
} from '../middlewares'
import { postParamsValidator } from '../middlewares/validators/postParamsValidator'
import { blogRouter } from './blogRouter'

export const postRouter = router()

postRouter.get(
  '/:id/comments',
  postParamsValidator,
  commentQueryValidator,
  handleValidationErrors,
  postControllers.getArrangedCommentsOfPost,
)

postRouter.get('/', postQueryValidator, handleValidationErrors, postControllers.getArrangedPosts)

postRouter.get('/:id', postParamsValidator, handleValidationErrors, postControllers.findPost)

postRouter.post(
  '/',
  authorizationValidator,
  postBodyValidator,
  handleValidationErrors,
  postControllers.createPost,
)

postRouter.put(
  '/:id',
  authorizationValidator,
  postParamsValidator,
  postBodyValidator,
  handleValidationErrors,
  postControllers.updatePost,
)

postRouter.delete(
  '/:id',
  authorizationValidator,
  postParamsValidator,
  handleValidationErrors,
  postControllers.deletePost,
)
