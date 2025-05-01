import router from 'express'
import { postControllers } from '../controllers'
import {
  authorizationValidator,
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
  authorizationValidator,
  postParamsValidator,
  commentBodyValidatorWithoutPostId,
  handleValidationErrors,
  postControllers.createCommentOfPost,
)

postRouter.get('/', postQueryValidator, handleValidationErrors, postControllers.getArrangedPosts)

postRouter.post(
  '/',
  authorizationValidator,
  postBodyValidator,
  handleValidationErrors,
  postControllers.createPost,
)

postRouter.get('/:id', postParamsValidator, handleValidationErrors, postControllers.findPost)

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
