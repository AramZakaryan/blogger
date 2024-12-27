import { BlogDbType, BlogType } from '../../types'

export const blogMap = (blog: BlogDbType): BlogType => ({
  id: blog._id,
  name: blog.name,
  description: blog.description,
  websiteUrl: blog.websiteUrl,
  createdAt: blog.createdAt,
  isMembership: blog.isMembership,
})
