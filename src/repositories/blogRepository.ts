import {
  ArrangedBlogsViewModel,
  ArrangedPostsViewModel,
  BlogType,
  CreateBlogBody,
  GetArrangedBlogsQuery,
  GetArrangedPostsByBlogQuery,
  UpdateBlogBody,
} from '../types'
import { blogCollection, postCollection } from '../db'
import { blogMap, postMap } from '../common'
import { ObjectId, WithId } from 'mongodb'

export const blogRepository = {
  createBlog: async (blog: BlogType): Promise<string | null> => {
    try {
      const insertOneInfo = await blogCollection.insertOne(blog)

      if (!insertOneInfo.acknowledged) return null

      return insertOneInfo.insertedId.toString()

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
