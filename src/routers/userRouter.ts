import router from 'express'
import { userControllers } from '../controllers'
import {
  authorizationBearerValidator,
  handleValidationErrors,
  userBodyValidator,
  userQueryValidator,
} from '../middlewares'
import { userParamsValidator } from '../middlewares/validators/userParamsValidator'
import { authorizationBasicValidator } from '../middlewares/validators/authorizationBasicValidator'

export const userRouter = router()

userRouter.get(
  '/',
  // authorizationBearerValidator,
  authorizationBasicValidator,
  userQueryValidator,
  handleValidationErrors,
  userControllers.getArrangedUsers,
)

userRouter.get(
  '/:id',
  // authorizationBearerValidator,
  authorizationBasicValidator,
  userParamsValidator,
  handleValidationErrors,
  userControllers.findUser,
)

userRouter.post(
  '/',
  // authorizationBearerValidator,
  authorizationBasicValidator,
  userBodyValidator,
  handleValidationErrors,
  userControllers.registerUser,
)

userRouter.delete(
  '/:id',
  // authorizationBearerValidator,
  authorizationBasicValidator,
  userParamsValidator,
  handleValidationErrors,
  userControllers.deleteUser,
)
