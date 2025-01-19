import { BlogType, BlogViewModel, UpdateBlogBody } from '../types'
import { blogCollection } from '../db'
import { ObjectId, WithId } from 'mongodb'
import { blogQueryRepository } from '../queryRepositories'

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

  updateBlog: async (id: string, body: UpdateBlogBody): Promise<ObjectId | null> => {
    try {
      const _id = new ObjectId(id)

      const updateOneInfo = await blogCollection.updateOne({ _id }, { $set: { ...body } })

      if (!updateOneInfo.acknowledged) return null
      return _id
    } catch (err) {
      // console.log(err)
      return null
    }
  },
  deleteBlog: async (id: string): Promise<ObjectId | null> => {
    try {

      const _id = new ObjectId(id)

      const deleteOneInfo = await blogCollection.deleteOne({ _id })

      if (!deleteOneInfo.acknowledged) return null

      return _id
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
