import router from 'express'
import { postControllers } from '../controllers'
import { handleValidationErrors, authorizationValidator } from '../common'
import { createPostBodyValidator } from '../common'

export const postRouter = router()

postRouter.get('/', postControllers.getPosts)

postRouter.get('/:id', postControllers.findPost)

// postRouter.post('/',  headersValidator, createPostBodyValidator, handleValidationErrors, postControllers.createPost)

postRouter.put('/:id', authorizationValidator, postControllers.updatePost)

postRouter.delete('/:id', authorizationValidator, postControllers.deletePost)
