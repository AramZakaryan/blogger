import router from 'express'
import { postControllers } from '../controllers'

export const postRouter = router()

postRouter.get('/', postControllers.getPosts)

postRouter.get('/:id', postControllers.findPost)

postRouter.post('/', postControllers.createPost)

// postRouter.put('/:id', postControllers.updatePost)
//
// postRouter.delete('/:id', postControllers.deletePost)
