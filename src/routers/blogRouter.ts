import router from 'express'
import { blogControllers } from '../controllers'

export const blogRouter = router()

blogRouter.get('/', blogControllers.getBlogs)

blogRouter.get('/:id', blogControllers.findBlog)

blogRouter.post('/', blogControllers.createBlog)

blogRouter.put('/:id', blogControllers.updateBlog)

blogRouter.delete('/:id', blogControllers.deleteBlog)

