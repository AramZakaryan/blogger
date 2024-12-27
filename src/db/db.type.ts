import { BlogDbType, PostDbType } from '../types'

export type Db = {
  blogs: BlogDbType[]
  posts: PostDbType[]
}
