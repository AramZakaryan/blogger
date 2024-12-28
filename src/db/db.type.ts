import { BlogType, PostType } from '../types'
import { WithId } from 'mongodb'

export type Db = {
  blogs: WithId<BlogType>[]
  posts: WithId<PostType>[]
}
