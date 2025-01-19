import { param } from 'express-validator'
import { blogQueryRepository, userQueryRepository } from '../../queryRepositories'

export const userParamsValidator = [
  param('id')
    .notEmpty()
    .withMessage({
      message: 'user id as URI parameter is required',
      field: 'params',
    })
    .isMongoId()
    .withMessage({
      message: 'user id must be in a valid format',
      field: 'params',
    }),
]


//     .custom(async (_, { req }) => {
//       const id = req.params?.id
//       const user = await userQueryRepository.findUserById(id)
//       if (!user) {
//         throw new Error(
//           JSON.stringify({
//             message: `user with provided id does not exist`,
//             field: 'params',
//           }),
//         )
//       }
//       return true
//     }),
//   ]
//
// custom(async (value, { req }) => {
//   const blog = await blogQueryRepository.findBlog(req.body.blogId)
//   if (!blog) {
//     throw new Error(
//       JSON.stringify({
//         message: `blog with provided id does not exist`,
//         field: 'blogId',
//       }),
//     )
//   }
//   return true
// }),