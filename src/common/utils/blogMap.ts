import { BlogType, BlogViewModel } from '../../types'
import { WithId } from 'mongodb'

export const blogMap = (blog: WithId<BlogType>): BlogViewModel => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
  isMembership: blog.isMembership,
})
