import router from 'express'
import { postControllers } from '../controllers'
import {
  authorizationBearerValidator,
  commentBodyValidatorWithoutPostId,
  commentQueryValidator,
  handleValidationErrors,
  postBodyValidator,
  postParamsValidator,
  postQueryValidator,
} from '../middlewares'

export const postRouter = router()

postRouter.get(
  '/:id/comments',
  postParamsValidator,
  commentQueryValidator,
  handleValidationErrors,
  postControllers.getArrangedCommentsOfPost,
)

postRouter.post(
  '/:id/comments',
  authorizationBearerValidator,
  postParamsValidator,
  commentBodyValidatorWithoutPostId,
  handleValidationErrors,
  postControllers.createCommentOfPost,
)

postRouter.get('/', postQueryValidator, handleValidationErrors, postControllers.getArrangedPosts)

postRouter.post(
  '/',
  // authorizationBearerValidator,
  postBodyValidator,
  handleValidationErrors,
  postControllers.createPost,
)

postRouter.get('/:id', postParamsValidator, handleValidationErrors, postControllers.findPost)

postRouter.put(
  '/:id',
  // authorizationBearerValidator,
  postParamsValidator,
  postBodyValidator,
  handleValidationErrors,
  postControllers.updatePost,
)

postRouter.delete(
  '/:id',
  // authorizationBearerValidator,
  postParamsValidator,
  handleValidationErrors,
  postControllers.deletePost,
)
