import { BlogType, CreateBlogBody, UpdateBlogBody } from '../types'
import { blogCollection } from '../db/mongo'
import { ObjectId, WithId } from 'mongodb'

export const blogRepository = {
  getBlogs: async (): Promise<WithId<BlogType>[] | null> => {
    try {
      return await blogCollection.find({}).toArray()
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
