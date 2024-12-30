import { PostViewModel } from './post.type'

export type OutputErrorsType = {
  errorsMessages: { message: string; field: string }[]
}

export type ArrangementQuery = {
  pageNumber?: number
  pageSize?: number
  sortBy?: keyof PostViewModel
  sortDirection?: 'asc' | 'desc'
}

export type ArrangedViewModel<T> = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: T[]
}
