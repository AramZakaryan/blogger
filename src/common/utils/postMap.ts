import { BlogDbType, BlogType, PostDbType, PostType } from '../../types'
import { ObjectId } from 'mongodb'

export const postMap = (post: PostDbType): PostType => ({
  id: post._id,
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
})
