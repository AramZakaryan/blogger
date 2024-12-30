import {
  ArrangedBlogsViewModel,
  BlogType,
  CreateBlogBody,
  GetArrangedBlogsQuery,
  GetArrangedPostsByBlogQuery,
  PostType,
  UpdateBlogBody,
} from '../types'
import { blogCollection, postCollection } from '../db'
import { ObjectId, WithId } from 'mongodb'
import { blogMap } from '../common'

export const blogRepository = {
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

      const totalCount = await blogCollection.countDocuments()
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

  getArrangedPostsByBlog: async (
    id: string,
    query: GetArrangedPostsByBlogQuery,
  ): Promise<WithId<PostType>[] | null> => {
    const pageNumber = query.pageNumber || 1
    const pageSize = query.pageSize || 10
    const skip = (pageNumber - 1) * pageSize // skip posts for previous pages
    const sortBy = query.sortBy === 'id' ? '_id' : query.sortBy || 'createdAt'
    const sortDirection = query.sortDirection === 'desc' ? -1 : 1

    try {
      const blogId = new ObjectId(id)
      return await postCollection
        .find({})
        .sort({ [sortBy]: sortDirection })
        .filter({ blogId })
        .skip(skip)
        .limit(pageSize)
        .toArray()
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  findBlog: async (id: string): Promise<WithId<BlogType> | null> => {
    try {
      const _id = new ObjectId(id)
      return await blogCollection.findOne({ _id })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  createBlog: async (body: CreateBlogBody): Promise<WithId<BlogType> | null> => {
    try {
      const blog = {
        ...body,
        createdAt: new Date(),
        isMembership: false,
      }

      const insertOneInfo = await blogCollection.insertOne(blog)

      if (!insertOneInfo.acknowledged) return null

      return await blogCollection.findOne({ _id: insertOneInfo.insertedId })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  updateBlog: async (id: string, body: UpdateBlogBody): Promise<WithId<BlogType> | null> => {
    try {
      const _id = new ObjectId(id)

      const updateOneInfo = await blogCollection.updateOne({ _id }, { $set: { ...body } })

      if (!updateOneInfo.acknowledged) return null

      return await blogCollection.findOne({ _id })
    } catch (err) {
      // console.log(err)
      return null
    }
  },
  deleteBlog: async (id: string): Promise<WithId<BlogType> | null> => {
    try {
      const _id = new ObjectId(id)

      const blog = await blogCollection.findOne({ _id })

      const deleteOneInfo = await blogCollection.deleteOne({ _id })

      if (!deleteOneInfo.acknowledged) return null

      return blog
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
