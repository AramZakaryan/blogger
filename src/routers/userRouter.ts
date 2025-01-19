import router from 'express'
import { userControllers } from '../controllers'
import {
  authorizationValidator,
  handleValidationErrors,
  userBodyValidator,
  userQueryValidator,
} from '../middlewares'
import { userParamsValidator } from '../middlewares/validators/userParamsValidator'

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
