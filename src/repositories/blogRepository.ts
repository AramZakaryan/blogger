import { BlogDbType, BlogViewModel, CreateBlogBody, UpdateBlogBody } from '../types'
import { blogCollection } from '../db'
import { ObjectId, WithId } from 'mongodb'
import { blogQueryRepository } from '../queryRepositories'

export const blogRepository = {
  createBlog: async (body: CreateBlogBody): Promise<BlogViewModel['id'] | null> => {
    try {
      const blog: BlogDbType = {
        ...body,
        createdAt: new Date(),
        isMembership: false,
      }

      const insertOneResult = await blogCollection.insertOne(blog)

      if (!insertOneResult.acknowledged) return null

      return insertOneResult.insertedId.toString()
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  updateBlog: async (
    id: BlogViewModel['id'],
    body: UpdateBlogBody,
  ): Promise<BlogViewModel['id'] | null> => {
    try {
      const _id = new ObjectId(id)

      const updateOneInfo = await blogCollection.updateOne({ _id }, { $set: { ...body } })

      if (!updateOneInfo.acknowledged) return null
      return _id.toString()
    } catch (err) {
      // console.log(err)
      return null
    }
  },

  deleteBlog: async (id: BlogViewModel['id']): Promise<BlogViewModel['id'] | null> => {
    try {
      const _id = new ObjectId(id)

      const deleteOneInfo = await blogCollection.deleteOne({ _id })

      if (!deleteOneInfo.acknowledged) return null

      return _id.toString()
    } catch (err) {
      // console.log(err)
      return null
    }
  },
}
