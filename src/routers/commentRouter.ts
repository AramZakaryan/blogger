import router from 'express'
import { commentControllers } from '../controllers'
import {
  authorizationValidator,
  commentBodyValidator,
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
  authorizationValidator,
  commentBodyValidator,
  handleValidationErrors,
  commentControllers.createComment,
)

commentRouter.put(
  '/:id',
  authorizationValidator,
  commentParamsValidator,
  commentBodyValidator,
  handleValidationErrors,
  commentControllers.updateComment,
)

commentRouter.delete(
  '/:id',
  authorizationValidator,
  commentParamsValidator,
  handleValidationErrors,
  commentControllers.deleteComment,
)
