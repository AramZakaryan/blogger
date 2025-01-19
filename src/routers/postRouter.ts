import router from 'express'
import { postControllers } from '../controllers'
import {
  authorizationValidator,
  handleValidationErrors,
  postBodyValidator,
  postQueryValidator,
} from '../middlewares'
import { postParamsValidator } from '../middlewares/validators/postParamsValidator'

export const postRouter = router()

postRouter.get('/', postQueryValidator, handleValidationErrors, postControllers.getArrangedPosts)

postRouter.get('/:id', postParamsValidator, handleValidationErrors, postControllers.findPost)

postRouter.post(
  '/',
  authorizationValidator,
  postBodyValidator,
  handleValidationErrors,
  postControllers.createPost,
)

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
