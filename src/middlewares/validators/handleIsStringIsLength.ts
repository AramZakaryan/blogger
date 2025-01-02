import { body } from 'express-validator'

export const handleIsStringIsLength = (field: string, maxLength: number) =>
  body(field)
    .isString()
    .withMessage({ message: `${field} must be a string`, field })
    .isLength({ max: maxLength })
    .withMessage({ message: `${field} max length is ${maxLength}`, field })
