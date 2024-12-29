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
