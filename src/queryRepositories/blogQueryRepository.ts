import {
  ArrangedBlogsViewModel,
  ArrangedPostsViewModel,
  BlogType,
  BlogViewModel,
  GetArrangedBlogsQuery,
  GetArrangedPostsByBlogQuery,
} from '../types'
import { blogCollection, postCollection } from '../db'
import { blogMap, postMap } from '../common'
import { ObjectId, WithId } from 'mongodb'
import { toObjectId } from '../common/helpers/toObjectId'

export const blogQueryRepository = {
  getArrangedBlogs: async (
    query: GetArrangedBlogsQuery,
  ): Promise<ArrangedBlogsViewModel | null> => {
    const pageNumber = query.pageNumber || 1
    const pageSize = query.pageSize || 10
    const skip = (pageNumber - 1) * pageSize // skip blogs for previous pages

    const sortBy = query.sortBy === 'id' ? '_id' : query.sortBy || 'createdAt'
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1

    const searchNameTerm = query.searchNameTerm || ''
    const searchNameTermRegExp = new RegExp(searchNameTerm, 'i') // case-insensitive search

    try {
      const blogs = await blogCollection
        .find({ name: { $regex: searchNameTermRegExp } })
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray()

      const totalCount = await blogCollection.countDocuments({
        name: { $regex: searchNameTermRegExp },
      })
      const pagesCount = Math.ceil(totalCount / pageSize)

      return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: blogs.map(blogMap),
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  getArrangedPostsOfBlog: async (
    id: string,
    query: GetArrangedPostsByBlogQuery,
  ): Promise<ArrangedPostsViewModel | null> => {
    const pageNumber = query.pageNumber || 1
    const pageSize = query.pageSize || 10
    const skip = (pageNumber - 1) * pageSize // skip posts for previous pages
    const sortBy = query.sortBy === 'id' ? '_id' : query.sortBy || 'createdAt'
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1

    try {
      const blogId = new ObjectId(id)

      const posts = await postCollection
        .find({ blogId })
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray()

      const totalCount = await postCollection.countDocuments({ blogId })
      const pagesCount = Math.ceil(totalCount / pageSize)

      return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount,
        items: posts.map(postMap),
      }
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findBlog: async (id: string): Promise<BlogViewModel | null> => {
    try {
      const _id = toObjectId(id)

      const blog = await blogCollection.findOne({ _id })

      if (!blog) return null

      return blogMap(blog)
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
