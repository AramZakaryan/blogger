import { body } from 'express-validator'
import { handleNotEmpty } from './handlers/handleNotEmpty'
import { handleIsStringIsLengthMax } from './handlers/handleIsStringIsLengthMax'

export const blogBodyValidator = [
  handleNotEmpty('name'),
  handleIsStringIsLengthMax('name', 15),
  handleNotEmpty('description'),
  handleIsStringIsLengthMax('description', 500),
  handleNotEmpty('websiteUrl', false),
  handleIsStringIsLengthMax('websiteUrl', 100)
    .isURL()
    .withMessage({ message: 'websiteUrl incorrect format', field: 'websiteUrl' }),
]
