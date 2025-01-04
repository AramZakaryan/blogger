import { body } from 'express-validator'

export const handleMatches = (field: string, pattern: string) =>
  body(field)
    .matches(pattern)
    .withMessage({ message: `${field} must satisfy the pattern ${pattern}`, field })
