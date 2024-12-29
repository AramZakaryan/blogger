import { body } from 'express-validator'
import { blogRepository } from '../../repositories'
import { handleNotEmpty } from './handleNotEmpty'
import { handleIsStringIsLength } from './handleIsStringIsLength'
import { handleIsString } from './handleIsString'

export const createPostBodyByBlogValidator = [
  handleNotEmpty('title'),
  handleIsStringIsLength('title', 30),
  handleNotEmpty('shortDescription'),
  handleIsStringIsLength('shortDescription', 100),
  handleNotEmpty('content'),
  handleIsStringIsLength('content', 1000),
]

export const createPostBodyValidator = [
  ...createPostBodyByBlogValidator,
  handleNotEmpty('blogId', false),
  handleIsString('blogId').custom(async (value, { req }) => {
    const blog = await blogRepository.findBlog(req.body.blogId)
    if (!blog) {
      throw new Error(
        JSON.stringify({
          message: `blog with provided id does not exist`,
          field: 'blogId',
        }),
      )
    }
    return true
  }),
]

export const updatePostBodyValidator = createPostBodyValidator
