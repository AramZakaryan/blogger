import { body } from 'express-validator'
import { handleNotEmpty } from './handleNotEmpty'
import { handleIsStringIsLength } from './handleIsStringIsLength'

export const blogBodyValidator = [
  handleNotEmpty('name'),
  handleIsStringIsLength('name', 15),
  handleNotEmpty('description'),
  handleIsStringIsLength('description', 500),
  handleNotEmpty('websiteUrl', false),
  handleIsStringIsLength('websiteUrl', 100)
    .isURL()
    .withMessage({ message: 'websiteUrl incorrect format', field: 'websiteUrl' }),
  // handleNotEmpty('isMembership'),
  // body('isMembership')
  //   .isBoolean()
  //   .withMessage({ message: 'isMembership incorrect format', field: 'isMembership' }),
]
