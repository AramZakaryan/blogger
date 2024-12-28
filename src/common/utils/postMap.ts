import { PostType, PostViewModel } from '../../types'
import { WithId } from 'mongodb'

export const postMap = (post: WithId<PostType>): PostViewModel => ({
  id: post._id,
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId,
  blogName: post.blogName,
  createdAt: post.createdAt,
})
