import router from 'express'
import { authControllers } from '../controllers'
import { authBodyValidator, handleValidationErrors } from '../middlewares'

export const authRouter = router()

authRouter.post('/login', authBodyValidator, handleValidationErrors, authControllers.loginUser)
