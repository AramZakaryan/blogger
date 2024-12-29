import router from 'express'
import { postControllers } from '../controllers'
import {
  authorizationValidator,
  handleValidationErrors,
  createPostBodyValidator,
  updatePostBodyValidator,
} from '../common'
import { postParamsValidator } from '../common'

export const postRouter = router()

postRouter.get('/', postControllers.getPosts)

postRouter.get('/:id', postParamsValidator, handleValidationErrors, postControllers.findPost)

postRouter.post(
  '/',
  authorizationValidator,
  createPostBodyValidator,
  handleValidationErrors,
  postControllers.createPost,
)

postRouter.put(
  '/:id',
  authorizationValidator,
  postParamsValidator,
  updatePostBodyValidator,
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
