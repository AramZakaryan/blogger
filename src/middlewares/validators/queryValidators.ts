import { query } from 'express-validator'

const queryValidator = [
  query('pageNumber')
    .optional()
    .isNumeric({ no_symbols: true })
    .withMessage({
      message: 'pageNumber must contain only numeric digits',
      field: 'query',
    })
    .toInt(), // convert to integer to use it in app
  query('pageSize')
    .optional()
    .isNumeric({ no_symbols: true })
    .withMessage({
      message: 'pageSize must contain only numeric digits',
      field: 'query',
    })
    .toInt(), // convert to integer to use it in app

  query('sortDirection').optional().isString().isIn(['asc', 'desc']).withMessage({
    message: 'sortDirection must be key of asc or desc',
    field: 'query',
  }),
  query('SearchNameTerm').optional().isString().withMessage({
    message: 'SearchNameTerm must string',
    field: 'query',
  }),
]

export const blogQueryValidator = [
  ...queryValidator,
  query('sortBy')
    .optional()
    .isString()
    .isIn(['id', 'name', 'description', 'websiteUrl', 'isMembership', 'createdAt'])
    .withMessage({
      message: 'sortBy must be key of post',
      field: 'query',
    }),
]

export const postQueryValidator = [
  ...queryValidator,
  query('sortBy')
    .optional()
    .isString()
    .isIn(['id', 'title', 'shortDescription', 'content', 'blogId', 'blogName', 'createdAt'])
    .withMessage({
      message: 'sortBy must be key of post',
      field: 'query',
    }),
]