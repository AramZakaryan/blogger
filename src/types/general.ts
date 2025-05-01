import { PostViewModel } from './post.type'
import { BlogViewModel } from './blog.type'
import { UserViewModel } from './user.type'
import { HTTP_STATUS_CODES } from '../common'
import { CommentViewModel } from './comment.type'

export type OutputErrorsType = {
  errorsMessages: { message: string; field: string }[]
}

export type ArrangementQuery<
  T extends PostViewModel | BlogViewModel | UserViewModel | CommentViewModel,
> = {
  pageNumber?: number
  pageSize?: number
  sortBy?: keyof T
  sortDirection?: 'asc' | 'desc'
}

export type ArrangedViewModel<T> = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: T[]
}

export type Result<T = null> = {
  status: ResultCode
  errorMessage?: string
  extensions?: Extension[]
  data?: T
}

type Extension = {
  field?: string
  message?: string
}

export enum ResultCode {
  Success = 'Success',
  NotFound = 'NotFound',
  Forbidden = 'Forbidden',
  Unauthorized = 'Unauthorized',
  BadRequest = 'BadRequest',
}
