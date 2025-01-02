import { body } from 'express-validator'

export const handleIsString = (field: string) =>
  body(field)
    .isString()
    .withMessage({ message: `${field} must be a string`, field })