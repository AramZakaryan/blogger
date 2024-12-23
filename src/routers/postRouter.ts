import router from 'express'
import { postControllers } from '../controllers'
import { authorizationValidator, handleValidationErrors, postBodyValidator } from '../common'
import { postParamsValidator } from '../common'

export const postRouter = router()

postRouter.get('/', postControllers.getPosts)

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
