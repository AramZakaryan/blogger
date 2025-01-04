import { body } from 'express-validator'

export const handleIsStringIsLengthMinMax = (field: string, minLength: number, maxLength: number) =>
  body(field)
    .isString()
    .withMessage({ message: `${field} must be a string`, field })
    .isLength({ min: minLength, max: maxLength })
    .withMessage({ message: `${field} length is between ${minLength} and ${maxLength}`, field })
