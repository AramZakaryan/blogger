import router from 'express'
import { blogControllers } from '../controllers'
import { headersValidator } from '../common/validators/headersValidator'

export const blogRouter = router()

blogRouter.get('/', blogControllers.getBlogs)

blogRouter.get('/:id', blogControllers.findBlog)

blogRouter.post('/', headersValidator, blogControllers.createBlog)

blogRouter.put('/:id', headersValidator, blogControllers.updateBlog)

blogRouter.delete('/:id', headersValidator, blogControllers.deleteBlog)
