import { BlogDbType, BlogViewModel } from '../../types'
import { WithId } from 'mongodb'

export const blogMap = (blog: WithId<BlogDbType>): BlogViewModel => ({
  id: blog._id.toString(),
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt.toISOString(),
  isMembership: blog.isMembership,
})
