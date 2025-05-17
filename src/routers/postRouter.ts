import router from 'express'
import { postControllers } from '../controllers'
import {
  authorizationBearerValidator,
  commentBodyValidatorWithoutPostId,
  commentQueryValidator,
  handleValidationErrors,
  postBodyValidator,
  postParamsValidator,
  postQueryValidator,
} from '../middlewares'
import { authorizationBasicValidator } from '../middlewares/validators/authorizationBasicValidator'

export const postRouter = router()

postRouter.get(
  '/:id/comments',
  postParamsValidator,
  commentQueryValidator,
  handleValidationErrors,
  postControllers.getArrangedCommentsOfPost,
)

postRouter.post(
  '/:id/comments',
  authorizationBearerValidator,
  postParamsValidator,
  commentBodyValidatorWithoutPostId,
  handleValidationErrors,
  postControllers.createCommentOfPost,
)

postRouter.get('/', postQueryValidator, handleValidationErrors, postControllers.getArrangedPosts)

postRouter.post(
  '/',
  // authorizationBearerValidator,
  authorizationBasicValidator,
  postBodyValidator,
  handleValidationErrors,
  postControllers.createPost,
)

postRouter.get('/:id', postParamsValidator, handleValidationErrors, postControllers.findPost)

postRouter.put(
  '/:id',
  // authorizationBearerValidator,
  authorizationBasicValidator,
  postParamsValidator,
  postBodyValidator,
  handleValidationErrors,
  postControllers.updatePost,
)

postRouter.delete(
  '/:id',
  // authorizationBearerValidator,
  authorizationBasicValidator,
  postParamsValidator,
  handleValidationErrors,
  postControllers.deletePost,
)
