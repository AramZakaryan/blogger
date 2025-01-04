import { param } from 'express-validator'

import { userQueryRepository } from '../../queryRepositories'

export const userParamsValidator = [
  param('id')
    .notEmpty()
    .withMessage({
      message: 'user id as URI parameter is required',
      field: 'params',
    })
    .custom(async (_, { req }) => {
      const id = req.params?.id
      const user = await userQueryRepository.findUserById(id)
      if (!user) {
        throw new Error(
          JSON.stringify({
            message: `user with provided id does not exist`,
            field: 'params',
          }),
        )
      }
      return true
    }),
]
