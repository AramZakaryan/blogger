import { PostViewModel } from './postDbType'
import { BlogViewModel } from './blog.type'
import { UserViewModel } from './user.type'

export type OutputErrorsType = {
  errorsMessages: { message: string; field: string }[]
}

export type ArrangementQuery<T extends PostViewModel | BlogViewModel | UserViewModel> = {
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
