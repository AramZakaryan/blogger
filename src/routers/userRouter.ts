import router from 'express'
import { userControllers } from '../controllers'
import {
  authorizationBearerValidator,
  handleValidationErrors,
  userBodyValidator,
  userQueryValidator,
} from '../middlewares'
import { userParamsValidator } from '../middlewares/validators/userParamsValidator'

export const userRouter = router()

userRouter.get(
  '/',
  // authorizationBearerValidator,
  userQueryValidator,
  handleValidationErrors,
  userControllers.getArrangedUsers,
)

userRouter.get(
  '/:id',
  // authorizationBearerValidator,
  userParamsValidator,
  handleValidationErrors,
  userControllers.findUser,
)

userRouter.post(
  '/',
  // authorizationBearerValidator,
  userBodyValidator,
  handleValidationErrors,
  userControllers.createUser,
)

userRouter.delete(
  '/:id',
  // authorizationBearerValidator,
  userParamsValidator,
  handleValidationErrors,
  userControllers.deleteUser,
)
