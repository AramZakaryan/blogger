import { BlogType, PostDbType, UserType } from '../types'
import { WithId } from 'mongodb'

export type Db = {
  blogs: WithId<BlogType>[]
  posts: WithId<PostDbType>[]
  users: WithId<UserType>[]
}
