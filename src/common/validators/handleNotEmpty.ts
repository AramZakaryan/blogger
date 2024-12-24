import { body } from 'express-validator'

export const handleNotEmpty = (field: string, withTrim: boolean = true) =>
  (withTrim ? body(field).trim() : body(field))
    .notEmpty()
    .withMessage({ message: `${field} is required`, field })