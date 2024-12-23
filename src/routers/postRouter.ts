import router from 'express'
import { postControllers } from '../controllers'
import { handleValidationErrors, authorizationValidator, blogIdValidator } from '../common'
import { postBodyValidator } from '../common'
import { postParamsValidator } from '../common/validators/postParamsValidator'

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
