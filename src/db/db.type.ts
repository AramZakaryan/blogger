import { BlogDbType, PostDbType, UserDbType } from '../types'
import { WithId } from 'mongodb'

export type Db = {
  blogs: WithId<BlogDbType>[]
  posts: WithId<PostDbType>[]
  users: WithId<UserDbType>[]
}
