import router from 'express'
import { postControllers } from '../controllers'
import { headersValidator } from '../common/validators/headersValidator'

export const postRouter = router()

postRouter.get('/', headersValidator, postControllers.getPosts)

postRouter.get('/:id', headersValidator, postControllers.findPost)

postRouter.post('/', headersValidator, postControllers.createPost)

postRouter.put('/:id', headersValidator, postControllers.updatePost)

postRouter.delete('/:id', headersValidator, postControllers.deletePost)
