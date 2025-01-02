import router from 'express'
import { postControllers } from '../controllers'
import {
  authorizationValidator,
  createPostBodyValidator,
  handleValidationErrors,
  postParamsValidator,
  postQueryValidator,
  updatePostBodyValidator,
} from '../middlewares'

export const postRouter = router()

postRouter.get('/', postQueryValidator, handleValidationErrors, postControllers.getArrangedPosts)

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
