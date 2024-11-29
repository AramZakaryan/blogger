import { BlogType } from '../types/blog.type'
import { PostType } from '../types/post.type'

export type Db = {
  blogs: BlogType[]
  posts: PostType[]
}
