import { PostType, PostViewModel } from '../../types'
import { WithId } from 'mongodb'

export const postMap = (post: WithId<PostType>): PostViewModel => ({
  id: post._id.toString(),
  title: post.title,
  shortDescription: post.shortDescription,
  content: post.content,
  blogId: post.blogId.toString(),
  blogName: post.blogName,
  createdAt: post.createdAt.toString(),
})
