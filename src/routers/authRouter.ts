import router from 'express'
import { authControllers } from '../controllers'

export const authRouter = router()

authRouter.post(
  '/',
  // userBodyValidator,
  // handleValidationErrors,
  authControllers.loginUser,
)
