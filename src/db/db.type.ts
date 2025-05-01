import { BlogDbType, CommentDbType, PostDbType, UserDbType } from '../types'
import { WithId } from 'mongodb'

export type Db = {
  blogs: WithId<BlogDbType>[]
  posts: WithId<PostDbType>[]
  comments: WithId<CommentDbType>[]
  users: WithId<UserDbType>[]
}
