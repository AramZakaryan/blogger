import router from 'express'
import { commentControllers } from '../controllers'
import {
  authorizationBearerValidator,
  commentBodyValidator, commentBodyValidatorWithoutPostId,
  commentParamsValidator,
  commentQueryValidator,
  handleValidationErrors,
} from '../middlewares'

export const commentRouter = router()

commentRouter.get(
  '/',
  commentQueryValidator,
  handleValidationErrors,
  commentControllers.getArrangedComments,
)

commentRouter.get(
  '/:id',
  commentParamsValidator,
  handleValidationErrors,
  commentControllers.findComment,
)

commentRouter.post(
  '/',
  authorizationBearerValidator,
  commentBodyValidator,
  handleValidationErrors,
  commentControllers.createComment,
)

commentRouter.put(
  '/:id',
  authorizationBearerValidator,
  commentParamsValidator,
  commentBodyValidatorWithoutPostId,
  handleValidationErrors,
  commentControllers.updateComment,
)

commentRouter.delete(
  '/:id',
  authorizationBearerValidator,
  commentParamsValidator,
  handleValidationErrors,
  commentControllers.deleteComment,
)
