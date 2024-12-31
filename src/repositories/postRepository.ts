import {
  ArrangedPostsViewModel,
  CreatePostBody,
  GetArrangedPostsQuery,
  PostType,
  UpdatePostBody,
} from '../types'
import { blogRepository } from './blogRepository'
import { blogCollection, postCollection } from '../db'
import { ObjectId, WithId } from 'mongodb'
import { blogMap, postMap } from '../common'

export const postRepository = {
  getArrangedPosts: async (
    query: GetArrangedPostsQuery,
  ): Promise<ArrangedPostsViewModel | null> => {
    const pageNumber = query.pageNumber || 1
    const pageSize = query.pageSize || 10
    const skip = (pageNumber - 1) * pageSize // skip posts for previous pages

    const sortBy = query.sortBy === 'id' ? '_id' : query.sortBy || 'createdAt'
    const sortDirection = query.sortDirection === 'asc' ? 1 : -1

    try {
      const posts = await postCollection
        .find()
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray()

      const totalCount = await postCollection.countDocuments()
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

  findPost: async (id: string): Promise<WithId<PostType> | null> => {
    try {
      const _id = new ObjectId(id)

      return await postCollection.findOne({ _id })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  createPost: async (body: CreatePostBody): Promise<WithId<PostType> | null> => {
    try {
      const blog = await blogRepository.findBlog(body.blogId)

      if (!blog) return null

      const post = {
        ...body,
        blogId: blog._id,
        blogName: blog.name,
        createdAt: new Date(),
      }

      const insertOneInfo = await postCollection.insertOne(post)

      if (!insertOneInfo.acknowledged) return null

      return await postCollection.findOne({ _id: insertOneInfo.insertedId })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  updatePost: async (id: string, body: UpdatePostBody): Promise<WithId<PostType> | null> => {
    try {
      const blog = await blogRepository.findBlog(body.blogId)

      if (!blog) return null

      const blogName = blog.name

      const _id = new ObjectId(id)

      const blogId = new ObjectId(body.blogId)

      const updateOneInfo = await postCollection.updateOne(
        { _id },
        { $set: { ...body, blogId, blogName } },
      )

      if (!updateOneInfo.acknowledged) return null

      return await postCollection.findOne({ _id })
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  deletePost: async (id: string): Promise<WithId<PostType> | null> => {
    try {
      const _id = new ObjectId(id)

      const post = await postCollection.findOne({ _id })

      const deleteOneInfo = await postCollection.deleteOne({ _id })

      if (!deleteOneInfo.acknowledged) return null

      return post
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
