import { blogService } from '../../services'
import { NextFunction, Request, Response } from 'express'

export const blogIdValidator = async (req: Request, res: Response, next: NextFunction) => {
  const blogId = req.body.blogId

  const blog = await blogService.findBlog(blogId)

  // check if a blog with the provided blogId exists
  if (!blog) {
    {
      res.status(400).json({
        errorsMessages: [
          {
            message: `blog with provided id does not exist`,
            field: 'blogId',
          },
        ],
      })
    }
  } else {
    next()
  }
}

// xport const blogIdValidator = async (id: FindBlogParams['id']) => {
//
//
//   /** object for accumulating errors */
//   const errors: OutputErrorsType = {
//     errorsMessages: [],
//   }
//
//   if (!id) return errors // return object with empty array of errorsMessages
//
//   // // Check if blog id as uri parameter exists
//   // if (id === null || id === undefined) {
//   //   errors.errorsMessages.push({
//   //     message: 'blog id as URI parameter is required',
//   //     field: 'blogId',
//   //   })
//   // }
//
//   const blog = await blogService.findBlog(id)
//
//   // check if a blog with the provided id (received as a parameter) exists
//   if (!blog) {
//     errors.errorsMessages.push({
//       message: `blog with provided id does not exist`,
//       field: 'blogId',
//     })
//   }
//
//   return errors
// }