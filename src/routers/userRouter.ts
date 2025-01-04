import router from 'express'
import { userControllers } from '../controllers'
import {
  authorizationValidator,
  handleValidationErrors,
  userBodyValidator,
  userParamsValidator,
  userQueryValidator,
} from '../middlewares'

export const userRouter = router()

userRouter.get(
  '/',
  authorizationValidator,
  userQueryValidator,
  handleValidationErrors,
  userControllers.getArrangedUsers,
)

userRouter.get(
  '/:id',
  authorizationValidator,
  userParamsValidator,
  handleValidationErrors,
  userControllers.findUser,
)

userRouter.post(
  '/',
  authorizationValidator,
  userBodyValidator,
  handleValidationErrors,
  userControllers.createUser,
)

userRouter.delete(
  '/:id',
  authorizationValidator,
  userParamsValidator,
  handleValidationErrors,
  userControllers.deleteUser,
)
